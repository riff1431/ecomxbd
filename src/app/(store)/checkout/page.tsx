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
  UserCheck,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";
import { createOrder } from "@/features/orders/actions";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutSettings } from "@/features/settings/actions";
import { saveIncompleteLead, markLeadConverted } from "@/features/fraud/actions";

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checkoutSettings, setCheckoutSettings] = useState<any>({
    guest_checkout_enabled: true,
    require_phone: true,
    require_email: false,
    order_notes_enabled: true,
    min_order_amount: 0,
    cod_max_amount: 20000,
  });

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

  // Fetch Auth state & Checkout Settings
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUser(data.user);
        setFormData((prev) => ({
          ...prev,
          name: data.user.user_metadata?.full_name || prev.name,
          email: data.user.email || prev.email,
          phone: data.user.phone || prev.phone,
        }));
      }
    });

    getCheckoutSettings().then((settings) => {
      if (settings && Object.keys(settings).length > 0) {
        setCheckoutSettings({
          guest_checkout_enabled: settings.guest_checkout_enabled ?? true,
          require_phone: settings.require_phone ?? true,
          require_email: settings.require_email ?? false,
          order_notes_enabled: settings.order_notes_enabled ?? true,
          min_order_amount: Number(settings.min_order_amount || 0),
          cod_max_amount: Number(settings.cod_max_amount || 20000),
        });
      }
    });
  }, []);

  // Real-Time Incomplete Lead Auto-Capture (when user types Name & Phone)
  useEffect(() => {
    if (formData.name.trim() && formData.phone.trim().length >= 10 && items.length > 0) {
      const timer = setTimeout(() => {
        saveIncompleteLead({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          district: formData.district,
          address: formData.address,
          cartItems: items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
          cartTotal: subtotal - discount + (formData.district.toLowerCase().includes("dhaka") ? 60 : 120),
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData, items, subtotal, discount]);

  // Shipping Fee Logic
  const isInsideDhaka = formData.district.toLowerCase().includes("dhaka");
  const isFreeShipping =
    coupon?.type === "free_shipping" ||
    (isInsideDhaka && subtotal >= 2500) ||
    subtotal >= 3500;

  const baseDeliveryFee = isInsideDhaka ? 60 : 120;
  const shippingFee = isFreeShipping ? 0 : baseDeliveryFee;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const isBelowMinOrder =
    checkoutSettings.min_order_amount > 0 && subtotal < checkoutSettings.min_order_amount;
  const isLoginRequired = !checkoutSettings.guest_checkout_enabled && !currentUser;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // If login is required and customer is a guest
    if (isLoginRequired) {
      setErrorMsg("Please sign in or create an account to place your order.");
      return;
    }

    // Minimum order validation
    if (isBelowMinOrder) {
      setErrorMsg(
        `Minimum order amount is ৳${checkoutSettings.min_order_amount}. Please add ৳${
          checkoutSettings.min_order_amount - subtotal
        } more to place your order.`
      );
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg("Please enter your Full Name.");
      return;
    }

    const cleanPhone = formData.phone.trim();
    if (checkoutSettings.require_phone !== false) {
      if (!cleanPhone || !/^(?:\+8801|01)[3-9]\d{8}$/.test(cleanPhone)) {
        setErrorMsg("Please provide a valid 11-digit Bangladesh mobile number (e.g. 01712345678).");
        return;
      }
    }

    if (checkoutSettings.require_email && !formData.email.trim()) {
      setErrorMsg("Email address is required for checkout.");
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
      markLeadConverted(cleanPhone);
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
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-[#e91e63]">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Your bag is empty</h1>
        <p className="text-xs text-gray-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link href="/products" className="inline-block mt-2">
          <Button className="bg-[#e91e63] hover:bg-[#d81b60] text-white">Explore Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-gray-50/50">
      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <Link
          href="/cart"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Lock className="h-3.5 w-3.5" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      {/* Guest Checkout Disabled Alert / Sign In Prompt */}
      {isLoginRequired && (
        <div className="rounded-2xl border-2 border-pink-300 bg-pink-50/90 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-gray-900">
            <UserCheck className="h-5 w-5 text-[#e91e63]" />
            <span>Account Required to Place Order</span>
          </div>
          <p className="text-xs text-gray-600">
            Please sign in to your account or create a new account to complete your purchase. Your items in the cart will remain saved!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/login?redirect=/checkout"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#e91e63] px-4 py-2 text-xs font-black text-white hover:bg-[#d81b60] shadow-sm transition-all"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
            <Link
              href="/register?redirect=/checkout"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-black text-gray-800 hover:bg-gray-50 shadow-sm transition-all"
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Minimum Order Warning */}
      {isBelowMinOrder && (
        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs font-semibold text-amber-900">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            Minimum order amount is <strong>৳{checkoutSettings.min_order_amount}</strong>. Add{" "}
            <strong>৳{checkoutSettings.min_order_amount - subtotal}</strong> more to your cart to checkout.
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form: Delivery Address & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer Info */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-sm font-black uppercase text-gray-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e91e63] text-white text-xs font-bold">
                  1
                </span>
                Customer Contact Information
              </h2>
              {!currentUser && checkoutSettings.guest_checkout_enabled && (
                <Link
                  href="/login?redirect=/checkout"
                  className="text-xs font-bold text-[#e91e63] hover:underline"
                >
                  Already have an account? Sign In
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Arifur Rahman"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#e91e63] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Mobile Number (BD) {checkoutSettings.require_phone !== false && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="tel"
                  required={checkoutSettings.require_phone !== false}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#e91e63] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-800 mb-1">
                  Email Address {checkoutSettings.require_email ? <span className="text-red-500">*</span> : <span className="text-gray-400 font-normal">(Optional for tracking)</span>}
                </label>
                <input
                  type="email"
                  required={checkoutSettings.require_email}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#e91e63] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e91e63] text-white text-xs font-bold">
                2
              </span>
              Delivery Address in Bangladesh
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#e91e63] focus:bg-white focus:outline-none"
                >
                  {BD_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Thana / Upazila / Police Station <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.thana}
                  onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                  placeholder="e.g. Gulshan / Dhanmondi / Mirpur"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#e91e63] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-800 mb-1">
                  Detailed Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House / Holding Number, Road Number, Flat / Floor, Landmark..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#e91e63] focus:bg-white focus:outline-none"
                />
              </div>

              {checkoutSettings.order_notes_enabled !== false && (
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-800 mb-1">
                    Order Notes / Delivery Instructions <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Call 30 mins before arriving, leave with security"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#e91e63] focus:bg-white focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e91e63] text-white text-xs font-bold">
                3
              </span>
              Payment Method
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label className="flex items-center justify-between rounded-2xl border-2 border-[#e91e63] bg-pink-50/30 p-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    defaultChecked
                    className="h-4 w-4 accent-[#e91e63]"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Pay in cash or bKash/Nagad after receiving and inspecting your parcel.
                    </span>
                  </div>
                </div>
                <span className="rounded-lg bg-[#e91e63] text-white px-2.5 py-0.5 text-[10px] font-black uppercase">
                  Default
                </span>
              </label>

              {/* Online payment notice */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 text-xs text-gray-400 flex items-center justify-between opacity-75">
                <div className="flex items-center gap-2">
                  <input type="radio" disabled className="h-4 w-4" />
                  <span>bKash / Nagad / Visa / Mastercard</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Available soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Placement (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
              Order Summary ({items.length} item{items.length === 1 ? "" : "s"})
            </h2>

            {/* Line items preview */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1 divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-500">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-xs font-black text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Coupon Discount ({coupon?.code})
                  </span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>
                  Delivery: {isInsideDhaka ? "Inside Dhaka (24-48h)" : "Outside Dhaka (3-5d)"}
                </span>
                {shippingFee === 0 ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-bold text-gray-900">{formatPrice(shippingFee)}</span>
                )}
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-base font-black text-gray-900">
                <span>Total Due</span>
                <span className="text-[#e91e63] text-xl font-black">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Order CTA */}
            <Button
              type="submit"
              disabled={loading || isBelowMinOrder || isLoginRequired}
              className="w-full py-6 text-sm font-black uppercase tracking-wider bg-[#e91e63] hover:bg-[#d81b60] text-white shadow-lg border-none rounded-2xl transition-all active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Placing Your Order...
                </>
              ) : isLoginRequired ? (
                <>Sign In Required to Order</>
              ) : isBelowMinOrder ? (
                <>Below Min Order (৳{checkoutSettings.min_order_amount})</>
              ) : (
                <>Confirm Order (Cash on Delivery)</>
              )}
            </Button>

            {/* Trust Signal Strip */}
            <div className="pt-2 border-t border-gray-100 space-y-1.5 text-[11px] text-gray-500 font-medium">
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
                <span>Easy 7-day return & replacement</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
