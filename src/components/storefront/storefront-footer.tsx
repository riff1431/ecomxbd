import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Clock, Mail, Phone, MapPin } from "lucide-react";

export function StorefrontFooter() {
  return (
    <footer className="border-t border-border bg-zinc-950 text-zinc-300">
      {/* 1. Value Props Strip */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/60 py-8">
        <div className="container-main grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-500 border border-primary-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">100% Authentic</p>
              <p className="text-[11px] text-zinc-400">Direct from authorized brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-500 border border-primary-500/20">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Fast Nationwide Delivery</p>
              <p className="text-[11px] text-zinc-400">24-48h Dhaka, 3-5d outside</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-500 border border-primary-500/20">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">7 Days Easy Return</p>
              <p className="text-[11px] text-zinc-400">Hassle-free guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-500 border border-primary-500/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Cash on Delivery</p>
              <p className="text-[11px] text-zinc-400">Pay upon inspecting package</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="container-main py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* About / Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 font-extrabold text-white text-base">
                eX
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                ecom<span className="text-primary-500">X</span>bangladesh
              </span>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Bangladesh&apos;s premier destination for authentic international skincare, K-beauty formulations, and luxury cosmetics. Trusted by over 100,000 beauty enthusiasts across all 64 districts.
            </p>

            {/* Newsletter */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-white">Get Special Offers & Skincare Tips</span>
              <div className="flex max-w-sm gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none"
                />
                <button className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Shop Categories</h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/products?category=skin-care" className="hover:text-white transition-colors">Skin Care</Link></li>
              <li><Link href="/products?category=hair-care" className="hover:text-white transition-colors">Hair Care</Link></li>
              <li><Link href="/products?category=makeup" className="hover:text-white transition-colors">Makeup & Cosmetics</Link></li>
              <li><Link href="/products?category=body-care" className="hover:text-white transition-colors">Body Care</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Customer Care</h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/account" className="hover:text-white transition-colors">My Profile</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
              <li><span className="text-zinc-500">Shipping & Delivery</span></li>
              <li><span className="text-zinc-500">Return & Refund Policy</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Showroom & Support</h3>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                <span>Gulshan-1 Circle, Dhaka-1212, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-500 shrink-0" />
                <span>+880 1700-000000 (10 AM - 10 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-500 shrink-0" />
                <span>support@ecomxbangladesh.com</span>
              </div>
            </div>

            {/* Payment Icons */}
            <div className="mt-4 pt-3 border-t border-zinc-800/60">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-2">Accepted Payment</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300">bKash</span>
                <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300">Nagad</span>
                <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300">Visa</span>
                <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300">Mastercard</span>
                <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-zinc-900 pt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} ecomXbangladesh Ltd. All rights reserved. Built with Next.js 16 & Supabase.
        </div>
      </div>
    </footer>
  );
}
