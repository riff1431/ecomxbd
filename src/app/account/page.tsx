import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Heart,
  Award,
  ArrowRight,
  Truck,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { getCustomerDashboardData } from "@/features/account/actions";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";

export default async function AccountOverviewPage() {
  const data = await getCustomerDashboardData();

  if (!data) {
    return (
      <div className="rounded-2xl border border-border bg-white p-12 text-center space-y-4 shadow-card">
        <h2 className="text-xl font-bold text-text">Please Sign In</h2>
        <p className="text-xs text-text-secondary">
          Sign in or create an account to view your dashboard, order history, and saved addresses.
        </p>
        <Link href="/login" className="inline-block">
          <Button>Sign In to Account</Button>
        </Link>
      </div>
    );
  }

  const { totalOrders, pendingOrders, deliveredOrders, latestOrder, user } = data;

  const stats = [
    { label: "Total Orders", value: String(totalOrders), icon: ShoppingBag, color: "bg-primary-50 text-primary-600" },
    { label: "Pending", value: String(pendingOrders), icon: Clock, color: "bg-yellow-50 text-yellow-600" },
    { label: "Delivered", value: String(deliveredOrders), icon: CheckCircle, color: "bg-green-50 text-green-600" },
    { label: "Points Earned", value: "250", icon: Award, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-primary-900 to-zinc-900 p-6 sm:p-8 text-white shadow-card">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 backdrop-blur-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          Verified Member
        </span>
        <h1 className="mt-2 text-xl sm:text-2xl font-extrabold">
          Welcome back, {user.user_metadata?.full_name || user.email?.split("@")[0]}!
        </h1>
        <p className="mt-1 text-xs text-primary-100/80">
          Track your active deliveries, manage your address book, and earn beauty loyalty points.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-card"
            >
              <div className={`mb-3 inline-flex rounded-xl p-2.5 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-text">{stat.value}</p>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Latest Order Card */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold text-text flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary-600" />
            Latest Order Status
          </h2>
          <Link href="/account/orders" className="text-xs font-semibold text-primary-600 hover:underline">
            View All Orders &rarr;
          </Link>
        </div>

        {latestOrder ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface-secondary/40 rounded-xl p-4 border border-border">
            <div className="space-y-1 text-xs">
              <span className="font-mono font-extrabold text-primary-600 text-sm block">
                {latestOrder.order_number}
              </span>
              <p className="text-text-muted">
                Placed on {new Date(latestOrder.created_at).toLocaleDateString("en-GB")}
              </p>
              <span className="text-sm font-bold text-text block">
                Total: {formatPrice(latestOrder.total)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1 text-xs font-bold capitalize">
                Status: {latestOrder.status}
              </span>
              <Link href={`/orders/${latestOrder.id}/confirmation`}>
                <Button size="sm" className="text-xs">
                  Track Consignment
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-text-muted space-y-2">
            <p>You haven&apos;t placed any orders yet.</p>
            <Link href="/products" className="inline-block">
              <Button size="sm">Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/account/orders"
          className="group rounded-2xl border border-border bg-white p-5 shadow-card hover:border-primary-500 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text group-hover:text-primary-600 transition-colors">
                Order History
              </h3>
              <p className="text-xs text-text-muted">View and re-order past purchases</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-text-muted group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/account/addresses"
          className="group rounded-2xl border border-border bg-white p-5 shadow-card hover:border-primary-500 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text group-hover:text-primary-600 transition-colors">
                Saved Delivery Addresses
              </h3>
              <p className="text-xs text-text-muted">Manage your home and office addresses</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-text-muted group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
