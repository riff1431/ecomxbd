"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Clock, Mail, Phone, MapPin, Banknote } from "lucide-react";
import { type HomepageFullConfig, DEFAULT_HOMEPAGE_CONFIG } from "@/features/marketing/homepage-types";
import { getHomepageConfig } from "@/features/marketing/homepage-actions";

export function StorefrontFooter({ config: initialConfig }: { config?: HomepageFullConfig }) {
  const [config, setConfig] = useState<HomepageFullConfig>(initialConfig || DEFAULT_HOMEPAGE_CONFIG);

  useEffect(() => {
    if (!initialConfig) {
      getHomepageConfig().then((data) => {
        if (data) setConfig(data);
      });
    }
  }, [initialConfig]);

  const footerLogo = config.footerLogoImageUrl || config.headerConfig?.logoImageUrl;
  const brandName = config.footerBrandText || config.headerConfig?.logoText || "Blush & Budget";
  const aboutText =
    config.footerAboutText ||
    "Bangladesh's most trusted beauty and personal care destination for 100% authentic international skincare, hair care, and cosmetics with nationwide Cash on Delivery.";
  const copyrightText =
    config.footerCopyright ||
    `© ${new Date().getFullYear()} ${brandName}. All rights reserved. 100% Genuine Certified Cosmetics.`;
  const supportPhone = config.supportPhone || "+880 1700-000000";

  return (
    <footer className="border-t border-gray-800 bg-[#0d131f] text-zinc-300 pb-20 lg:pb-0">
      {/* 1. Value Props Strip (Enhanced Trust Pillars) */}
      <div className="border-b border-zinc-800/80 bg-black/50 py-8 sm:py-10">
        <div className="container-main grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <div className="flex items-center gap-3.5 sm:gap-4 p-2 sm:p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-500/15 text-[#e91e63] border border-pink-500/30 shadow-xs">
              <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2]" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">100% Authentic</p>
              <p className="text-xs sm:text-[13px] text-zinc-400 mt-0.5">Direct from Authorized Brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 p-2 sm:p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-500/15 text-[#e91e63] border border-pink-500/30 shadow-xs">
              <Truck className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2]" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">Fast Delivery</p>
              <p className="text-xs sm:text-[13px] text-zinc-400 mt-0.5">24–48h Dhaka, 3–5d Outside</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 p-2 sm:p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-500/15 text-[#e91e63] border border-pink-500/30 shadow-xs">
              <RotateCcw className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2]" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">7 Days Return</p>
              <p className="text-xs sm:text-[13px] text-zinc-400 mt-0.5">Easy Return & Replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 p-2 sm:p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-500/15 text-[#e91e63] border border-pink-500/30 shadow-xs">
              <Clock className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2]" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">Cash on Delivery</p>
              <p className="text-xs sm:text-[13px] text-zinc-400 mt-0.5">bKash, Nagad & Cash on Arrival</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="container-main py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* About / Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link href={config.headerConfig?.logoLink || "/"} className="inline-block">
              {footerLogo ? (
                <img
                  src={footerLogo}
                  alt={brandName}
                  className="h-10 sm:h-12 max-h-12 w-auto max-w-[200px] sm:max-w-[240px] object-contain shrink-0"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-white tracking-[0.15em] uppercase font-sans">
                  {brandName}
                </span>
              )}
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              {aboutText}
            </p>

            {/* Newsletter */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs sm:text-sm font-bold text-white block">Get Exclusive Deals & Beauty Tips</span>
              <div className="flex max-w-sm gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-[#e91e63] focus:outline-none"
                />
                <button className="rounded-xl bg-[#e91e63] px-5 py-2.5 text-sm font-black text-white hover:bg-[#d81b60] transition-colors shadow-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Shop Categories Column */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm sm:text-base font-black uppercase tracking-wider text-white">Categories</h3>
            <ul className="space-y-3 text-sm text-zinc-300 font-medium">
              <li><Link href="/products?category=skin-care" className="hover:text-[#e91e63] transition-colors block py-0.5">Skin Care</Link></li>
              <li><Link href="/products?category=hair-care" className="hover:text-[#e91e63] transition-colors block py-0.5">Hair Care</Link></li>
              <li><Link href="/products?category=makeup" className="hover:text-[#e91e63] transition-colors block py-0.5">Makeup</Link></li>
              <li><Link href="/products?category=body-care" className="hover:text-[#e91e63] transition-colors block py-0.5">Body Care</Link></li>
              <li><Link href="/brands" className="hover:text-[#e91e63] transition-colors block py-0.5">Top Brands</Link></li>
              <li><Link href="/products?discount=true" className="hover:text-[#e91e63] text-pink-400 font-bold transition-colors block py-0.5">Special Offers</Link></li>
            </ul>
          </div>

          {/* Customer Service & Legal Column */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-sm sm:text-base font-black uppercase tracking-wider text-white">Customer Care</h3>
            <ul className="space-y-3 text-sm text-zinc-300 font-medium">
              <li><Link href="/account" className="hover:text-[#e91e63] transition-colors block py-0.5">My Account</Link></li>
              <li><Link href="/track-order" className="hover:text-[#e91e63] transition-colors block py-0.5">Track Order</Link></li>
              <li><Link href="/account/wishlist" className="hover:text-[#e91e63] transition-colors block py-0.5">My Wishlist</Link></li>
              <li><Link href="/page/return-policy" className="hover:text-[#e91e63] transition-colors block py-0.5">Return Policy</Link></li>
              <li><Link href="/page/terms" className="hover:text-[#e91e63] transition-colors block py-0.5">Terms & Conditions</Link></li>
              <li><Link href="/page/privacy-policy" className="hover:text-[#e91e63] transition-colors block py-0.5">Privacy Policy</Link></li>
              <li><Link href="/page/faq" className="hover:text-[#e91e63] transition-colors block py-0.5">FAQ & Help Center</Link></li>
            </ul>
          </div>

          {/* Contact Details & Payment Badges Column */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h3 className="mb-4 text-sm sm:text-base font-black uppercase tracking-wider text-white">Contact Us</h3>
              <div className="space-y-3 text-sm text-zinc-300 font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#e91e63] shrink-0 mt-0.5" />
                  <span>Gulshan, Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#e91e63] shrink-0" />
                  <span className="font-bold">{supportPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#e91e63] shrink-0" />
                  <span className="font-bold">support@blushandbudget.com</span>
                </div>
              </div>
            </div>

            {/* Payment Method Badges (Authentic Brand SVG Logos) */}
            <div className="pt-4 border-t border-zinc-800">
              <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400 block mb-3">
                We Accept
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {/* 1. bKash SVG Logo Card */}
                <div className="flex items-center gap-1.5 rounded-xl bg-[#e2136e] px-3 py-1.5 shadow-sm border border-pink-400/30 hover:scale-105 transition-transform" title="bKash">
                  <svg viewBox="0 0 100 80" className="h-4 w-4 fill-white shrink-0">
                    <polygon points="50,5 95,50 50,40 5,50" />
                    <polygon points="50,45 80,75 50,65 20,75" opacity="0.9" />
                  </svg>
                  <span className="text-xs font-black tracking-tight text-white uppercase">bKash</span>
                </div>

                {/* 2. Nagad SVG Logo Card */}
                <div className="flex items-center gap-1.5 rounded-xl bg-[#f7941d] px-3 py-1.5 shadow-sm border border-orange-400/30 hover:scale-105 transition-transform" title="Nagad">
                  <svg viewBox="0 0 100 100" className="h-4 w-4 fill-white shrink-0">
                    <path d="M50 10 C30 35 15 50 15 70 C15 85 30 95 50 95 C70 95 85 85 85 70 C85 50 70 35 50 10 Z" />
                    <circle cx="50" cy="65" r="12" fill="#f7941d" />
                  </svg>
                  <span className="text-xs font-black tracking-tight text-white uppercase">Nagad</span>
                </div>

                {/* 3. VISA SVG Logo Card */}
                <div className="flex items-center justify-center rounded-xl bg-white px-3 py-1.5 shadow-sm border border-gray-200 hover:scale-105 transition-transform" title="Visa">
                  <span className="text-xs font-black italic tracking-widest text-[#1a1f71]">VISA</span>
                </div>

                {/* 4. Mastercard SVG Logo Card */}
                <div className="flex items-center gap-1.5 rounded-xl bg-[#1e293b] px-3 py-1.5 shadow-sm border border-slate-700 hover:scale-105 transition-transform" title="Mastercard">
                  <div className="relative flex items-center h-4 w-6">
                    <div className="absolute left-0 h-4 w-4 rounded-full bg-[#eb001b]" />
                    <div className="absolute right-0 h-4 w-4 rounded-full bg-[#f79e1b] opacity-85" />
                  </div>
                  <span className="text-[11px] font-extrabold text-white">Mastercard</span>
                </div>

                {/* 5. Cash on Delivery Card */}
                <div className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 shadow-sm border border-emerald-500/40 hover:scale-105 transition-transform" title="Cash on Delivery">
                  <Banknote className="h-4 w-4 text-white shrink-0" />
                  <span className="text-xs font-black tracking-tight text-white">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="mt-12 border-t border-zinc-900 pt-6 text-center text-xs sm:text-sm text-zinc-500 font-medium">
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}
