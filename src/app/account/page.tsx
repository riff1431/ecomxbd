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
  Ticket,
  Star,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { getCustomerDashboardData } from "@/features/account/actions";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";

export default async function AccountOverviewPage() {
  const data = await getCustomerDashboardData();

  if (!data) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center space-y-4 shadow-sm">
        <h2 className="text-xl font-black text-gray-900">Please Sign In</h2>
        <p className="text-xs text-gray-500">
          Sign in or create an account to view your dashboard, order history, and saved addresses.
        </p>
        <Link href="/login" className="inline-block">
          <Button className="bg-[#e91e63] hover:bg-[#d81b60] text-white">Sign In to Account</Button>
        </Link>
      </div>
    );
  }

  const { totalOrders, pendingOrders, deliveredOrders, latestOrder, user, role } = data;
  const isAdmin = role === "admin" || role === "moderator";

  const stats = [
    { label: "Total Orders", value: String(totalOrders), icon: ShoppingBag, color: "bg-pink-50 text-[#e91e63]" },
    { label: "Pending", value: String(pendingOrders), icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Delivered", value: String(deliveredOrders), icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { label: "Points Earned", value: "250", icon: Award, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Quick Launch Banner */}
      {isAdmin && (
        <div className="rounded-3xl border border-pink-300 bg-pink-50/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e91e63] px-3 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
              <Sparkles className="h-3 w-3" />
              Administrator Access
            </span>
            <h2 className="text-base sm:text-lg font-black text-gray-900">
              Admin &amp; Store Management Portal
            </h2>
            <p className="text-xs text-gray-600">
              You are logged in with full administrative privileges. Manage orders, products, inventory, invoices, and site settings.
            </p>
          </div>
          <Link href="/admin">
            <Button className="bg-[#e91e63] hover:bg-[#d81b60] text-white font-black text-xs px-6 py-2.5 rounded-2xl shadow-md shrink-0">
              Open Admin Dashboard
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Welcome banner */}
      <div className="rounded-3xl border border-gray-200 bg-linear-to-r from-gray-950 via-zinc-900 to-pink-950 p-6 sm:p-8 text-white shadow-lg">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-emerald-400 backdrop-blur-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          {isAdmin ? "Super Administrator" : "Verified Member"}
        </span>
        <h1 className="mt-2 text-xl sm:text-2xl font-black">
          Welcome back, {user.user_metadata?.full_name || user.email?.split("@")[0]}!
        </h1>
        <p className="mt-1 text-xs text-pink-100/80">
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
              className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm"
            >
              <div className={`mb-3 inline-flex rounded-2xl p-2.5 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-bold">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Latest Order Card */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#e91e63]" />
            Latest Order Status
          </h2>
          <Link href="/account/orders" className="text-xs font-bold text-[#e91e63] hover:underline">
            View All Orders &rarr;
          </Link>
        </div>

        {latestOrder ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50/70 rounded-2xl p-4 border border-gray-100">
            <div className="space-y-1 text-xs">
              <span className="font-mono font-black text-[#e91e63] text-sm block">
                {latestOrder.order_number}
              </span>
              <p className="text-gray-500">
                Placed on {new Date(latestOrder.created_at).toLocaleDateString("en-GB")}
              </p>
              <span className="text-sm font-black text-gray-900 block">
                Total: {formatPrice(latestOrder.total)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-pink-50 text-[#e91e63] border border-pink-200 px-3 py-1 text-xs font-black capitalize">
                Status: {latestOrder.status}
              </span>
              <Link href="/account/track">
                <Button size="sm" className="bg-[#e91e63] hover:bg-[#d81b60] text-white text-xs font-black rounded-xl">
                  Track Consignment
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-gray-400 space-y-2">
            <p>You haven&apos;t placed any orders yet.</p>
            <Link href="/products" className="inline-block">
              <Button size="sm" className="bg-[#e91e63] text-white text-xs">Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/account/orders"
          className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm hover:border-[#e91e63] transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-[#e91e63]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900 group-hover:text-[#e91e63] transition-colors">
                Order History
              </h3>
              <p className="text-[11px] text-gray-500">View and re-order past purchases</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/account/addresses"
          className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm hover:border-[#e91e63] transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900 group-hover:text-[#e91e63] transition-colors">
                Saved Delivery Addresses
              </h3>
              <p className="text-[11px] text-gray-500">Manage home and office addresses</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/account/vouchers"
          className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm hover:border-[#e91e63] transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900 group-hover:text-[#e91e63] transition-colors">
                Promo Vouchers
              </h3>
              <p className="text-[11px] text-gray-500">Claim discounts & coupons</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
