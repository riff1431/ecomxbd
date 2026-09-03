"use client";

import { useState, useEffect, useRef } from "react";
import { formatPrice } from "@/lib/utils";
import {
  Printer,
  ArrowLeft,
  Truck,
  Package,
  CheckCircle2,
  FileText,
  Tag,
  Copy,
  Check,
  Download,
  Languages,
  Loader2,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { InvoiceSettings } from "@/features/settings/actions";

export default function InvoicePrintClient({
  order,
  config,
  invoiceSettings,
}: {
  order: any;
  config: any;
  invoiceSettings?: InvoiceSettings;
}) {
  const [printMode, setPrintMode] = useState<"invoice" | "thermal">(
    invoiceSettings?.default_print_mode || "invoice"
  );
  const [lang, setLang] = useState<"en" | "bn">(
    invoiceSettings?.default_language || "en"
  );
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [copied, setCopied] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const address = order.shipping_address_snapshot || {};
  const items = order.order_items || [];

  // Dynamic branding from Admin Settings
  const brandName =
    invoiceSettings?.invoice_brand_name ||
    config?.headerConfig?.logoText ||
    "Blush & Budget";
  const logoSrc =
    invoiceSettings?.invoice_logo_url ||
    config?.headerConfig?.logoImageUrl ||
    "/images/blush-logo.png";
  const accentColor = invoiceSettings?.invoice_accent_color || "#e91e63";

  const totalQuantity = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
  const courier = order.courier_name || "SteadFast Courier";
  const consignmentCode = order.consignment_id || `SF-${order.order_number.replace(/\D/g, "")}`;
  const isCod = order.payment_method === "cod" || !order.payment_method;
  const baseUrl = typeof window !== "undefined" && window.location.origin ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");
  const trackingUrl = `${baseUrl}/account/track?order=${order.order_number}`;

  // Bengali Digits Helper
  const toBn = (val: string | number) => {
    if (lang !== "bn") return String(val);
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(val).replace(/[0-9]/g, (d) => bnDigits[+d]);
  };

  const formatCurrency = (amount: number) => {
    if (lang === "bn") {
      return `৳${toBn(amount.toLocaleString("en-IN"))}`;
    }
    return formatPrice(amount);
  };

  // Generate Real Vector QR Code DataURL on mount
  useEffect(() => {
    QRCode.toDataURL(trackingUrl, {
      margin: 1,
      width: 256,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error("QR Code Generation Error:", err));
  }, [trackingUrl]);

  // Direct Print Handler
  const handlePrint = () => {
    window.print();
  };

  // 1-Click PDF Download Handler (Robust HTML2Canvas + jsPDF with onclone dimensions)
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setDownloadingPdf(true);

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const target = clonedDoc.querySelector(
            printMode === "thermal" ? ".print-area-thermal" : ".print-area-invoice"
          ) as HTMLElement;
          if (target) {
            target.style.position = "static";
            target.style.transform = "none";
            target.style.margin = "0";
            if (printMode === "invoice") {
              target.style.width = "794px";
              target.style.minWidth = "794px";
              target.style.maxWidth = "794px";
              target.style.minHeight = "1123px";
              target.style.padding = "38px 45px";
            } else {
              target.style.width = "378px";
              target.style.minWidth = "378px";
              target.style.maxWidth = "378px";
              target.style.minHeight = "567px";
              target.style.padding = "16px";
            }
          }
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);

      if (printMode === "thermal") {
        // Exact 4x6 inch (100mm x 150mm) POS Thermal PDF
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [100, 150],
        });
        pdf.addImage(imgData, "JPEG", 0, 0, 100, 150);
        pdf.save(`${order.order_number}_Thermal_Label.pdf`);
      } else {
        // Exact A4 PDF (210mm x 297mm)
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
        pdf.save(`${order.order_number}_Tax_Invoice.pdf`);
      }
    } catch (err) {
      console.error("PDF Download error:", err);
      // Fallback seamlessly to native print dialog
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Translations dictionary for full Bangla / English
  const t = {
    en: {
      invoiceTitle: invoiceSettings?.invoice_title || "INVOICE",
      invoiceTo: "INVOICE TO:",
      date: "Date:",
      invoiceNo: "Invoice No:",
      courier: "Courier:",
      totalDue: "TOTAL DUE :",
      description: "Description",
      qty: "Qty",
      price: "Price",
      total: "Total",
      subtotal: "Sub Total",
      discount: "Discount",
      deliveryCharge: "Delivery Charge",
      grandTotal: "Grand Total",
      paymentMethod: "Payment Method:",
      mode: "Mode:",
      status: "Status:",
      doorstepNotice:
        invoiceSettings?.invoice_footer_notes ||
        "* Please inspect items at doorstep before completing COD payment.",
      contactSupport: "Contact Support:",
      authSignature: invoiceSettings?.invoice_authorized_signatory_text || "Authorized Signature",
      tagline: invoiceSettings?.invoice_tagline || "Authentic Skincare & Beauty Imports",
      addressText:
        invoiceSettings?.invoice_address || "House 14, Road 27, Dhanmondi, Dhaka, Bangladesh",
      free: "FREE",
      thermalTrackingNo: "Tracking Number:",
      thermalDeliverTo: "DELIVER TO:",
      thermalSender: "SENDER (HUB):",
      weight: "WEIGHT:",
      totalItems: "TOTAL ITEMS:",
      routing: "ROUTING & SORTING",
      doNotShip: "DO NOT SHIP IF DAMAGED • RETURN TO HUB",
      scanToTrack: "Scan to track parcel",
      orderDate: "ORDER DATE:",
      tabA4: "A4 Tax Invoice",
      tabThermal: "4×6 Thermal Label",
      downloadPdf: "Download PDF",
      printA4Btn: "Print A4 Invoice",
      printThermalBtn: "Print 4×6 Label",
      closeWindow: "Close Window",
    },
    bn: {
      invoiceTitle: invoiceSettings?.invoice_title ? invoiceSettings.invoice_title : "ইনভয়েস",
      invoiceTo: "প্রাপক / কাস্টমার:",
      date: "তারিখ:",
      invoiceNo: "ইনভয়েস নং:",
      courier: "কুরিয়ার:",
      totalDue: "সর্বমোট প্রদেয় :",
      description: "পণ্যের বিবরণ",
      qty: "পরিমাণ",
      price: "একক মূল্য",
      total: "মোট",
      subtotal: "সাবটোটাল",
      discount: "ডিসকাউন্ট",
      deliveryCharge: "ডেলিভারি চার্জ",
      grandTotal: "সর্বমোট বিল",
      paymentMethod: "পেমেন্ট মাধ্যম:",
      mode: "মাধ্যম:",
      status: "স্ট্যাটাস:",
      doorstepNotice:
        invoiceSettings?.invoice_footer_notes ||
        "* অনুগ্রহ করে ডেলিভারি রাইডারের সামনে পার্সেলটি চেক করে মূল্য পরিশোধ করুন।",
      contactSupport: "কাস্টমার সাপোর্ট:",
      authSignature: invoiceSettings?.invoice_authorized_signatory_text || "কর্তৃপক্ষের স্বাক্ষর",
      tagline: invoiceSettings?.invoice_tagline || "১০০% অথেনটিক স্কিনকেয়ার ও বিউটি ইম্পোর্টস",
      addressText:
        invoiceSettings?.invoice_address || "হাউজ ১৪, রোড ২৭, ধানমন্ডি, ঢাকা, বাংলাদেশ",
      free: "ফ্রি (০৳)",
      thermalTrackingNo: "ট্র্যাকিং নম্বর:",
      thermalDeliverTo: "ডেলিভারি ঠিকানা (প্রাপক):",
      thermalSender: "প্রেরক (রিটার্ন হাব):",
      weight: "ওজন:",
      totalItems: "মোট পণ্য:",
      routing: "কুরিয়ার রাউটিং ও শর্টিং",
      doNotShip: "ক্ষতিগ্রস্ত হলে ডেলিভারি করবেন না • হাবে ফেরত পাঠান",
      scanToTrack: "পার্সেল ট্র্যাক করতে স্ক্যান করুন",
      orderDate: "অর্ডার তারিখ:",
      tabA4: "A4 ট্যাক্স ইনভয়েস",
      tabThermal: "৪×৬ থার্মাল লেবেল",
      downloadPdf: "পিডিএফ ডাউনলোড",
      printA4Btn: "ইনভয়েস প্রিন্ট",
      printThermalBtn: "লেবেল প্রিন্ট",
      closeWindow: "উইন্ডো বন্ধ করুন",
    },
  }[lang];

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-6 lg:p-8 print:p-0 print:m-0 print:bg-white text-gray-900 font-sans">
      {/* Global Print Isolation CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');

        body {
          font-family: 'Inter', 'Hind Siliguri', sans-serif;
        }

        @media print {
          @page {
            size: ${printMode === "thermal" ? "100mm 150mm" : "A4 portrait"};
            margin: 0mm !important;
          }

          body, html {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          header, footer, nav, aside, .no-print, [role="navigation"] {
            display: none !important;
          }

          .print-area-invoice {
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 10mm 12mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
          }

          .print-area-thermal {
            width: 100mm !important;
            height: 150mm !important;
            max-width: 100mm !important;
            max-height: 150mm !important;
            margin: 0 !important;
            padding: 3mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      {/* Top Floating Action Toolbar (Fully Responsive on Mobile, Tablet & Desktop) */}
      <div className="no-print mx-auto max-w-4xl mb-4 sm:mb-6 bg-white rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors shrink-0"
            title={t.closeWindow}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-black text-gray-900 flex items-center gap-1.5 flex-wrap">
              <span className="truncate">{order.order_number}</span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-pink-100 text-sg-pink font-bold whitespace-nowrap">
                {isCod ? "Cash on Delivery" : "Online Paid"}
              </span>
            </h2>
            <p className="text-[11px] text-gray-500 truncate">
              {address.name || order.guest_name} • {address.phone || order.guest_phone}
            </p>
          </div>
        </div>

        {/* Action Controls: Format Switcher, Lang Toggle, Download & Print */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Format Toggle Pill */}
          <div className="col-span-2 sm:col-auto bg-gray-100 p-1 rounded-xl flex items-center justify-center gap-1 border border-gray-200">
            <button
              type="button"
              onClick={() => setPrintMode("invoice")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                printMode === "invoice"
                  ? "bg-white text-sg-pink shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{t.tabA4}</span>
            </button>
            <button
              type="button"
              onClick={() => setPrintMode("thermal")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                printMode === "thermal"
                  ? "bg-white text-sg-pink shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              <span>{t.tabThermal}</span>
            </button>
          </div>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
            title="Toggle Bangla / English"
          >
            <Languages className="h-3.5 w-3.5 text-sg-pink" />
            <span>{lang === "en" ? "বাংলা" : "English"}</span>
          </button>

          {/* 1-Click PDF Download Button */}
          <Button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs px-3.5 py-2 rounded-xl shadow-2xs justify-center"
          >
            {downloadingPdf ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin text-sg-pink" />
            ) : (
              <Download className="h-4 w-4 mr-1.5 text-gray-700" />
            )}
            {t.downloadPdf}
          </Button>

          <Button
            onClick={handlePrint}
            style={{ backgroundColor: accentColor }}
            className="col-span-2 sm:col-auto text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:opacity-95 justify-center"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            {printMode === "invoice" ? t.printA4Btn : t.printThermalBtn}
          </Button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. CORPORATE PINK A4 TAX INVOICE (Exact A4 210mm × 297mm)     */}
      {/* ============================================================ */}
      {printMode === "invoice" && (
        <div className="flex justify-center w-full overflow-x-auto pb-8">
          <div
            ref={printRef}
            className="print-area-invoice w-full max-w-[210mm] sm:w-[210mm] sm:min-h-[297mm] bg-white p-4 sm:p-[10mm_14mm] border border-gray-200 shadow-xl print:shadow-none print:border-none text-gray-900 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4 sm:space-y-6">
              {/* Top Brand & Title Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 sm:pb-4">
                <div className="space-y-0.5 sm:space-y-1">
                  {/* Brand Logo */}
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={brandName}
                      crossOrigin="anonymous"
                      className="h-10 sm:h-14 w-auto object-contain mb-0.5"
                    />
                  ) : (
                    <span className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-wider block">
                      {brandName}
                    </span>
                  )}
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    {t.tagline}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-gray-500">{t.addressText}</p>
                  {invoiceSettings?.invoice_tax_id_or_bin && (
                    <p className="text-[9px] sm:text-[9.5px] font-bold text-gray-600 font-mono">
                      {invoiceSettings.invoice_tax_id_or_bin}
                    </p>
                  )}
                </div>

                <div className="text-left sm:text-right w-full sm:w-auto flex sm:block items-center justify-between">
                  <div>
                    <h1
                      className="text-2xl sm:text-3xl font-black uppercase tracking-wider"
                      style={{ color: accentColor }}
                    >
                      {t.invoiceTitle}
                    </h1>
                    <p className="text-xs font-mono font-bold text-gray-600 mt-0.5">
                      {order.order_number}
                    </p>
                  </div>
                  {invoiceSettings?.invoice_show_barcode !== false && (
                    <div className="pt-1 flex justify-end">
                      <svg className="w-28 sm:w-36 h-5 sm:h-6" viewBox="0 0 140 22">
                        <rect x="0" y="0" width="140" height="22" fill="#ffffff" />
                        {[3, 7, 10, 15, 19, 23, 27, 32, 36, 40, 46, 50, 54, 59, 64, 69, 74, 79, 84, 89, 94, 98, 103, 108, 113, 118, 123, 128, 133].map((x, i) => (
                          <rect key={i} x={x} y="1" width={i % 2 === 0 ? 2 : 1.2} height="20" fill="#000000" />
                        ))}
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Full-Width Tinted Grey Metadata Banner */}
              <div className="bg-gray-100/90 rounded-xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border border-gray-200">
                {/* INVOICE TO (Customer) */}
                <div className="space-y-0.5">
                  <span className="font-bold text-[9px] sm:text-[10px] uppercase text-gray-500 tracking-wider block">
                    {t.invoiceTo}
                  </span>
                  <p className="font-black text-xs sm:text-sm text-gray-900 uppercase">
                    {address.name || order.guest_name || "VALUED CUSTOMER"}
                  </p>
                  <p className="text-gray-600 font-medium text-[10px] sm:text-[11px] leading-tight">
                    {address.address || "Address on record"}
                    {address.thana ? `, ${address.thana}` : ""}
                    {address.district ? `, ${address.district}` : ""}
                  </p>
                  <p className="font-mono font-bold text-gray-800 text-[10px] sm:text-[11px]">
                    {toBn(address.phone || order.guest_phone || "")}
                  </p>
                </div>

                {/* Date & Invoice No */}
                <div className="space-y-1 sm:text-center text-[10px] sm:text-[11px] border-t sm:border-t-0 sm:border-x border-gray-200 pt-2 sm:pt-0 sm:px-2">
                  <div>
                    <span className="text-gray-500 font-medium">{t.date} </span>
                    <span className="font-bold text-gray-900 font-mono">
                      {toBn(
                        new Date(order.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">{t.invoiceNo} </span>
                    <span className="font-bold text-gray-900 font-mono">{order.order_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">{t.courier} </span>
                    <span className="font-bold text-emerald-700">{courier}</span>
                  </div>
                </div>

                {/* TOTAL DUE Box with Offline Vector QR Code */}
                <div className="flex items-center justify-between sm:justify-end gap-3 text-right border-t sm:border-t-0 border-gray-200 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="font-bold text-[9px] sm:text-[10px] uppercase text-gray-500 tracking-wider block">
                      {t.totalDue}
                    </span>
                    <span
                      className="text-lg sm:text-xl font-black font-mono"
                      style={{ color: accentColor }}
                    >
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                  {invoiceSettings?.invoice_show_qr_code !== false && qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="Order QR Code"
                      crossOrigin="anonymous"
                      className="h-11 w-11 sm:h-13 sm:w-13 rounded-lg border border-gray-300 bg-white p-0.5 shrink-0"
                      title={t.scanToTrack}
                    />
                  ) : null}
                </div>
              </div>

              {/* Line Items Table with Custom Accent Header */}
              <div className="rounded-xl border border-gray-200 overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[420px] sm:min-w-full">
                  <thead
                    className="text-white uppercase font-black text-[9px] sm:text-[10px] tracking-wider"
                    style={{ backgroundColor: accentColor }}
                  >
                    <tr>
                      <th className="px-3 sm:px-4 py-2 sm:py-2.5">{t.description}</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-2.5 text-center w-14 sm:w-16">{t.qty}</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-2.5 text-right w-20 sm:w-24">{t.price}</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-2.5 text-right w-24 sm:w-28">{t.total}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-[10px] sm:text-[11px]">
                    {items.map((item: any, idx: number) => (
                      <tr
                        key={item.id || idx}
                        className={idx % 2 === 1 ? "bg-gray-50/70" : "bg-white"}
                      >
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                          <span className="font-bold text-gray-900 block">
                            {item.product_name_snapshot}
                          </span>
                          {item.sku_snapshot && (
                            <span className="font-mono text-[8.5px] sm:text-[9px] text-gray-400">
                              SKU: {item.sku_snapshot}
                            </span>
                          )}
                        </td>
                        <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-center font-black text-gray-800">
                          {toBn(item.quantity)}
                        </td>
                        <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-right font-medium text-gray-700 font-mono">
                          {formatCurrency(item.unit_price)}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right font-black text-gray-900 font-mono">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subtotal, Discount & Grand Total & Signature Block */}
            <div className="pt-3 sm:pt-4 border-t border-gray-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
                {/* Payment Method & Contact */}
                <div className="space-y-2.5 sm:space-y-3 text-[10px] sm:text-[11px] w-full sm:max-w-sm">
                  <div className="space-y-0.5">
                    <span className="font-black text-gray-900 text-xs block uppercase tracking-wider">
                      {t.paymentMethod}
                    </span>
                    <p className="text-gray-700 font-bold">
                      {t.mode}{" "}
                      <span className="uppercase" style={{ color: accentColor }}>
                        {isCod
                          ? lang === "bn"
                            ? "ক্যাশ অন ডেলিভারি (COD)"
                            : "Cash on Delivery (COD)"
                          : order.payment_method}
                      </span>
                    </p>
                    <p className="text-gray-500 text-[9.5px] sm:text-[10px]">
                      {t.status} <strong className="uppercase text-gray-800">{order.payment_status}</strong>
                    </p>
                    <p className="text-gray-400 text-[9.5px] sm:text-[10px] italic leading-tight">{t.doorstepNotice}</p>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-gray-200 text-[9.5px] sm:text-[10px] text-gray-600">
                    <span className="font-black text-gray-900 block uppercase tracking-wider">
                      {t.contactSupport}
                    </span>
                    <p>{invoiceSettings?.invoice_email || "support@blushandbudget.com"} • {invoiceSettings?.invoice_phone || "+880 1700-000000"}</p>
                    <p>{invoiceSettings?.invoice_website || "https://blushandbudget.com"}</p>
                  </div>
                </div>

                {/* Financial Totals */}
                <div className="w-full sm:w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600 font-medium">
                    <span>{t.subtotal}</span>
                    <span className="font-bold text-gray-900 font-mono">
                      {formatCurrency(order.subtotal || order.total)}
                    </span>
                  </div>

                  {order.discount_amount > 0 && (
                    <div className="flex justify-between py-1 border-b border-gray-100 text-emerald-600 font-bold">
                      <span>{t.discount}</span>
                      <span className="font-mono">-{formatCurrency(order.discount_amount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600 font-medium">
                    <span>{t.deliveryCharge}</span>
                    <span className="font-bold text-gray-900 font-mono">
                      {order.shipping_amount === 0 ? t.free : formatCurrency(order.shipping_amount)}
                    </span>
                  </div>

                  {/* Grand Total Solid Box */}
                  <div
                    className="text-white p-2.5 rounded-xl flex justify-between items-center text-sm font-black shadow-xs mt-1"
                    style={{ backgroundColor: accentColor }}
                  >
                    <span className="uppercase tracking-wider">{t.grandTotal}</span>
                    <span className="text-base font-mono font-black">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  {/* Authorised Signature Line */}
                  <div className="pt-4 sm:pt-5 text-right space-y-0.5">
                    {invoiceSettings?.invoice_signature_image_url ? (
                      <img
                        src={invoiceSettings.invoice_signature_image_url}
                        alt="Signature"
                        crossOrigin="anonymous"
                        className="h-8 w-auto ml-auto object-contain mb-0.5"
                      />
                    ) : (
                      <p className="font-serif italic text-sm sm:text-base text-gray-800">{brandName}</p>
                    )}
                    <div className="w-36 ml-auto border-t border-gray-400 pt-0.5 text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center">
                      {t.authSignature}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. DARAZ-STYLE 4×6 POS THERMAL LABEL (Exact 100mm × 150mm)   */}
      {/* ============================================================ */}
      {printMode === "thermal" && (
        <div className="flex justify-center">
          <div
            ref={printRef}
            className="print-area-thermal w-[100mm] h-[150mm] max-w-[100mm] max-h-[150mm] bg-white p-4 border-2 border-dashed border-gray-400 shadow-xl print:shadow-none print:border-none text-gray-900 space-y-2.5 font-sans relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-2">
              {/* Header Row with Logo, Hub & Offline Vector QR Code */}
              <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                <div className="space-y-0.5">
                  {invoiceSettings?.thermal_logo_url || logoSrc ? (
                    <img
                      src={invoiceSettings?.thermal_logo_url || logoSrc}
                      alt={brandName}
                      crossOrigin="anonymous"
                      className="h-9 w-auto object-contain"
                    />
                  ) : (
                    <span className="font-black text-sm uppercase tracking-wider block">
                      {brandName}
                    </span>
                  )}
                  <span className="text-[9px] font-bold text-gray-700 block uppercase font-mono">
                    {invoiceSettings?.thermal_header_title || `${courier} Express`}
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-[8px] font-black uppercase text-gray-600 block">
                    {t.orderDate} {toBn(new Date(order.created_at).toLocaleDateString("en-GB"))}
                  </span>
                  {invoiceSettings?.invoice_show_qr_code !== false && qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code"
                      crossOrigin="anonymous"
                      className="h-11 w-11 border border-black p-0.5 ml-auto bg-white"
                    />
                  ) : null}
                </div>
              </div>

              {/* Primary Tracking Barcode Block */}
              <div className="text-center py-0.5 border-b-2 border-black space-y-0.5">
                <span className="text-[9px] font-bold text-gray-600 uppercase block font-mono">
                  {t.thermalTrackingNo}
                </span>
                <p className="font-mono text-sm font-black tracking-wider text-black">
                  {consignmentCode}
                </p>
                {/* High-Contrast Thermal SVG Barcode */}
                <div className="py-0.5 flex justify-center">
                  <svg className="w-56 h-9" viewBox="0 0 200 36">
                    <rect x="0" y="0" width="200" height="36" fill="#ffffff" />
                    {[
                      2, 6, 9, 14, 18, 22, 26, 31, 35, 38, 44, 48, 52, 57, 62, 66, 70, 75, 80, 84,
                      88, 93, 98, 102, 106, 111, 116, 120, 125, 130, 134, 139, 144, 148, 153, 158,
                      162, 167, 172, 176, 181, 186, 190, 195,
                    ].map((x, i) => (
                      <rect
                        key={i}
                        x={x}
                        y="1"
                        width={i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.2}
                        height="34"
                        fill="#000000"
                      />
                    ))}
                  </svg>
                </div>
                {/* Prominent COD Badge */}
                <div>
                  <span className="inline-block border-2 border-black px-2.5 py-0.5 font-black text-xs uppercase font-mono rounded bg-white text-black">
                    {isCod
                      ? `COD : ${formatCurrency(order.total)}`
                      : lang === "bn"
                      ? "পেইড (৳০)"
                      : "Non-COD (PAID ৳0)"}
                  </span>
                </div>
              </div>

              {/* 2-Column Delivery & Shipper Address Grid */}
              <div className="grid grid-cols-2 gap-2 text-[9px] border-b-2 border-black pb-2">
                {/* Receiver (Deliver To) */}
                <div className="border-r-2 border-black pr-1.5 space-y-0.5">
                  <span className="font-black uppercase tracking-wider block bg-black text-white px-1 py-0.2 rounded text-[7px] w-fit">
                    {t.thermalDeliverTo}
                  </span>
                  <p className="font-black text-[11px] text-black">{address.name || order.guest_name}</p>
                  <p className="font-black text-[11px] font-mono text-black">
                    {toBn(address.phone || order.guest_phone || "")}
                  </p>
                  <p className="font-medium text-gray-900 leading-tight">{address.address}</p>
                  <p className="font-black uppercase text-[9px] pt-0.5">
                    {address.thana ? `${address.thana}, ` : ""}
                    {address.district || "DHAKA"}
                  </p>
                </div>

                {/* Sender (Shipper Hub) */}
                <div className="space-y-0.5 pl-0.5">
                  <span className="font-black uppercase tracking-wider block bg-gray-200 text-black px-1 py-0.2 rounded text-[7px] w-fit">
                    {t.thermalSender}
                  </span>
                  <p className="font-black text-[11px] text-black">{brandName}</p>
                  <p className="text-gray-800 leading-tight">
                    {invoiceSettings?.thermal_return_address || "House 42, Road 11, Banani"}
                  </p>
                  <p className="font-bold text-black">Dhaka, Bangladesh</p>
                  <p className="font-mono text-[8px] text-gray-700">
                    Phone: {invoiceSettings?.thermal_sender_phone || "+880 1700-000000"}
                  </p>
                </div>
              </div>

              {/* Package Breakdown & Weight */}
              {invoiceSettings?.thermal_show_item_breakdown !== false && (
                <div className="border-b-2 border-black pb-1.5 text-[9px] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{t.weight} {toBn("0.5")} KG</span>
                    <span>{t.totalItems} {toBn(totalQuantity)}</span>
                  </div>
                  <div className="space-y-1">
                    {items.map((it: any) => (
                      <div key={it.id} className="flex justify-between items-start text-gray-900 font-medium gap-2">
                        <span className="leading-tight wrap-break-word flex-1">• {it.product_name_snapshot}</span>
                        <span className="font-mono font-bold shrink-0">x{toBn(it.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Carrier Routing Barcode & Instructions */}
            <div className="text-center pt-1 space-y-0.5">
              <span className="text-[8px] font-black uppercase text-gray-600 block font-mono">
                {courier.toUpperCase()} {t.routing}
              </span>
              <div className="py-0.5 flex justify-center">
                <svg className="w-48 h-7" viewBox="0 0 180 26">
                  <rect x="0" y="0" width="180" height="26" fill="#ffffff" />
                  {[
                    3, 7, 11, 16, 21, 25, 30, 35, 39, 44, 49, 53, 58, 63, 67, 72, 77, 81, 86, 91,
                    95, 100, 105, 109, 114, 119, 123, 128, 133, 137, 142, 147, 151, 156, 161, 165,
                    170, 175,
                  ].map((x, i) => (
                    <rect
                      key={i}
                      x={x}
                      y="1"
                      width={i % 2 === 0 ? 2.5 : 1.2}
                      height="24"
                      fill="#000000"
                    />
                  ))}
                </svg>
              </div>
              <p className="font-mono text-[9px] font-black uppercase">{order.order_number}</p>
              <p className="text-[7px] font-black uppercase tracking-widest text-gray-600">
                {invoiceSettings?.thermal_instructions || t.doNotShip}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
