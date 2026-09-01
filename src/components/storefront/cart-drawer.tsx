"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  Truck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";

const FREE_SHIPPING_THRESHOLD = 2500;

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    coupon,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0"
        onClick={closeCart}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary-600" />
              <h2 className="text-base font-bold text-text">
                Your Shopping Cart ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-text transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="bg-primary-50/60 border-b border-primary-100 p-3.5 text-xs">
            <div className="flex items-center justify-between text-primary-900 font-semibold mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-primary-600" />
                {amountNeeded > 0 ? (
                  <span>
                    Add <strong className="text-primary-700">{formatPrice(amountNeeded)}</strong> more for <strong>FREE Delivery</strong>!
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    You unlocked <strong>FREE Delivery</strong> inside Dhaka!
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-primary-700">{freeShippingProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-primary-200/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary text-text-muted">
                  <ShoppingBag className="h-8 w-8 stroke-[1]" />
                </div>
                <h3 className="text-base font-bold text-text">Your cart is empty</h3>
                <p className="text-xs text-text-secondary max-w-xs mx-auto">
                  Looks like you haven&apos;t added any authentic beauty products yet.
                </p>
                <Button onClick={closeCart} className="mt-2 text-xs">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 rounded-xl border border-border bg-white p-3 shadow-xs"
                >
                  {/* Image */}
                  <div className="h-18 w-18 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-secondary">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-text-muted">
                        <ShoppingBag className="h-6 w-6 stroke-[1]" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {item.brand_name && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                          {item.brand_name}
                        </span>
                      )}
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-text hover:text-primary-600 line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      {item.variant_label && (
                        <span className="text-[11px] text-text-secondary block mt-0.5">
                          {item.variant_label}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-dashed border-border">
                      {/* Quantity Selector */}
                      <div className="flex items-center rounded-lg border border-border bg-surface-secondary">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-text hover:bg-white rounded-l-lg transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-text hover:bg-white rounded-r-lg transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-text-muted hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-border bg-surface-secondary/40 p-4 sm:p-5 space-y-4">
              {/* Coupon Form */}
              <div className="space-y-1.5">
                {coupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-emerald-600" />
                      <span className="font-bold text-emerald-800">
                        {coupon.code} (-{formatPrice(discount)})
                      </span>
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
                      placeholder="Coupon (e.g. WELCOME10)"
                      className="flex-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-text uppercase placeholder:text-text-muted focus:border-primary-600 focus:outline-none"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={isApplying || !couponCode.trim()}
                      className="text-xs font-semibold"
                    >
                      Apply
                    </Button>
                  </form>
                )}

                {couponMsg && (
                  <p
                    className={`text-[11px] ${
                      couponMsg.isError ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery Fee</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-text pt-2 border-t border-border">
                  <span>Estimated Total</span>
                  <span className="text-base font-extrabold text-primary-700">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2 pt-1">
                <Link href="/checkout" onClick={closeCart} className="block">
                  <Button className="w-full py-6 text-xs sm:text-sm font-bold shadow-md bg-accent-500 hover:bg-accent-600 text-white border-none">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>

                <Link href="/cart" onClick={closeCart} className="block text-center">
                  <span className="text-xs text-text-secondary hover:text-text hover:underline font-semibold">
                    View Detailed Cart Page
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
