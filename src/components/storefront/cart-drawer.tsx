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
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice, cn } from "@/lib/utils";
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

      {/* Slide-over Drawer Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-8">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <ShoppingBag className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-text">Your Shopping Bag</h2>
                <p className="text-[11px] text-text-muted">
                  {itemCount} item{itemCount === 1 ? "" : "s"} selected
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="rounded-xl p-2 text-text-muted hover:bg-surface-secondary hover:text-text transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Delivery Progress Bar */}
          <div className="bg-primary-50/70 border-b border-primary-100 p-3.5 text-xs">
            <div className="flex items-center justify-between text-primary-900 font-bold mb-1.5 text-[11px] sm:text-xs">
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
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-primary-100/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-600 to-emerald-500 transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary mx-auto text-text-muted">
                  <ShoppingBag className="h-8 w-8 stroke-[1.2]" />
                </div>
                <h3 className="text-base font-bold text-text">Your bag is currently empty</h3>
                <p className="text-xs text-text-secondary max-w-xs mx-auto">
                  Explore genuine skincare and cosmetics with cash on delivery all across Bangladesh.
                </p>
                <Link href="/products" onClick={closeCart} className="inline-block mt-2">
                  <Button size="sm" className="rounded-xl text-xs font-bold">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-border bg-white p-3 shadow-xs hover:border-primary-200 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-secondary p-1 flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ShoppingBag className="h-6 w-6 text-text-muted" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      {item.brand_name && (
                        <span className="text-[10px] font-bold uppercase text-primary-600 tracking-wider">
                          {item.brand_name}
                        </span>
                      )}
                      <p className="line-clamp-1 text-xs font-bold text-text">{item.name}</p>
                      <p className="text-xs font-extrabold text-text mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Stepper & Remove */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center h-8 rounded-lg border border-border bg-surface-secondary">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 text-text hover:bg-white rounded-l-lg transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 text-text hover:bg-white rounded-r-lg transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-muted hover:text-red-600 p-1 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="border-t border-border bg-surface-secondary/40 p-4 sm:p-5 space-y-4">
              {/* Coupon Row */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Promo or Coupon code"
                  className="flex-1 rounded-xl border border-border bg-white px-3 py-2 text-xs font-mono uppercase focus:border-primary-600 focus:outline-none"
                />
                <Button type="submit" size="sm" disabled={isApplying} className="rounded-xl text-xs font-bold h-9">
                  Apply
                </Button>
              </form>

              {couponMsg && (
                <p className={cn("text-xs font-semibold", couponMsg.isError ? "text-red-600" : "text-emerald-600")}>
                  {couponMsg.text}
                </p>
              )}

              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-bold text-text">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount Applied</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>Estimated Delivery</span>
                  <span>{amountNeeded === 0 ? "FREE (Inside Dhaka)" : "Calculated at checkout"}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-black text-text">
                  <span>Estimated Total</span>
                  <span className="text-base text-primary-700">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <Link href="/checkout" onClick={closeCart} className="block">
                <Button className="w-full h-12 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
