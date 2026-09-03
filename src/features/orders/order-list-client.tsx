"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  Package,
  Phone,
  Calendar,
  Clock,
  Truck,
  Printer,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Tag,
  FileText,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Layers,
  Search,
  Filter,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatus } from "./actions";
import { bookCourierDelivery } from "@/features/logistics/actions";
import { addBlacklistEntry } from "@/features/fraud/actions";
import { Button } from "@/components/shared/ui/button";

interface OrderListClientProps {
  initialOrders: any[];
}

export function OrderListClient({ initialOrders }: OrderListClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Dispatch Modal State (Optional inline adjustment)
  const [dispatchModalOrder, setDispatchModalOrder] = useState<any | null>(null);
  const [modalCourier, setModalCourier] = useState<"steadfast" | "pathao">("steadfast");
  const [modalWeight, setModalWeight] = useState(0.5);
  const [modalNote, setModalNote] = useState("Fragile skincare cosmetics. Please handle with care.");

  // WhatsApp dropdown menu open state
  const [openWhatsAppId, setOpenWhatsAppId] = useState<string | null>(null);

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === "all" || o.status === activeTab;
    const phone = o.shipping_address_snapshot?.phone || o.guest_phone || "";
    const name = o.shipping_address_snapshot?.name || o.guest_name || "";
    const orderNum = o.order_number || "";
    const district = o.shipping_address_snapshot?.district || "";
    const matchesSearch =
      !searchQuery ||
      orderNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery) ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // 1. Status Update
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setBannerMsg({ text: `Order status updated to ${newStatus.toUpperCase()}!`, isError: false });
      setTimeout(() => setBannerMsg(null), 3000);
    }
  };

  // 2. 1-Click Courier Dispatch (SteadFast or Pathao)
  const handleOneClickDispatch = async (
    order: any,
    courierCode: "steadfast" | "pathao",
    customWeight?: number,
    customNote?: string
  ) => {
    setActionLoadingId(order.id);
    setBannerMsg(null);

    const address = order.shipping_address_snapshot || {};
    const items = order.order_items || [];
    const itemsSummary =
      items.map((it: any) => `${it.product_name_snapshot} (x${it.quantity})`).join(", ") ||
      "Skincare cosmetics parcel";
    const weight = customWeight ?? 0.5;
    const note = customNote ?? (order.public_note || "Fragile cosmetics. Call recipient before delivery.");

    const res = await bookCourierDelivery({
      orderId: order.id,
      orderNumber: order.order_number,
      courierCode,
      recipientName: address.name || order.guest_name || "Customer",
      recipientPhone: address.phone || order.guest_phone || "01712345678",
      recipientAddress: address.address || "Dhaka, Bangladesh",
      district: address.district || "Dhaka City",
      thana: address.thana || "",
      codAmount: order.total,
      weightKg: weight,
      itemDescription: itemsSummary,
      specialInstruction: note,
    });

    if (res.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                status: "shipped",
                courier_name: res.courierName,
                consignment_id: res.consignmentId,
              }
            : o
        )
      );
      setBannerMsg({
        text: `⚡ 1-Click Dispatched Order #${order.order_number} with ${res.courierName}! Tracking: ${res.consignmentId} (${weight}kg)`,
        isError: false,
      });
      setDispatchModalOrder(null);
      setTimeout(() => setBannerMsg(null), 4500);
    } else {
      setBannerMsg({ text: res.error || "Courier booking failed.", isError: true });
    }
    setActionLoadingId(null);
  };

  // 3. 1-Click Block Phone & IP Action
  const handleBlockCustomer = async (order: any) => {
    const phone = order.shipping_address_snapshot?.phone || order.guest_phone;
    if (!phone) return;

    if (!confirm(`Are you sure you want to block ${phone}? They will be denied from placing any future orders.`)) {
      return;
    }

    setActionLoadingId(order.id);
    const res = await addBlacklistEntry({
      type: "phone",
      value: phone,
      reason: `Blocked from Order #${order.order_number} due to suspicious activity`,
    });

    if (res.success) {
      await updateOrderStatus(order.id, "cancelled");
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "cancelled" } : o))
      );
      setBannerMsg({
        text: `🚫 Number ${phone} added to Security Blacklist & Order #${order.order_number} Cancelled!`,
        isError: false,
      });
      setTimeout(() => setBannerMsg(null), 4000);
    }
    setActionLoadingId(null);
  };

  // 4. Bulk Dispatch to SteadFast / Pathao
  const handleBulkCourierDispatch = async (courierCode: "steadfast" | "pathao") => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    setBannerMsg(null);

    const targetOrders = orders.filter((o) => selectedIds.includes(o.id));
    let count = 0;

    for (const order of targetOrders) {
      const address = order.shipping_address_snapshot || {};
      const items = order.order_items || [];
      const itemsSummary = items.map((it: any) => `${it.product_name_snapshot} (x${it.quantity})`).join(", ");

      const res = await bookCourierDelivery({
        orderId: order.id,
        orderNumber: order.order_number,
        courierCode,
        recipientName: address.name || order.guest_name || "Customer",
        recipientPhone: address.phone || order.guest_phone || "01712345678",
        recipientAddress: address.address || "Dhaka, Bangladesh",
        district: address.district || "Dhaka City",
        thana: address.thana || "",
        codAmount: order.total,
        weightKg: 0.5,
        itemDescription: itemsSummary,
      });

      if (res.success) count++;
    }

    setOrders((prev) =>
      prev.map((o) => (selectedIds.includes(o.id) ? { ...o, status: "shipped" } : o))
    );
    setSelectedIds([]);
    setBulkLoading(false);
    setBannerMsg({
      text: `🚀 Bulk Dispatched ${count} orders to ${courierCode === "steadfast" ? "SteadFast" : "Pathao Express"}!`,
      isError: false,
    });
    setTimeout(() => setBannerMsg(null), 4000);
  };

  // 5. Bulk Status Change
  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);

    for (const id of selectedIds) {
      await updateOrderStatus(id, newStatus);
    }

    setOrders((prev) =>
      prev.map((o) => (selectedIds.includes(o.id) ? { ...o, status: newStatus } : o))
    );
    setSelectedIds([]);
    setBulkLoading(false);
    setBannerMsg({
      text: `Updated ${selectedIds.length} orders to ${newStatus.toUpperCase()}`,
      isError: false,
    });
    setTimeout(() => setBannerMsg(null), 3000);
  };

  // Selection Toggles
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
    packed: "bg-purple-50 text-purple-700 border-purple-200",
    shipped: "bg-teal-50 text-teal-700 border-teal-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    returned: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const tabs = [
    { label: "All Orders", value: "all", count: orders.length },
    { label: "Pending", value: "pending", count: orders.filter((o) => o.status === "pending").length },
    { label: "Confirmed", value: "confirmed", count: orders.filter((o) => o.status === "confirmed").length },
    { label: "Shipped", value: "shipped", count: orders.filter((o) => o.status === "shipped").length },
    { label: "Delivered", value: "delivered", count: orders.filter((o) => o.status === "delivered").length },
    { label: "Returns", value: "returned", count: orders.filter((o) => o.status === "returned").length },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e91e63] animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Orders & 1-Click Automation Hub
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Instant 1-Click SteadFast / Pathao dispatch, phone/IP blocklist, dynamic WhatsApp templates, and 4×6 thermal labels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/orders/incomplete">
            <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl border-gray-300">
              <Sparkles className="h-3.5 w-3.5 mr-1 text-[#e91e63]" />
              Incomplete Leads
            </Button>
          </Link>
          <Link href="/admin/orders/fraud">
            <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl border-red-200 text-red-700 hover:bg-red-50">
              <ShieldAlert className="h-3.5 w-3.5 mr-1 text-red-600" />
              Fraud & Blocklist
            </Button>
          </Link>
          <Link href="/admin/orders/settings">
            <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl border-gray-300">
              Automation Rules
            </Button>
          </Link>
        </div>
      </div>

      {/* Global Notification Banner */}
      {bannerMsg && (
        <div
          className={`rounded-2xl border p-4 text-xs font-bold flex items-center justify-between animate-in fade-in-0 ${
            bannerMsg.isError
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          <span>{bannerMsg.text}</span>
          <button onClick={() => setBannerMsg(null)} className="opacity-60 hover:opacity-100 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="rounded-3xl bg-gray-900 text-white p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e91e63] animate-pulse" />
            <span className="text-xs font-black">
              {selectedIds.length} Order{selectedIds.length === 1 ? "" : "s"} Selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => handleBulkCourierDispatch("steadfast")}
              disabled={bulkLoading}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-sm"
            >
              {bulkLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Truck className="h-3.5 w-3.5 mr-1" />}
              Bulk Dispatch SteadFast
            </Button>

            <Button
              onClick={() => handleBulkCourierDispatch("pathao")}
              disabled={bulkLoading}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-sm"
            >
              Bulk Dispatch Pathao
            </Button>

            <Button
              onClick={() => handleBulkStatusUpdate("confirmed")}
              disabled={bulkLoading}
              size="sm"
              variant="outline"
              className="text-xs font-bold rounded-xl border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              ✓ Mark Confirmed
            </Button>

            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-gray-400 hover:text-white font-bold ml-2 underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Tabs & Search Controls */}
      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setActiveTab(t.value)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  activeTab === t.value
                    ? "bg-[#e91e63] text-white shadow-xs"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    activeTab === t.value ? "bg-white/25 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-80 relative">
            <Search className="h-3.5 w-3.5 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, phone, customer, district..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3.5 py-2 text-xs font-medium text-gray-900 focus:border-[#e91e63] focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Interactive Orders Table with 1-Click Actions */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 uppercase font-black border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredOrders.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                  />
                </th>
                <th className="px-4 py-3.5">Order Info</th>
                <th className="px-4 py-3.5">Customer & Contacts</th>
                <th className="px-4 py-3.5">Destination & Items</th>
                <th className="px-4 py-3.5">Amount Due</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">⚡ 1-Click Courier Dispatch</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 font-medium">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const addr = ord.shipping_address_snapshot || {};
                  const isChecked = selectedIds.includes(ord.id);
                  const phone = addr.phone || ord.guest_phone || "01700000000";
                  const rawPhone = phone.replace(/[^0-9]/g, "");
                  const bdPhone = rawPhone.startsWith("88") ? rawPhone : `88${rawPhone}`;
                  const customerName = addr.name || ord.guest_name || "Customer";
                  const isShipped = ord.status === "shipped" || Boolean(ord.consignment_id);
                  const courier = ord.courier_name || "SteadFast Courier";
                  const consignment = ord.consignment_id || "";
                  const isLoading = actionLoadingId === ord.id;

                  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");

                  // 4 Dynamic WhatsApp Templates
                  const waConfirm = `https://api.whatsapp.com/send?phone=${bdPhone}&text=${encodeURIComponent(
                    `Hello ${customerName}! Your Blush & Budget order (${ord.order_number}) of ৳${ord.total} is confirmed and packed. Track: ${origin}/account/track`
                  )}`;
                  const waShipped = `https://api.whatsapp.com/send?phone=${bdPhone}&text=${encodeURIComponent(
                    `Hello ${customerName}! Your parcel is dispatched with ${courier} (Tracking: ${consignment || "SF-EXPRESS"}). Live Track: ${origin}/account/track`
                  )}`;
                  const waAdvance = `https://api.whatsapp.com/send?phone=${bdPhone}&text=${encodeURIComponent(
                    `Hello ${customerName}! For your order ${ord.order_number}, please send ৳120 advance delivery charge to bKash 01700-000000 to confirm immediate parcel handover.`
                  )}`;
                  const waReview = `https://api.whatsapp.com/send?phone=${bdPhone}&text=${encodeURIComponent(
                    `Hello ${customerName}! We hope you love your authentic skincare products from Blush & Budget. Please rate your experience: ${origin}/products`
                  )}`;

                  return (
                    <tr
                      key={ord.id}
                      className={`hover:bg-gray-50/70 transition-colors ${
                        isChecked ? "bg-pink-50/30" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(ord.id)}
                          className="rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                        />
                      </td>

                      {/* Order Number & Consignment Code */}
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="font-mono font-black text-[#e91e63] hover:underline block"
                        >
                          {ord.order_number}
                        </Link>
                        <span className="text-[10px] text-gray-400 font-medium block">
                          {new Date(ord.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {consignment && (
                          <div className="inline-flex items-center gap-1 mt-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                            <span>{consignment}</span>
                            <button
                              onClick={() => handleCopy(consignment, ord.id)}
                              title="Copy Tracking ID"
                              className="hover:text-emerald-950"
                            >
                              {copiedId === ord.id ? (
                                <Check className="h-2.5 w-2.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-2.5 w-2.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Customer Info & 1-Click WhatsApp / Call / Block */}
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-gray-900 block">{customerName}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-gray-600 font-mono font-bold text-[11px]">{phone}</span>

                          {/* 1-Click Direct Call */}
                          <a
                            href={`tel:${phone}`}
                            title="Direct Call Customer"
                            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Phone className="h-3.5 w-3.5 text-blue-600" />
                          </a>

                          {/* 1-Click WhatsApp Menu with 4 Templates */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenWhatsAppId(openWhatsAppId === ord.id ? null : ord.id)
                              }
                              title="WhatsApp Instant Messages"
                              className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </button>

                            {openWhatsAppId === ord.id && (
                              <div className="absolute left-0 mt-1 w-52 bg-white rounded-2xl border border-gray-200 shadow-xl p-2 z-50 text-[11px] space-y-1 animate-in fade-in-0">
                                <span className="font-black text-[9px] uppercase text-gray-400 px-2 block">
                                  WhatsApp Templates:
                                </span>
                                <a
                                  href={waConfirm}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setOpenWhatsAppId(null)}
                                  className="block px-2 py-1.5 rounded-lg hover:bg-emerald-50 text-gray-800 font-bold"
                                >
                                  📦 Order Confirmed
                                </a>
                                <a
                                  href={waShipped}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setOpenWhatsAppId(null)}
                                  className="block px-2 py-1.5 rounded-lg hover:bg-emerald-50 text-gray-800 font-bold"
                                >
                                  🚚 Courier Live Tracking
                                </a>
                                <a
                                  href={waAdvance}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setOpenWhatsAppId(null)}
                                  className="block px-2 py-1.5 rounded-lg hover:bg-emerald-50 text-gray-800 font-bold"
                                >
                                  💳 Request Advance ৳120
                                </a>
                                <a
                                  href={waReview}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setOpenWhatsAppId(null)}
                                  className="block px-2 py-1.5 rounded-lg hover:bg-emerald-50 text-gray-800 font-bold"
                                >
                                  ⭐ Review Request
                                </a>
                              </div>
                            )}
                          </div>

                          {/* 1-Click Block Number & IP */}
                          <button
                            onClick={() => handleBlockCustomer(ord)}
                            title="Block Number & IP"
                            className="p-1 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Destination & Ordered Items */}
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-gray-900 block">{addr.district || "Dhaka City"}</span>
                        <span className="text-[11px] text-gray-500 truncate max-w-[150px] block">
                          {addr.address || addr.thana}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                          {ord.order_items?.length || 1} Item(s)
                        </span>
                      </td>

                      {/* Amount Due */}
                      <td className="px-4 py-3.5">
                        <span className="font-black text-gray-900 text-sm block">{formatPrice(ord.total)}</span>
                        <span className="text-[10px] uppercase font-bold text-gray-500">
                          {ord.payment_method === "cod" ? "COD" : ord.payment_method} ({ord.payment_status})
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-4 py-3.5">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className={`rounded-xl border px-2.5 py-1 text-xs font-bold capitalize focus:outline-none ${
                            statusColors[ord.status] || "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="returned">Returned</option>
                        </select>
                      </td>

                      {/* ⚡ 1-Click Courier Dispatch Buttons */}
                      <td className="px-4 py-3.5 text-center">
                        {isShipped ? (
                          <div className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Dispatched ({courier.split(" ")[0]})</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              onClick={() => handleOneClickDispatch(ord, "steadfast")}
                              disabled={isLoading}
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] h-7 px-2.5 rounded-lg shadow-xs"
                              title="1-Click Dispatch to SteadFast Courier (0.5kg)"
                            >
                              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "⚡ SteadFast"}
                            </Button>
                            <Button
                              onClick={() => handleOneClickDispatch(ord, "pathao")}
                              disabled={isLoading}
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-700 hover:bg-red-50 font-black text-[11px] h-7 px-2 rounded-lg"
                              title="1-Click Dispatch to Pathao Express"
                            >
                              Pathao
                            </Button>
                          </div>
                        )}
                      </td>

                      {/* Action Links & Printing */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* 1-Click A4 Invoice */}
                          <Link
                            href={`/admin/orders/${ord.id}/invoice`}
                            target="_blank"
                            title="Print A4 Invoice / 4×6 Thermal Label"
                          >
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg border border-gray-200">
                              <Printer className="h-3.5 w-3.5 text-gray-700" />
                            </Button>
                          </Link>

                          {/* Full Detail Link */}
                          <Link href={`/admin/orders/${ord.id}`}>
                            <Button
                              size="sm"
                              className="bg-[#e91e63] hover:bg-[#d81b60] text-white text-[11px] font-bold rounded-lg h-7 px-2.5"
                            >
                              Manage
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
