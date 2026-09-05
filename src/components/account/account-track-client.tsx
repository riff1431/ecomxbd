"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck,
  CheckCircle2,
  Search,
  ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";
import { useLanguage } from "@/context/language-context";

export default function AccountTrackClient({ initialOrders }: { initialOrders: any[] }) {
  const { language, toBn, formatPriceBn } = useLanguage();
  const isBn = language === "bn";

  const statusSteps = [
    { key: "pending", label: isBn ? "অর্ডার গ্রহণ" : "Order Placed" },
    { key: "confirmed", label: isBn ? "নিশ্চিত" : "Confirmed" },
    { key: "processing", label: isBn ? "প্রসেসিং ও প্যাকেজিং" : "Processing & Packed" },
    { key: "shipped", label: isBn ? "ডেলিভারির পথে" : "In Transit" },
    { key: "delivered", label: isBn ? "ডেলিভার্ড" : "Delivered" },
  ];

  function getStepIndex(status: string) {
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "processing":
      case "packed":
      case "ready_for_pickup":
        return 2;
      case "shipped":
      case "in_transit":
      case "out_for_delivery":
        return 3;
      case "delivered":
        return 4;
      default:
        return 0;
    }
  }

  const [selectedOrder, setSelectedOrder] = useState<any | null>(
    initialOrders.length > 0 ? initialOrders[0] : null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = initialOrders.filter((o) =>
    o.order_number?.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const activeOrder = selectedOrder || (filteredOrders.length > 0 ? filteredOrders[0] : null);
  const currentStep = activeOrder ? getStepIndex(activeOrder.status) : 0;

  const getStatusText = (status: string) => {
    if (!isBn) return status;
    const statusMap: Record<string, string> = {
      pending: "পেন্ডিং",
      confirmed: "নিশ্চিত",
      processing: "প্রসেসিং",
      packed: "প্যাকড",
      shipped: "শিপড",
      in_transit: "ট্রানজিটে আছে",
      out_for_delivery: "ডেলিভারির জন্য বের হয়েছে",
      delivered: "ডেলিভার্ড",
      cancelled: "বাতিল",
      returned: "ফেরত",
    };
    return statusMap[status.toLowerCase()] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#e91e63]" />
            {isBn ? "ডেলিভারি ও পার্সেল ট্র্যাকিং" : "Track Deliveries & Consignments"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {isBn
              ? "আপনার পার্সেল ও কুরিয়ার ডেলিভারির রিয়েল-টাইম তথ্য জানুন।"
              : "Real-time step-by-step dispatch and courier status of your parcels."}
          </p>
        </div>

        {initialOrders.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder={isBn ? "অর্ডার নম্বর খুঁজুন..." : "Search Order Number..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border text-xs text-gray-900 focus:outline-none"
            />
          </div>
        )}
      </div>

      {initialOrders.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[#e91e63]">
            <Truck className="h-7 w-7" />
          </div>
          <h2 className="text-base font-bold text-gray-900">
            {isBn ? "কোনো সক্রিয় ডেলিভারি পাওয়া যায়নি" : "No active consignments found"}
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {isBn
              ? "আপনার বর্তমানে কোনো ডেলিভারি চলমান নেই। নতুন অর্ডার দিলে এখানে লাইভ ট্র্যাকিং দেখতে পাবেন।"
              : "You don't have any recent deliveries in progress. When you place an order, live tracking will appear here."}
          </p>
          <Link href="/products" className="inline-block">
            <Button className="bg-[#e91e63] hover:bg-[#d81557] text-white text-xs font-bold rounded-xl px-5">
              {isBn ? "শপিং শুরু করুন" : "Start Shopping"}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Tracker Card */}
          {activeOrder && (
            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {isBn ? "ট্র্যাকিং অর্ডার" : "Tracking Order"}
                  </span>
                  <p className="text-base font-black font-mono text-[#e91e63]">
                    {activeOrder.order_number}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isBn
                      ? `অর্ডারের তারিখ: ${toBn(new Date(activeOrder.created_at).toLocaleDateString("en-GB"))}`
                      : `Placed on ${new Date(activeOrder.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-pink-50 text-[#e91e63] border border-pink-200 px-3 py-1 text-xs font-black capitalize">
                    {getStatusText(activeOrder.status)}
                  </span>
                  <Link href={`/orders/${activeOrder.id}/confirmation`}>
                    <Button variant="outline" size="sm" className="text-xs font-bold border-gray-300">
                      {isBn ? "ইনভয়েস" : "Invoice"} <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="py-2">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-4 right-4 h-1 bg-gray-100 z-0">
                    <div
                      className="h-full bg-[#e91e63] transition-all duration-500"
                      style={{
                        width: `${(currentStep / (statusSteps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative z-10 flex justify-between">
                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                              isCompleted
                                ? "border-[#e91e63] bg-[#e91e63] text-white shadow-md shadow-pink-500/20"
                                : "border-gray-200 bg-white text-gray-400"
                            } ${isCurrent ? "ring-4 ring-pink-100 scale-110" : ""}`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <span className="text-xs font-bold">{isBn ? toBn(idx + 1) : idx + 1}</span>
                            )}
                          </div>
                          <span
                            className={`mt-2 text-[11px] font-bold max-w-17.5 sm:max-w-none leading-tight ${
                              isCompleted ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Courier Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl bg-gray-50/70 p-4 border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 font-medium block">
                    {isBn ? "শিপিং মাধ্যম" : "Shipping Method"}
                  </span>
                  <span className="font-bold text-gray-800">
                    {activeOrder.shipping_method || (isBn ? "স্ট্যান্ডার্ড কুরিয়ার (২৪-৭২ ঘণ্টা)" : "Standard Courier (24-72h)")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">
                    {isBn ? "পেমেন্ট অবস্থা" : "Payment Status"}
                  </span>
                  <span className="font-bold text-emerald-700 capitalize">
                    {activeOrder.payment_status === "cash_on_delivery" || !activeOrder.payment_status
                      ? (isBn ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery")
                      : activeOrder.payment_status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">
                    {isBn ? "অর্ডার মোট মূল্য" : "Order Total"}
                  </span>
                  <span className="font-black text-gray-900 text-sm">
                    {isBn ? formatPriceBn(activeOrder.total) : formatPrice(activeOrder.total)}
                  </span>
                </div>
              </div>

              {/* Order items snippet */}
              {activeOrder.order_items && activeOrder.order_items.length > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <span className="text-xs font-bold text-gray-700 block">
                    {isBn
                      ? `পার্সেলের প্রোডাক্টসমূহ (${toBn(activeOrder.order_items.length)}টি আইটেম):`
                      : `Package Contents (${activeOrder.order_items.length} items):`}
                  </span>
                  <div className="divide-y divide-gray-100">
                    {activeOrder.order_items.map((it: any) => (
                      <div key={it.id} className="py-2 flex items-center justify-between text-xs">
                        <span className="text-gray-800 font-medium truncate max-w-70 sm:max-w-md">
                          {it.product_name_snapshot}
                        </span>
                        <span className="text-gray-500 font-bold shrink-0">
                          {isBn
                            ? `পরিমাণ: ${toBn(it.quantity)} × ${formatPriceBn(it.unit_price)}`
                            : `Qty: ${it.quantity} × ${formatPrice(it.unit_price)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Switch Order List */}
          {initialOrders.length > 1 && (
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase text-gray-700 tracking-wider">
                {isBn ? "অন্য কোনো পার্সেল ট্র্যাক করুন" : "Select Another Consignment to Track"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredOrders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
                      activeOrder?.id === o.id
                        ? "border-[#e91e63] bg-pink-50/40 text-gray-900"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div>
                      <span className="font-mono font-bold block">{o.order_number}</span>
                      <span className="text-[11px] text-gray-500">
                        {isBn ? toBn(new Date(o.created_at).toLocaleDateString("en-GB")) : new Date(o.created_at).toLocaleDateString("en-GB")} • {isBn ? formatPriceBn(o.total) : formatPrice(o.total)}
                      </span>
                    </div>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold capitalize">
                      {getStatusText(o.status)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

