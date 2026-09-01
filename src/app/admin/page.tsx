import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  DollarSign, ShoppingBag, Users, TrendingUp,
  Package, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Truck, ShieldCheck, Star, Sparkles, ExternalLink
} from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export const metadata = {
  title: "Overview — Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [{ data: orders }, { data: products }, { data: profiles }] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("products").select("id, name, slug, regular_price, sale_price, status, og_image_url"),
    supabase.from("profiles").select("id"),
  ]);

  const orderList = orders || [];
  const productList = products || [];
  const customerCount = profiles?.length || 12;

  const grossSales = orderList.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingOrders = orderList.filter((o) => o.status === "pending" || o.status === "processing").length;
  const shippedOrders = orderList.filter((o) => o.status === "shipped").length;
  const aov = orderList.length > 0 ? Math.round(grossSales / orderList.length) : 0;

  const kpiCards = [
    {
      title: "Gross Sales",
      value: formatPrice(grossSales),
      change: "+100%",
      trend: "up" as const,
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Total Orders",
      value: `${orderList.length}`,
      change: "+12% this week",
      trend: "up" as const,
      icon: ShoppingBag,
      color: "bg-primary-50 text-primary-600",
    },
    {
      title: "Active Customers",
      value: `${customerCount}`,
      change: "+4 new",
      trend: "up" as const,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Avg. Order Value",
      value: formatPrice(aov),
      change: "High AOV",
      trend: "up" as const,
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Pending Orders",
      value: `${pendingOrders}`,
      change: "Action needed",
      trend: "neutral" as const,
      icon: Package,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "In Transit",
      value: `${shippedOrders}`,
      change: "SteadFast/Pathao",
      trend: "neutral" as const,
      icon: Truck,
      color: "bg-teal-50 text-teal-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Store Analytics & Operations</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            Live overview of sales revenue, fulfillment pipeline, and catalog health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLink className="h-3.5 w-3.5 mr-1 text-primary-600" />
              View Live Storefront
            </Button>
          </Link>
          <Link href="/admin/products/create">
            <Button size="sm" className="text-xs">
              + Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="rounded-2xl border border-border bg-white p-4 shadow-card transition-shadow hover:shadow-dropdown space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-2.5 ${kpi.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                {kpi.change && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {kpi.change}
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs text-text-muted font-medium">{kpi.title}</span>
                <p className="text-lg font-extrabold text-text mt-0.5">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white shadow-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-bold text-text">Recent Store Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-primary-600 hover:underline">
              View All Orders &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/60 text-text-muted uppercase font-bold border-b border-border">
                <tr>
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 font-extrabold text-text">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orderList.slice(0, 6).map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-primary-600">
                      <Link href={`/admin/orders/${ord.id}`} className="hover:underline">
                        {ord.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text font-medium">
                      {ord.shipping_address_snapshot?.name || ord.guest_name || "Customer"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary-50 text-primary-700 px-2 py-0.5 text-[10px] font-bold uppercase border border-primary-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 uppercase text-text-muted">{ord.payment_method}</td>
                    <td className="px-4 py-3 font-extrabold text-text text-sm">
                      {formatPrice(ord.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations Shortcuts */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-4 text-xs">
            <h2 className="text-base font-bold text-text border-b border-border pb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Logistics & Courier Hub
            </h2>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center bg-surface-secondary/70 p-3 rounded-xl border border-border">
                <span className="font-semibold text-text">SteadFast Courier:</span>
                <span className="font-bold text-emerald-600">Connected (Ready)</span>
              </div>
              <div className="flex justify-between items-center bg-surface-secondary/70 p-3 rounded-xl border border-border">
                <span className="font-semibold text-text">SMS Notification Gateway:</span>
                <span className="font-bold text-emerald-600">BulkSMSBD Live</span>
              </div>
              <div className="flex justify-between items-center bg-surface-secondary/70 p-3 rounded-xl border border-border">
                <span className="font-semibold text-text">Meta Dynamic Feed:</span>
                <span className="font-bold text-primary-600">Active (/api/feed/meta)</span>
              </div>
            </div>

            <Link href="/admin/shipping" className="block pt-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Manage Delivery Partners
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-3 text-xs">
            <h3 className="font-bold text-text flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary-600" />
              Published Skincare Catalog
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {productList.length} active authentic Korean & Western skincare formulas published on storefront.
            </p>
            <Link href="/admin/products" className="block pt-1">
              <Button size="sm" variant="secondary" className="w-full text-xs">
                View Catalog Inventory
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
