import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  Calendar,
  ArrowRight,
  ShoppingBag,
  Printer,
  Download,
  FileText,
} from "lucide-react";
import { getOrderById } from "@/features/orders/actions";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";
import { PurchaseTracker } from "@/components/analytics/purchase-tracker";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const address = order.shipping_address_snapshot || {};
  const items = order.order_items || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* 1. GA4 DataLayer Purchase Event Dispatcher */}
      <PurchaseTracker
        orderData={{
          transaction_id: order.order_number || order.id,
          order_id: order.order_number || order.id,
          value: Number(order.total) || 0,
          currency: "BDT",
          tax: 0,
          shipping: Number(order.shipping_amount) || 0,
          coupon: order.coupon_code || undefined,
          discount: Number(order.discount_amount) || 0,
          payment_type: order.payment_method || "Cash on Delivery",
          customer: {
            email: order.customer_email || address.email || undefined,
            phone: order.customer_phone || address.phone || undefined,
            first_name: address.first_name || (order.customer_name ? order.customer_name.split(" ")[0] : undefined),
            last_name: address.last_name || (order.customer_name ? order.customer_name.split(" ").slice(1).join(" ") : undefined),
            external_id: order.customer_id || undefined,
            city: address.city || address.district || "Dhaka",
            state: address.state || address.division || "Dhaka",
            country: address.country || "BD",
            zip: address.zip || address.postal_code || "",
          },
          items: items.map((it: any, idx: number) => ({
            item_id: it.product_id || it.id,
            item_name: it.product_name_snapshot || "Product",
            price: Number(it.unit_price) || 0,
            quantity: Number(it.quantity) || 1,
            index: idx + 1,
          })),
        }}
      />

      {/* Celebratory Banner */}
      <div className="rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-500/10 via-emerald-50 to-white p-8 text-center shadow-card space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Order Confirmed
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-text">
            Thank You For Your Order!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
            We have received your order and our team is preparing it for shipment. We will call you shortly to confirm your delivery address.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-border px-4 py-2 shadow-xs text-xs font-bold text-text">
            <span>Order Number:</span>
            <span className="text-[#e91e63] text-sm font-extrabold font-mono">{order.order_number}</span>
          </div>

          <Link href={`/orders/${order.id}/invoice`} target="_blank">
            <Button className="bg-[#e91e63] hover:bg-sg-pink-hover text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md">
              <Printer className="h-4 w-4 mr-1.5" />
              Download &amp; Print Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Order Status Tracker */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold text-text flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary-600" />
          Delivery Status Tracker
        </h2>

        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-emerald-500" />
            <span className="font-bold text-emerald-700">Placed</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-primary-200" />
            <span className="font-medium text-text-muted">Confirmed</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-zinc-200" />
            <span className="font-medium text-text-muted">Shipped</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-zinc-200" />
            <span className="font-medium text-text-muted">Delivered</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Delivery Address */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-3 text-xs">
          <h3 className="text-sm font-bold text-text flex items-center gap-2 border-b border-border pb-2">
            <MapPin className="h-4 w-4 text-primary-600" />
            Delivery Address
          </h3>

          <div className="space-y-1 text-text-secondary leading-relaxed">
            <p className="font-bold text-text text-sm">{address.name}</p>
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-text-muted" />
              {address.phone}
            </p>
            <p>{address.address}</p>
            <p>{address.thana}, {address.district}</p>
          </div>

          <div className="pt-2 border-t border-dashed border-border flex items-center justify-between text-[11px] font-semibold text-text">
            <span>Payment Method:</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase font-bold">
              {order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method}
            </span>
          </div>
        </div>

        {/* Order Summary & Totals */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-3 text-xs">
          <h3 className="text-sm font-bold text-text flex items-center gap-2 border-b border-border pb-2">
            <Package className="h-4 w-4 text-primary-600" />
            Order Financials
          </h3>

          <div className="space-y-2 text-text-secondary">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-text">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span>
                <span>-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee ({order.shipping_method})</span>
              <span className="font-semibold text-text">
                {order.shipping_amount === 0 ? "FREE" : formatPrice(order.shipping_amount)}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between items-baseline text-sm font-extrabold text-text">
              <span>Total Payable</span>
              <span className="text-primary-700 text-base">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Products Table */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border">
          <h3 className="text-sm font-bold text-text">
            Order Items ({items.length})
          </h3>
        </div>

        <div className="divide-y divide-border">
          {items.map((item: any) => (
            <div key={item.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-text">{item.product_name_snapshot}</p>
                <p className="text-text-muted mt-0.5">
                  Qty: {item.quantity} × {formatPrice(item.unit_price)}
                </p>
              </div>
              <span className="font-bold text-text">
                {formatPrice(item.total)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link href={`/orders/${order.id}/invoice`} target="_blank">
          <Button variant="outline" size="lg" className="px-6 font-bold text-xs border-gray-300 hover:bg-gray-50">
            <Printer className="h-4 w-4 mr-2 text-[#e91e63]" />
            Print / Download Invoice Receipt
          </Button>
        </Link>
        <Link href="/products">
          <Button size="lg" className="px-8 shadow-md bg-[#e91e63] hover:bg-sg-pink-hover text-white font-bold">
            Continue Shopping
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
