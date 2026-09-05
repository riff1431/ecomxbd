"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Clock, Mail, Phone, MapPin, Banknote } from "lucide-react";
import { type HomepageFullConfig, DEFAULT_HOMEPAGE_CONFIG } from "@/features/marketing/homepage-types";
import { getHomepageConfig } from "@/features/marketing/homepage-actions";
import { trackSubscribe, trackContact } from "@/lib/analytics/datalayer";
import { useLanguage } from "@/context/language-context";

export function StorefrontFooter({ config: initialConfig }: { config?: HomepageFullConfig }) {
  const { language, t } = useLanguage();
  const [config, setConfig] = useState<HomepageFullConfig>(initialConfig || DEFAULT_HOMEPAGE_CONFIG);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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
  const supportEmail = config.supportEmail || "support@example.com";

  return (
    <footer className="border-t border-gray-800 bg-[#0d131f] text-zinc-300 pb-20 lg:pb-0">
      {/* 1. Value Props Strip (Enhanced Trust Pillars) */}
      <div className="border-b border-zinc-800/80 bg-black/50 py-8 sm:py-10">
        <div className="container-main grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <div className="flex items-center gap-3.5 sm:gap-4 p-2 sm:p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-500/15 text-[#e91e63] border border-pink-500/30 shadow-xs">
              <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 stroke-2" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">{t("footer", "authenticTitle")}</p>
              <p className="text-xs sm:text-[13px] text-zinc-400 mt-0.5">{t("footer", "authenticDesc")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 p-2 sm:p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-500/15 text-[#e91e63] border border-pink-500/30 shadow-xs">
              <Truck className="h-6 w-6 sm:h-7 sm:w-7 stroke-2" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">{t("footer", "deliveryTitle")}</p>
              <p className="text-xs sm:text-[13px] text-zinc-400 mt-0.5">{t("footer", "deliveryDesc")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 p-2 sm:p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-500/15 text-[#e91e63] border border-pink-500/30 shadow-xs">
              <RotateCcw className="h-6 w-6 sm:h-7 sm:w-7 stroke-2" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">{t("footer", "returnTitle")}</p>
              <p className="text-xs sm:text-[13px] text-zinc-400 mt-0.5">{t("footer", "returnDesc")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 p-2 sm:p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-500/15 text-[#e91e63] border border-pink-500/30 shadow-xs">
              <Clock className="h-6 w-6 sm:h-7 sm:w-7 stroke-2" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">{t("footer", "codTitle")}</p>
              <p className="text-xs sm:text-[13px] text-zinc-400 mt-0.5">{t("footer", "codDesc")}</p>
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
                  className="h-10 sm:h-12 max-h-12 w-auto max-w-50 sm:max-w-60 object-contain shrink-0"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-white tracking-[0.15em] uppercase font-sans">
                  {brandName}
                </span>
              )}
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              {language === "bn" && !config.footerAboutText
                ? "বাংলাদেশের সবচেয়ে নির্ভরযোগ্য বিউটি ও স্কিনকেয়ার গন্তব্য। ১০০% অরিজিনাল কসমেটিকস সারা দেশে ক্যাশ অন ডেলিভারিতে দ্রুত পৌঁছানো হয়।"
                : aboutText}
            </p>

            {/* Newsletter */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs sm:text-sm font-bold text-white block">
                {language === "bn" ? "এক্সক্লুসিভ অফার ও বিউটি টিপস পান" : "Get Exclusive Deals & Beauty Tips"}
              </span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newsletterEmail.trim()) return;
                  trackSubscribe("newsletter", newsletterEmail);
                  setSubscribed(true);
                  setNewsletterEmail("");
                  setTimeout(() => setSubscribed(false), 3000);
                }}
                className="flex max-w-sm gap-2"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t("footer", "emailPlaceholder")}
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-2.5 text-sm text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#e91e63] px-5 py-2.5 text-sm font-black text-white hover:bg-sg-pink-hover transition-colors shadow-md"
                >
                  {subscribed ? t("footer", "subscribed") : t("footer", "subscribe")}
                </button>
              </form>
            </div>
          </div>

          {/* Shop Categories Column */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm sm:text-base font-black uppercase tracking-wider text-white">
              {t("header", "categories")}
            </h3>
            <ul className="space-y-3 text-sm text-zinc-300 font-medium">
              <li><Link href="/products?category=skin-care" className="hover:text-[#e91e63] transition-colors block py-0.5">{language === "bn" ? "স্কিন কেয়ার" : "Skin Care"}</Link></li>
              <li><Link href="/products?category=hair-care" className="hover:text-[#e91e63] transition-colors block py-0.5">{language === "bn" ? "হেয়ার কেয়ার" : "Hair Care"}</Link></li>
              <li><Link href="/products?category=makeup" className="hover:text-[#e91e63] transition-colors block py-0.5">{language === "bn" ? "মেকআপ" : "Makeup"}</Link></li>
              <li><Link href="/products?category=body-care" className="hover:text-[#e91e63] transition-colors block py-0.5">{language === "bn" ? "বডি কেয়ার" : "Body Care"}</Link></li>
              <li><Link href="/brands" className="hover:text-[#e91e63] transition-colors block py-0.5">{t("header", "topBrands")}</Link></li>
              <li><Link href="/blog" className="hover:text-[#e91e63] font-bold text-pink-400 transition-colors block py-0.5">{language === "bn" ? "বিউটি জার্নাল ও গাইড" : "Beauty Journal & Guides"}</Link></li>
              <li><Link href="/products?discount=true" className="hover:text-[#e91e63] text-pink-400 font-bold transition-colors block py-0.5">{language === "bn" ? "স্পেশাল অফার" : "Special Offers"}</Link></li>
            </ul>
          </div>

          {/* Customer Service & Legal Column */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-sm sm:text-base font-black uppercase tracking-wider text-white">
              {t("footer", "customerCare")}
            </h3>
            <ul className="space-y-3 text-sm text-zinc-300 font-medium">
              <li><Link href="/account" className="hover:text-[#e91e63] transition-colors block py-0.5">{t("account", "myAccount")}</Link></li>
              <li><Link href="/track-order" className="hover:text-[#e91e63] transition-colors block py-0.5">{t("header", "trackOrder")}</Link></li>
              <li><Link href="/account/wishlist" className="hover:text-[#e91e63] transition-colors block py-0.5">{t("header", "wishlist")}</Link></li>
              <li><Link href="/page/return-policy" className="hover:text-[#e91e63] transition-colors block py-0.5">{language === "bn" ? "রিটার্ন পলিসি" : "Return Policy"}</Link></li>
              <li><Link href="/page/terms" className="hover:text-[#e91e63] transition-colors block py-0.5">{language === "bn" ? "শর্তাবলী ও নিয়মাবলী" : "Terms & Conditions"}</Link></li>
              <li><Link href="/page/privacy-policy" className="hover:text-[#e91e63] transition-colors block py-0.5">{language === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy"}</Link></li>
              <li><Link href="/page/faq" className="hover:text-[#e91e63] transition-colors block py-0.5">{language === "bn" ? "প্রশ্নোত্তর ও হেল্প সেন্টার" : "FAQ & Help Center"}</Link></li>
            </ul>
          </div>

          {/* Contact Details & Payment Badges Column */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h3 className="mb-4 text-sm sm:text-base font-black uppercase tracking-wider text-white">
                {language === "bn" ? "যোগাযোগ করুন" : "Contact Us"}
              </h3>
              <div className="space-y-3 text-sm text-zinc-300 font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#e91e63] shrink-0 mt-0.5" />
                  <span>{language === "bn" ? "গুলশান, ঢাকা, বাংলাদেশ" : "Gulshan, Dhaka, Bangladesh"}</span>
                </div>
                <a
                  href={`tel:${supportPhone}`}
                  onClick={() => trackContact("phone", supportPhone)}
                  className="flex items-center gap-3 hover:text-white transition-colors"
                >
                  <Phone className="h-5 w-5 text-[#e91e63] shrink-0" />
                  <span className="font-bold">{supportPhone}</span>
                </a>
                <a
                  href={`mailto:${supportEmail}`}
                  onClick={() => trackContact("email", supportEmail)}
                  className="flex items-center gap-3 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5 text-[#e91e63] shrink-0" />
                  <span className="font-bold">{supportEmail}</span>
                </a>
              </div>
            </div>

            {/* Payment Method Badges (Authentic Brand SVG Logos) */}
            <div className="pt-4 border-t border-zinc-800">
              <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400 block mb-3">
                {language === "bn" ? "আমরা গ্রহণ করি" : "We Accept"}
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
                <div className="flex items-center gap-1.5 rounded-xl bg-admin-sidebar-hover px-3 py-1.5 shadow-sm border border-slate-700 hover:scale-105 transition-transform" title="Mastercard">
                  <div className="relative flex items-center h-4 w-6">
                    <div className="absolute left-0 h-4 w-4 rounded-full bg-[#eb001b]" />
                    <div className="absolute right-0 h-4 w-4 rounded-full bg-[#f79e1b] opacity-85" />
                  </div>
                  <span className="text-[11px] font-extrabold text-white">Mastercard</span>
                </div>

                {/* 5. Cash on Delivery Card */}
                <div className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 shadow-sm border border-emerald-500/40 hover:scale-105 transition-transform" title={t("footer", "codTitle")}>
                  <Banknote className="h-4 w-4 text-white shrink-0" />
                  <span className="text-xs font-black tracking-tight text-white">{t("footer", "codTitle")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="mt-12 border-t border-zinc-900 pt-6 text-center text-xs sm:text-sm text-zinc-500 font-medium">
          {language === "bn" && !config.footerCopyright
            ? `© ${new Date().getFullYear()} ${brandName}। ${t("footer", "rightsReserved")}`
            : copyrightText}
        </div>
      </div>
    </footer>
  );
}
