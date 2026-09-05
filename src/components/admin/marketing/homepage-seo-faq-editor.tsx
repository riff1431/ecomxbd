"use client";

import React from "react";
import { Plus, Trash2, HelpCircle, Sparkles, CheckCircle2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import {
  type HomepageFullConfig,
  type HomepageFaqItem,
} from "@/features/marketing/homepage-types";

interface HomepageSeoFaqEditorProps {
  config: HomepageFullConfig;
  onChange: (updated: HomepageFullConfig) => void;
}

export function HomepageSeoFaqEditor({ config, onChange }: HomepageSeoFaqEditorProps) {
  const faqSection = config.faqSection || {
    enabled: true,
    heading: "Frequently Asked Questions & Beauty Guide",
    headingBn: "প্রয়োজনীয় প্রশ্নোত্তর ও বিউটি শপিং গাইড",
    subtitle: "Everything you need to know about authentic cosmetics, delivery, and skincare in Bangladesh",
    subtitleBn: "বাংলাদেশে ১০০% অথেনটিক কসমেটিকস, দ্রুত ডেলিভারি ও স্কিনকেয়ার সম্পর্কিত সাধারণ তথ্যাবলী",
    seoDescriptionHtml: "",
    seoDescriptionHtmlBn: "",
    faqs: [],
  };

  const updateSection = (field: string, value: any) => {
    onChange({
      ...config,
      faqSection: {
        ...faqSection,
        [field]: value,
      },
    });
  };

  const updateFaq = (index: number, field: keyof HomepageFaqItem, value: string) => {
    const list = [...(faqSection.faqs || [])];
    list[index] = { ...list[index], [field]: value };
    updateSection("faqs", list);
  };

  const addFaq = () => {
    const newItem: HomepageFaqItem = {
      id: `faq-${Date.now()}`,
      category: "General Inquiry",
      question: "New Frequently Asked Question",
      questionBn: "নতুন সাধারণ জিজ্ঞাসা",
      answer: "Provide a helpful, humanized, and transparent answer here.",
      answerBn: "এখানে স্পষ্ট ও আন্তরিক ভাষায় উত্তরটি লিখুন।",
    };
    updateSection("faqs", [...(faqSection.faqs || []), newItem]);
  };

  const removeFaq = (index: number) => {
    const list = (faqSection.faqs || []).filter((_, i) => i !== index);
    updateSection("faqs", list);
  };

  const moveFaq = (index: number, direction: "up" | "down") => {
    const list = [...(faqSection.faqs || [])];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    updateSection("faqs", list);
  };

  return (
    <div className="space-y-6">
      {/* Header card with toggle */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#e91e63]" />
              SEO & Humanized FAQ Section (Beauty Booth / Ogerio Style)
            </h2>
            <span className="rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5">
              Google Schema.org Ready
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Boost search engine ranking and build buyer trust with comprehensive skincare guides and interactive FAQ accordions.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={faqSection.enabled !== false}
            onChange={(e) => updateSection("enabled", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e91e63]"></div>
          <span className="ml-3 text-xs font-bold text-gray-800">
            {faqSection.enabled !== false ? "Section Active" : "Section Disabled"}
          </span>
        </label>
      </div>

      {/* Section Headings */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
          Section Titles & Bilingual Headings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Heading (English)
            </label>
            <input
              type="text"
              value={faqSection.heading}
              onChange={(e) => updateSection("heading", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Heading (বাংলা)
            </label>
            <input
              type="text"
              value={faqSection.headingBn || ""}
              onChange={(e) => updateSection("headingBn", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Subtitle (English)
            </label>
            <input
              type="text"
              value={faqSection.subtitle}
              onChange={(e) => updateSection("subtitle", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Subtitle (বাংলা)
            </label>
            <input
              type="text"
              value={faqSection.subtitleBn || ""}
              onChange={(e) => updateSection("subtitleBn", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>
        </div>
      </div>

      {/* Humanized SEO Introduction Box */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Humanized SEO Introduction & Buyer Guide
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Rich intro block explaining authenticity, imports, and fast delivery (similar to Beauty Booth / Ogerio footer guide).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              SEO Intro Text (English)
            </label>
            <textarea
              rows={4}
              value={faqSection.seoDescriptionHtml || ""}
              onChange={(e) => updateSection("seoDescriptionHtml", e.target.value)}
              className="w-full rounded-xl border p-3 text-xs text-gray-800 focus:outline-none focus:border-[#e91e63] font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              SEO Intro Text (বাংলা)
            </label>
            <textarea
              rows={4}
              value={faqSection.seoDescriptionHtmlBn || ""}
              onChange={(e) => updateSection("seoDescriptionHtmlBn", e.target.value)}
              className="w-full rounded-xl border p-3 text-xs text-gray-800 focus:outline-none focus:border-[#e91e63] leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* FAQ Items List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Interactive FAQ Items ({faqSection.faqs?.length || 0})
            </h3>
            <p className="text-xs text-gray-500">
              Displayed as expandable accordions on mobile, tablet, and desktop with JSON-LD Schema.
            </p>
          </div>

          <Button
            type="button"
            onClick={addFaq}
            size="sm"
            variant="outline"
            className="text-xs font-bold border-[#e91e63] text-[#e91e63] hover:bg-pink-50"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add FAQ Question
          </Button>
        </div>

        <div className="space-y-4">
          {faqSection.faqs?.map((faq, idx) => (
            <div
              key={faq.id || idx}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-50 text-xs font-bold text-[#e91e63]">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black uppercase text-gray-800">
                    Question #{idx + 1}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveFaq(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFaq(idx, "down")}
                    disabled={idx === (faqSection.faqs?.length || 0) - 1}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFaq(idx)}
                    className="p-1 rounded text-gray-400 hover:text-red-600 ml-1"
                    title="Delete Question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={faq.category || ""}
                  onChange={(e) => updateFaq(idx, "category", e.target.value)}
                  placeholder="e.g. Authenticity & Quality, Delivery, Returns"
                  className="w-full sm:w-72 rounded-xl border px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#e91e63]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Question (English)
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(idx, "question", e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Question (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={faq.questionBn || ""}
                    onChange={(e) => updateFaq(idx, "questionBn", e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Answer (English)
                  </label>
                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                    className="w-full rounded-xl border p-2.5 text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-[#e91e63]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Answer (বাংলা)
                  </label>
                  <textarea
                    rows={3}
                    value={faq.answerBn || ""}
                    onChange={(e) => updateFaq(idx, "answerBn", e.target.value)}
                    className="w-full rounded-xl border p-2.5 text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-[#e91e63]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
