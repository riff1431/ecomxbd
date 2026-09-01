"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  CheckCircle2,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";

const FREE_SHIPPING_THRESHOLD = 2500;

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    coupon,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponCode);
    setCouponMsg({ text: res.message, isError: !res.success });
    setIsApplying(false);
    if (res.success) setCouponCode("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">Home</Link>
        <span>/</span>
        <span className="text-text font-medium">Shopping Cart</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text flex items-center gap-2">
            <ShoppingBag className="h-7 w-7 text-primary-600" />
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            You have {itemCount} authentic item{itemCount === 1 ? "" : "s"} in your bag.
          </p>
        </div>

        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 mt-2 sm:mt-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Cart
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary text-text-muted">
            <ShoppingBag className="h-8 w-8 stroke-[1]" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-text">Your cart is currently empty</h2>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary max-w-sm mx-auto">
            Discover 100% authentic skincare, haircare, and cosmetics imported directly from authorized brands.
          </p>
          <Link href="/products" className="inline-block mt-6">
            <Button>
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Items Table / List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Alert */}
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-primary-900 mb-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary-600" />
                  {amountNeeded > 0 ? (
                    <span>
                      Add <strong className="text-primary-700">{formatPrice(amountNeeded)}</strong> more to qualify for <strong>FREE Delivery</strong> inside Dhaka!
                    </span>
                  ) : (
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Congratulations! You unlocked <strong>FREE Delivery</strong> inside Dhaka!
                    </span>
                  )}
                </div>
                <span className="font-bold text-primary-700">{freeShippingProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-primary-200/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-border rounded-2xl border border-border bg-white shadow-card overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-secondary">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-text-muted">
                        <ShoppingBag className="h-8 w-8 stroke-[1]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {item.brand_name && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        {item.brand_name}
                      </span>
                    )}
                    <Link
                      href={`/products/${item.slug}`}
                      className="block text-sm sm:text-base font-bold text-text hover:text-primary-600 line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1 text-xs text-text-muted">
                      Price: {formatPrice(item.price)}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-lg border border-border bg-surface-secondary">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-text hover:bg-white rounded-l-lg transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-text">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-text hover:bg-white rounded-r-lg transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="w-24 text-right">
                      <span className="text-sm font-extrabold text-text">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-text-muted hover:text-red-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-5">
              <h2 className="text-lg font-bold text-text border-b border-border pb-3">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-text">Promo or Voucher Code</span>
                {coupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-emerald-900 block">{coupon.code}</span>
                        <span className="text-emerald-700 text-[11px]">Saved {formatPrice(discount)}</span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. WELCOME10"
                      className="flex-1 rounded-xl border border-border bg-surface-secondary/60 px-3 py-2 text-xs text-text uppercase placeholder:text-text-muted focus:border-primary-600 focus:bg-white focus:outline-none"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={isApplying || !couponCode.trim()}
                      className="rounded-xl px-4 text-xs font-bold"
                    >
                      Apply
                    </Button>
                  </form>
                )}

                {couponMsg && (
                  <p className={`text-[11px] ${couponMsg.isError ? "text-red-600" : "text-emerald-600"}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs border-t border-border pt-4">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({coupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery Estimate</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-text pt-3 border-t border-border">
                  <span>Total Amount</span>
                  <span className="text-primary-700 text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full py-6 text-sm font-bold bg-accent-500 hover:bg-accent-600 text-white shadow-md border-none">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% Genuine Guaranteed | Cash on Delivery Available</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
