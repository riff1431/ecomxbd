import Link from "next/link";
import { ShoppingBag, Eye, Package, ArrowRight } from "lucide-react";
import { getCustomerOrders } from "@/features/account/actions";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";

export const metadata = {
  title: "My Orders — Customer Account",
};

export default async function CustomerOrdersPage() {
  const orders = await getCustomerOrders();

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">My Orders</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Review past orders, track delivery status, and view invoices.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary text-text-muted">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="text-base font-bold text-text">No orders placed yet</h2>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Once you place an order, you will be able to track its live delivery status here.
          </p>
          <Link href="/products" className="inline-block mt-2">
            <Button size="sm">Explore Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = order.order_items || [];
            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3 text-xs">
                  <div>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="font-mono font-extrabold text-primary-600 text-sm block hover:underline"
                    >
                      {order.order_number}
                    </Link>
                    <span className="text-text-muted">
                      Placed on {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-0.5 font-bold uppercase border text-[11px] ${
                        statusColors[order.status] || "bg-surface-secondary text-text"
                      }`}
                    >
                      {order.status}
                    </span>
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-2 text-xs">
                  {items.map((it: any) => (
                    <div key={it.id} className="flex justify-between text-text-secondary">
                      <span>
                        {it.quantity}x {it.product_name_snapshot}
                      </span>
                      <span className="font-semibold text-text">{formatPrice(it.total)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Total */}
                <div className="flex items-center justify-between border-t border-dashed border-border pt-3 text-xs">
                  <div className="text-text-muted">
                    <span>Payment: </span>
                    <strong className="text-text uppercase font-semibold">
                      {order.payment_method}
                    </strong>
                  </div>
                  <div className="text-sm font-extrabold text-text">
                    Total: <span className="text-primary-700">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
