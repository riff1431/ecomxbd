"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, ArrowRight, Clock } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function FlashSaleBanner() {
  const { language, toBn } = useLanguage();
  const isBn = language === "bn";

  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUnit = (val: number) => {
    const padded = String(val).padStart(2, "0");
    return isBn ? toBn(padded) : padded;
  };

  return (
    <div className="rounded-2xl border border-accent-200 bg-linear-to-r from-accent-500 via-rose-600 to-amber-600 p-6 sm:p-8 text-white shadow-lg overflow-hidden relative">
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
            <Flame className="h-4 w-4 text-amber-300 animate-bounce" />
            <span>{isBn ? "সীমিত সময়ের বিশেষ বিউটি অফার" : "Limited Time Beauty Drop"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isBn ? "জনপ্রিয় কে-বিউটিতে ৩৫% পর্যন্ত ছাড়" : "Up to 35% OFF Trending K-Beauty"}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 max-w-md">
            {isBn
              ? "১০০% অরিজিনাল সার্টিফাইড এসেন্স, সিরাম ও ক্লিনজার আকর্ষণীয় ফ্ল্যাশ সেল মূল্যে।"
              : "Directly imported essences, cleansers, and serums at special flash prices with guaranteed authenticity."}
          </p>
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-center">
            <div className="rounded-xl bg-black/40 px-3 py-2 backdrop-blur-sm border border-white/20 min-w-12">
              <span className="block text-xl sm:text-2xl font-black">
                {formatUnit(timeLeft.hours)}
              </span>
              <span className="text-[11px] sm:text-xs uppercase font-semibold text-white/80">
                {isBn ? "ঘণ্টা" : "Hours"}
              </span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="rounded-xl bg-black/40 px-3 py-2 backdrop-blur-sm border border-white/20 min-w-12">
              <span className="block text-xl sm:text-2xl font-black">
                {formatUnit(timeLeft.minutes)}
              </span>
              <span className="text-[11px] sm:text-xs uppercase font-semibold text-white/80">
                {isBn ? "মিনিট" : "Mins"}
              </span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="rounded-xl bg-black/40 px-3 py-2 backdrop-blur-sm border border-white/20 min-w-12">
              <span className="block text-xl sm:text-2xl font-black">
                {formatUnit(timeLeft.seconds)}
              </span>
              <span className="text-[11px] sm:text-xs uppercase font-semibold text-white/80">
                {isBn ? "সেকেন্ড" : "Secs"}
              </span>
            </div>
          </div>

          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs sm:text-sm font-bold text-accent-600 shadow-md hover:bg-white/90 hover:scale-105 transition-all"
          >
            {isBn ? "অফার দেখুন" : "Shop Deals"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
