"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Truck,
  Package,
  MapPin,
  Calendar,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";
import { updateOrderStatus } from "@/features/orders/actions";
import { bookCourierDelivery } from "@/features/logistics/actions";

interface OrderDetailClientProps {
  order: any;
}

export function OrderDetailClient({ order: initialOrder }: OrderDetailClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookingCourier, setBookingCourier] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const address = order.shipping_address_snapshot || {};
  const items = order.order_items || [];
  const history = order.order_status_history || [];

  const handleBookCourier = async (courierCode: "steadfast" | "pathao") => {
    setBookingCourier(true);
    setMsg(null);

    const res = await bookCourierDelivery({
      orderId: order.id,
      orderNumber: order.order_number,
      courierCode,
      recipientName: address.name || order.guest_name || "Customer",
      recipientPhone: address.phone || order.guest_phone || "01712345678",
      recipientAddress: address.address || "Dhaka, Bangladesh",
      district: address.district || "Dhaka",
      codAmount: order.total,
    });

    if (res.success) {
      setMsg({
        text: `Booked with ${res.courierName}! Consignment: ${res.consignmentId}`,
        isError: false,
      });
      setStatus("shipped");
      setOrder({ ...order, status: "shipped" });
      router.refresh();
    }
    setBookingCourier(false);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateOrderStatus(order.id, status, note.trim() || undefined);
    if (res.error) {
      setMsg({ text: res.error, isError: true });
    } else {
      setMsg({ text: "Order status updated successfully!", isError: false });
      setOrder(res.order);
      setNote("");
      router.refresh();
    }
    setSaving(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text flex items-center gap-2">
              <span>Order {order.order_number}</span>
              <span className="rounded-full bg-primary-50 text-primary-700 text-xs px-2.5 py-0.5 border border-primary-200 uppercase font-extrabold">
                {order.status}
              </span>
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Placed on {new Date(order.created_at).toLocaleString("en-GB")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {order.status !== "shipped" && order.status !== "delivered" && (
            <Button
              onClick={() => handleBookCourier("steadfast")}
              disabled={bookingCourier}
              size="sm"
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {bookingCourier ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Truck className="h-3.5 w-3.5 mr-1" />}
              Book SteadFast Delivery
            </Button>
          )}
          <Button variant="outline" onClick={handlePrint} className="text-xs">
            <Printer className="h-3.5 w-3.5 mr-1.5" />
            Print Invoice
          </Button>
          <Link href={`/orders/${order.id}/confirmation`} target="_blank">
            <Button variant="outline" className="text-xs">
              Customer View
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 cols: Items & Status Updater */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Update Form */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-text flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary-600" />
              Update Fulfillment Status
            </h2>

            <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs text-text font-bold capitalize focus:border-primary-600 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="ready_for_pickup">Ready for Pickup</option>
                    <option value="shipped">Shipped</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text mb-1">Status Note (Public to Customer)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Handed over to Steadfast Courier tracking #12345"
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs text-text focus:border-primary-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {msg && (
                  <span
                    className={`text-xs font-semibold ${
                      msg.isError ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {msg.text}
                  </span>
                )}
                <Button type="submit" size="sm" disabled={saving} className="ml-auto text-xs">
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                  Update Status
                </Button>
              </div>
            </form>
          </div>

          {/* Ordered Line Items */}
          <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-text">
                Ordered Items ({items.length})
              </h2>
            </div>

            <div className="divide-y divide-border">
              {items.map((item: any) => (
                <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-text-muted">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-text text-sm">{item.product_name_snapshot}</p>
                      <p className="text-text-muted mt-0.5">
                        Qty: {item.quantity} × {formatPrice(item.unit_price)}
                      </p>
                    </div>
                  </div>

                  <span className="font-extrabold text-text text-sm">
                    {formatPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Timeline History */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-3">
            <h2 className="text-sm font-bold text-text">Status History</h2>
            <div className="space-y-3 text-xs">
              {history.map((h: any) => (
                <div key={h.id} className="flex items-start gap-3 border-l-2 border-primary-600 pl-3 py-0.5">
                  <div>
                    <p className="font-bold text-text capitalize">
                      {h.status}: <span className="font-normal text-text-secondary">{h.note}</span>
                    </p>
                    <span className="text-[10px] text-text-muted">
                      {new Date(h.created_at).toLocaleString("en-GB")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 col: Customer & Payment Details */}
        <div className="space-y-6">
          {/* Customer & Address */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4 text-xs">
            <h2 className="text-sm font-bold text-text flex items-center gap-2 border-b border-border pb-2">
              <MapPin className="h-4 w-4 text-primary-600" />
              Customer & Delivery
            </h2>

            <div className="space-y-2 text-text-secondary leading-relaxed">
              <p className="font-bold text-text text-sm">{address.name || order.guest_name}</p>
              <p className="flex items-center gap-1.5 font-semibold text-text">
                <Phone className="h-3.5 w-3.5 text-primary-600" />
                {address.phone || order.guest_phone}
              </p>
              {address.email && <p className="text-text-muted">{address.email}</p>}
              <div className="pt-2 border-t border-dashed border-border">
                <p className="font-medium text-text">{address.address}</p>
                <p className="text-text-muted">{address.thana}, {address.district}</p>
              </div>
            </div>

            {order.public_note && (
              <div className="rounded-xl bg-surface-secondary p-3 text-[11px] text-text-secondary">
                <span className="font-bold block text-text">Customer Delivery Note:</span>
                &quot;{order.public_note}&quot;
              </div>
            )}
          </div>

          {/* Payment & Financials */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4 text-xs">
            <h2 className="text-sm font-bold text-text flex items-center gap-2 border-b border-border pb-2">
              <Tag className="h-4 w-4 text-primary-600" />
              Financial Breakdown
            </h2>

            <div className="space-y-2 text-text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-text">{formatPrice(order.subtotal)}</span>
              </div>

              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-text">
                  {order.shipping_amount === 0 ? "FREE" : formatPrice(order.shipping_amount)}
                </span>
              </div>

              <div className="border-t border-border pt-3 flex justify-between items-baseline text-sm font-extrabold text-text">
                <span>Total Due</span>
                <span className="text-primary-700 text-lg">{formatPrice(order.total)}</span>
              </div>

              <div className="pt-2 border-t border-dashed border-border flex justify-between items-center text-[11px]">
                <span>Payment Method:</span>
                <span className="font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method}
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span>Payment Status:</span>
                <span className="font-bold capitalize text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
