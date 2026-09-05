"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import {
  type HomepageFaqSectionConfig,
  type HomepageFaqItem,
} from "@/features/marketing/homepage-types";

interface HomepageSeoFaqProps {
  config?: HomepageFaqSectionConfig;
}

export function HomepageSeoFaq({ config }: HomepageSeoFaqProps) {
  const { language } = useLanguage();
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  if (config && config.enabled === false) {
    return null;
  }

  const heading =
    language === "bn"
      ? config?.headingBn || config?.heading || "প্রয়োজনীয় প্রশ্নোত্তর ও বিউটি শপিং গাইড"
      : config?.heading || "Frequently Asked Questions & Beauty Guide";

  const subtitle =
    language === "bn"
      ? config?.subtitleBn ||
        config?.subtitle ||
        "বাংলাদেশে ১০০% খাঁটি কসমেটিকস, দ্রুত ডেলিভারি ও স্কিনকেয়ার সম্পর্কিত তথ্য"
      : config?.subtitle ||
        "Everything you need to know about authentic cosmetics, delivery, and skincare in Bangladesh";

  const seoDescription =
    language === "bn"
      ? config?.seoDescriptionHtmlBn || config?.seoDescriptionHtml
      : config?.seoDescriptionHtml;

  const faqs = config?.faqs || [];

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  // Structured Data (JSON-LD FAQPage) for Google Search SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: language === "bn" && faq.questionBn ? faq.questionBn : faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: language === "bn" && faq.answerBn ? faq.answerBn : faq.answer,
      },
    })),
  };

  return (
    <section
      id="homepage-seo-faq"
      className="border-t border-zinc-200/80 bg-linear-to-b from-white via-pink-50/20 to-white py-14 sm:py-20"
      aria-labelledby="seo-faq-heading"
    >
      {/* Schema.org FAQPage JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container-main max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100/80 px-3.5 py-1 text-xs font-bold text-pink-700 mb-3.5 border border-pink-200/60 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-pink-600" />
            <span>{language === "bn" ? "অফিসিয়াল বিউটি গাইড" : "Official Beauty Guide"}</span>
          </div>

          <h2
            id="seo-faq-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight leading-tight"
          >
            {heading}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Humanized SEO Introduction Box (Similar to Beauty Booth / Ogerio) */}
        {seoDescription && (
          <article className="rounded-2xl border border-pink-100 bg-linear-to-br from-pink-50/40 via-white to-pink-50/20 p-5 sm:p-7 shadow-xs mb-10 text-zinc-700 text-sm sm:text-base leading-relaxed">
            <div
              className="prose prose-sm sm:prose-base max-w-none text-zinc-700 leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: seoDescription }}
            />

            {/* Trust highlights row */}
            <div className="mt-6 pt-5 border-t border-pink-100/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-semibold text-zinc-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{language === "bn" ? "১০০% অরিজিনাল ব্যাচ কোড" : "100% Verified Batch Codes"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{language === "bn" ? "২৪-৪৮ ঘণ্টায় দ্রুত ডেলিভারি" : "Express 24-48h Delivery"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{language === "bn" ? "সরাসরি খুলে চেক করার সুবিধা" : "Doorstep Inspection Available"}</span>
              </div>
            </div>
          </article>
        )}

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqId === faq.id;
            const q = language === "bn" && faq.questionBn ? faq.questionBn : faq.question;
            const a = language === "bn" && faq.answerBn ? faq.answerBn : faq.answer;

            return (
              <div
                key={faq.id || idx}
                className={cn(
                  "rounded-2xl border transition-all duration-200 overflow-hidden",
                  isOpen
                    ? "border-pink-300/80 bg-white shadow-md ring-2 ring-pink-500/10"
                    : "border-zinc-200/80 bg-white/80 hover:bg-white hover:border-zinc-300"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors",
                        isOpen
                          ? "bg-pink-600 text-white shadow-xs"
                          : "bg-zinc-100 text-zinc-600"
                      )}
                    >
                      {idx + 1}
                    </span>

                    <div>
                      {faq.category && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600 block mb-0.5">
                          {faq.category}
                        </span>
                      )}
                      <span className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                        {q}
                      </span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200",
                      isOpen ? "rotate-180 bg-pink-100 text-pink-700" : "bg-zinc-100 text-zinc-500"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-pink-50 animate-in fade-in-50 duration-150"
                  >
                    <p>{a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need More Assistance Banner */}
        <div className="mt-10 rounded-2xl bg-zinc-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-600 text-white shadow-xs">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-black">
                {language === "bn"
                  ? "আরও কোনো প্রশ্ন বা স্কিনকেয়ার পরামর্শ প্রয়োজন?"
                  : "Have more questions or need skincare advice?"}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {language === "bn"
                  ? "আমাদের বিউটি স্পেশালিস্টরা প্রতিদিন সকাল ১০টা থেকে রাত ১০টা পর্যন্ত সক্রিয় আছেন।"
                  : "Our certified beauty experts are available daily 10 AM to 10 PM."}
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-xl bg-[#e91e63] px-5 py-2.5 text-xs sm:text-sm font-black text-white hover:bg-sg-pink-hover transition-colors shadow-md flex items-center gap-2"
          >
            <span>{language === "bn" ? "হোয়াটসঅ্যাপে মেসেজ দিন" : "Chat on WhatsApp"}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
