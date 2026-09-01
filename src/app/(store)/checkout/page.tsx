"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Loader2,
  Tag,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";
import { createOrder } from "@/features/orders/actions";
import { createClient } from "@/lib/supabase/client";

const BD_DISTRICTS = [
  "Dhaka City",
  "Dhaka (Suburbs)",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Gazipur",
  "Narayanganj",
  "Comilla",
  "Cox's Bazar",
  "Bogra",
  "Jessore",
  "Dinajpur",
  "Tangail",
  "Feni",
  "Kushtia",
  "Faridpur",
  "Pabna",
  "Noakhali",
  "Brahmanbaria",
  "Narsingdi",
  "Other District",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, coupon, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Customer Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    district: "Dhaka City",
    thana: "",
    address: "",
    notes: "",
  });

  // Prefill user profile if logged in
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setFormData((prev) => ({
          ...prev,
          name: data.user.user_metadata?.full_name || prev.name,
          email: data.user.email || prev.email,
          phone: data.user.phone || prev.phone,
        }));
      }
    });
  }, []);

  // Shipping Fee Logic
  const isInsideDhaka = formData.district.toLowerCase().includes("dhaka");
  const isFreeShipping =
    coupon?.type === "free_shipping" ||
    (isInsideDhaka && subtotal >= 2500) ||
    subtotal >= 3500;

  const baseDeliveryFee = isInsideDhaka ? 60 : 120;
  const shippingFee = isFreeShipping ? 0 : baseDeliveryFee;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg("Please enter your Full Name.");
      return;
    }
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || !/^(?:\+8801|01)[3-9]\d{8}$/.test(cleanPhone)) {
      setErrorMsg("Please provide a valid 11-digit Bangladesh mobile number (e.g. 01712345678).");
      return;
    }
    if (!formData.thana.trim()) {
      setErrorMsg("Please enter your Thana / Police Station / Upazila.");
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg("Please enter your detailed delivery street address.");
      return;
    }

    if (items.length === 0) {
      setErrorMsg("Your cart is empty. Add products before checking out.");
      return;
    }

    setLoading(true);

    try {
      const res = await createOrder({
        customer: {
          name: formData.name.trim(),
          phone: cleanPhone,
          email: formData.email.trim() || undefined,
          district: formData.district,
          thana: formData.thana.trim(),
          address: formData.address.trim(),
          notes: formData.notes.trim() || undefined,
        },
        items: items.map((i) => ({
          product_id: i.product_id,
          variant_id: i.variant_id || null,
          quantity: i.quantity,
          name: i.name,
          price: i.price,
        })),
        shipping: {
          method: isInsideDhaka ? "Inside Dhaka Express (24-48h)" : "Outside Dhaka Courier (3-5d)",
          amount: shippingFee,
        },
        couponCode: coupon?.code || null,
      });

      if (res.error) {
        setErrorMsg(res.error);
        setLoading(false);
        return;
      }

      // Order created successfully!
      clearCart();
      router.push(`/orders/${res.orderId}/confirmation`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit order.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary text-text-muted">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-text">Your cart is empty</h1>
        <p className="text-xs text-text-secondary">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link href="/products" className="inline-block mt-2">
          <Button>Explore Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href="/cart"
          className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Lock className="h-3.5 w-3.5" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form: Delivery Address & Payment (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer Info */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white text-xs">
                1
              </span>
              Delivery Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Arifur Rahman"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-text placeholder:text-text-muted focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Mobile Number (BD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-text placeholder:text-text-muted focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-text mb-1">
                  Email Address <span className="text-text-muted font-normal">(Optional for order tracking)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-text placeholder:text-text-muted focus:border-primary-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white text-xs">
                2
              </span>
              Delivery Address in Bangladesh
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-text focus:border-primary-600 focus:outline-none"
                >
                  {BD_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Thana / Upazila / Police Station <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.thana}
                  onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                  placeholder="e.g. Gulshan / Dhanmondi / Mirpur"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-text placeholder:text-text-muted focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-text mb-1">
                  Detailed Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House / Holding Number, Road Number, Flat / Floor, Landmark..."
                  className="w-full rounded-xl border border-border bg-white p-3 text-xs text-text placeholder:text-text-muted focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-text mb-1">
                  Order Notes / Delivery Instructions <span className="text-text-muted font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Call 30 mins before arriving, leave with security"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-text placeholder:text-text-muted focus:border-primary-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white text-xs">
                3
              </span>
              Payment Method
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label className="flex items-center justify-between rounded-xl border-2 border-primary-600 bg-primary-50/40 p-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    defaultChecked
                    className="h-4 w-4 text-primary-600"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-text-secondary">
                      Pay in cash or bKash when you receive and inspect your parcel.
                    </span>
                  </div>
                </div>
                <span className="rounded bg-primary-600 text-white px-2 py-0.5 text-[10px] font-bold">
                  Recommended
                </span>
              </label>

              {/* Online payment notice */}
              <div className="rounded-xl border border-border bg-surface-secondary/50 p-4 text-xs text-text-muted flex items-center justify-between opacity-70">
                <div className="flex items-center gap-2">
                  <input type="radio" disabled className="h-4 w-4" />
                  <span>bKash / Nagad / Card Payment</span>
                </div>
                <span className="text-[10px] font-semibold text-text-muted uppercase">
                  Available soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Placement (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-card space-y-5">
            <h2 className="text-base font-bold text-text border-b border-border pb-3">
              Order Summary ({items.length} item{items.length === 1 ? "" : "s"})
            </h2>

            {/* Line items preview */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1 divide-y divide-border/60">
              {items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-secondary">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-text-muted">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text truncate">{item.name}</p>
                    <p className="text-[11px] text-text-muted">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-text">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-semibold text-text">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Coupon Discount ({coupon?.code})
                  </span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-text-secondary">
                <span>
                  Delivery: {isInsideDhaka ? "Inside Dhaka" : "Outside Dhaka"}
                </span>
                {shippingFee === 0 ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-semibold text-text">{formatPrice(shippingFee)}</span>
                )}
              </div>

              <div className="border-t border-border pt-3 flex justify-between items-baseline text-base font-extrabold text-text">
                <span>Total Due</span>
                <span className="text-primary-700 text-xl">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Order CTA */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-sm font-bold bg-accent-500 hover:bg-accent-600 text-white shadow-lg border-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Placing Your Order...
                </>
              ) : (
                <>Confirm Order (Cash on Delivery)</>
              )}
            </Button>

            {/* Trust Signal Strip */}
            <div className="pt-2 border-t border-border space-y-1.5 text-[11px] text-text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>100% authentic international products guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Pay cash after inspecting your parcel</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Easy 7-day return if not satisfied</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
