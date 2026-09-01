import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Clock, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export function StorefrontFooter() {
  return (
    <footer className="border-t border-border bg-zinc-950 text-zinc-300 pb-16 lg:pb-0">
      {/* 1. Value Props Strip */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/60 py-6 sm:py-8">
        <div className="container-main grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-400 border border-primary-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">100% Authentic</p>
              <p className="text-[11px] text-zinc-400">Direct authorized imports</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-400 border border-primary-500/20">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Fast Nationwide Delivery</p>
              <p className="text-[11px] text-zinc-400">24–48h Dhaka, 3–5d outside</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-400 border border-primary-500/20">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">7 Days Easy Return</p>
              <p className="text-[11px] text-zinc-400">Instant wallet refund</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-400 border border-primary-500/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Cash on Delivery</p>
              <p className="text-[11px] text-zinc-400">bKash, Nagad & Cash on Arrival</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="container-main py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* About / Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 font-black text-white text-base shadow-sm">
                eX
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                ecom<span className="text-primary-400">X</span>bangladesh
              </span>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Bangladesh&apos;s premier curated e-commerce for authentic international skincare, clinical actives, K-beauty formulations, and cosmetics. Certified genuine with nationwide Cash on Delivery.
            </p>

            {/* Newsletter */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-white">Special Offers & Skincare Routine Guides</span>
              <div className="flex max-w-sm gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:border-primary-500 focus:outline-none"
                />
                <button className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Shop Categories</h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/products?category=skin-care" className="hover:text-white transition-colors">Skin Care</Link></li>
              <li><Link href="/products?category=hair-care" className="hover:text-white transition-colors">Hair Care</Link></li>
              <li><Link href="/products?category=makeup" className="hover:text-white transition-colors">Makeup & Cosmetics</Link></li>
              <li><Link href="/products?category=body-care" className="hover:text-white transition-colors">Body Care</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/quiz" className="hover:text-amber-300 font-semibold transition-colors">Skin Routine Quiz</Link></li>
            </ul>
          </div>

          {/* Customer Service & Legal CMS */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Customer Care</h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/account" className="hover:text-white transition-colors">My Profile & Orders</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Consignment</Link></li>
              <li><Link href="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
              <li><Link href="/return-policy" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Customer Support</h3>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-400 shrink-0 mt-0.5" />
                <span>Gulshan-1 Circle, Dhaka-1212, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-400 shrink-0" />
                <span>+880 1700-000000 (10 AM - 10 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-400 shrink-0" />
                <span>support@ecomxbangladesh.com</span>
              </div>
            </div>

            {/* Payment Icons */}
            <div className="mt-4 pt-3 border-t border-zinc-800/60">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-2">Accepted Payment Methods</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300">bKash</span>
                <span className="rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300">Nagad</span>
                <span className="rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300">Visa</span>
                <span className="rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300">Mastercard</span>
                <span className="rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-zinc-900 pt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} ecomXbangladesh Ltd. All rights reserved. 100% Genuine Certified.
        </div>
      </div>
    </footer>
  );
}
