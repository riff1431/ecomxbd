"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Loader2,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/shared/ui/button";
import { formatPrice } from "@/lib/utils";
import { sendSmsNotification } from "@/features/sms/actions";

interface AbandonedCheckoutsClientProps {
  initialCheckouts: any[];
}

export function AbandonedCheckoutsClient({ initialCheckouts }: AbandonedCheckoutsClientProps) {
  const [checkouts, setCheckouts] = useState(initialCheckouts);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSendRecoverySms = async (item: any) => {
    setLoadingId(item.id);
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");
    try {
      await sendSmsNotification({
        recipientPhone: item.customer_phone,
        eventType: "order_confirmed",
        variables: {
          customer_name: item.customer_name,
          order_number: "BAG",
          invoice_url: `${origin}/checkout`,
        },
      });

      setCheckouts((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, recovery_status: "sms_sent" } : c))
      );
      setFeedback(`Recovery SMS dispatched to ${item.customer_phone}!`);
      setTimeout(() => setFeedback(null), 3500);
    } catch {
      setFeedback("Failed to send SMS.");
    }
    setLoadingId(null);
  };

  const columns: Column<any>[] = [
    {
      key: "customer",
      header: "Lead Contact",
      sortable: true,
      cell: (row) => {
        const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");
        const rawPhone = (row.customer_phone || "").replace(/[^0-9]/g, "");
        const bdPhone = rawPhone.startsWith("88") ? rawPhone : `88${rawPhone}`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${bdPhone}&text=${encodeURIComponent(
          `Hi ${row.customer_name}! We noticed you left some authentic skincare items in your Blush & Budget bag. Complete your order now with free shipping code BLUSH5: ${origin}/checkout`
        )}`;

        return (
          <div className="space-y-1">
            <span className="font-bold text-gray-900 text-xs block">{row.customer_name}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-gray-600 font-semibold">{row.customer_phone}</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Recover via WhatsApp"
                className="text-emerald-600 hover:text-emerald-700 font-bold"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={`tel:${row.customer_phone}`}
                title="Call Customer"
                className="text-gray-400 hover:text-gray-600"
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
            </div>
            {row.customer_email && (
              <span className="text-[10px] text-gray-400 block">{row.customer_email}</span>
            )}
          </div>
        );
      },
    },
    {
      key: "location",
      header: "Location",
      cell: (row) => (
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-gray-900 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-[#e91e63]" /> {row.district || "Dhaka"}
          </span>
          <span className="text-gray-500 text-[11px] block truncate max-w-[200px]">
            {row.address || "Address field captured"}
          </span>
        </div>
      ),
    },
    {
      key: "cart",
      header: "Abandoned Items & Value",
      cell: (row) => (
        <div className="text-xs space-y-1">
          <div className="font-black text-gray-900 text-sm">
            {formatPrice(row.cart_total)}
          </div>
          <div className="text-gray-500 text-[11px]">
            {row.cart_items?.map((item: any, idx: number) => (
              <span key={idx} className="block truncate max-w-[240px]">
                • {item.quantity}x {item.name}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Recovery Status",
      cell: (row) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase border ${
            row.recovery_status === "converted"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : row.recovery_status === "sms_sent"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {row.recovery_status.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Recovery Action",
      cell: (row) => {
        const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");
        const rawPhone = (row.customer_phone || "").replace(/[^0-9]/g, "");
        const bdPhone = rawPhone.startsWith("88") ? rawPhone : `88${rawPhone}`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${bdPhone}&text=${encodeURIComponent(
          `Hi ${row.customer_name}! We saved your skincare bag at Blush & Budget (Total: ৳${row.cart_total}). Complete now with 5% off code BLUSH5: ${origin}/checkout`
        )}`;

        return (
          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 shadow-xs transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Recovery
            </a>

            <Button
              size="sm"
              variant={row.recovery_status === "sms_sent" ? "outline" : "default"}
              disabled={loadingId === row.id}
              onClick={() => handleSendRecoverySms(row)}
              className="text-xs font-bold rounded-xl"
            >
              {loadingId === row.id ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Send className="h-3 w-3 mr-1" />
              )}
              {row.recovery_status === "sms_sent" ? "Resend SMS" : "Send SMS"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e91e63] animate-pulse" />
            <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200 uppercase">
              Live Real-Time Lead Capture
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
            Abandoned & Incomplete Checkouts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Auto-captured customer leads who entered their name and phone on the checkout page. Recover with 1-click WhatsApp discounts.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 animate-in fade-in-0 flex justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-bold opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={checkouts}
          searchKey="customer_phone"
          searchPlaceholder="Search by phone, name, or location..."
          emptyMessage="No abandoned checkout leads right now."
        />
      </div>
    </div>
  );
}
