"use client";

import React from "react";
import {
  PanelBottom,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  CreditCard,
  Share2,
  Newspaper,
  ShieldCheck,
} from "lucide-react";
import { ImageUploadDropzone } from "@/components/shared/image-upload-dropzone";
import {
  type HomepageFullConfig,
  type FooterConfig,
  DEFAULT_HOMEPAGE_CONFIG,
} from "@/features/marketing/homepage-types";

interface HomepageFooterEditorProps {
  config: HomepageFullConfig;
  onChange: (updated: HomepageFullConfig) => void;
}

export function HomepageFooterEditor({ config, onChange }: HomepageFooterEditorProps) {
  const footer = config.footerConfig || DEFAULT_HOMEPAGE_CONFIG.footerConfig!;

  const updateFooter = (field: keyof FooterConfig, value: any) => {
    onChange({
      ...config,
      footerConfig: {
        ...footer,
        [field]: value,
      },
    });
  };

  const updatePaymentMethod = (method: string, enabled: boolean) => {
    const current = footer.acceptedPaymentMethods || {
      bkash: true,
      nagad: true,
      visa: true,
      mastercard: true,
      cod: true,
    };
    updateFooter("acceptedPaymentMethods", {
      ...current,
      [method]: enabled,
    });
  };

  const updateSocialLink = (platform: string, url: string) => {
    const current = footer.socialLinks || {};
    updateFooter("socialLinks", {
      ...current,
      [platform]: url,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Brand & Logo Settings */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <PanelBottom className="h-5 w-5 text-[#e91e63]" />
          Footer Brand & Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Footer Brand Display Name
            </label>
            <input
              type="text"
              value={footer.brandText || config.footerBrandText || ""}
              onChange={(e) => updateFooter("brandText", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Copyright Notice Text
            </label>
            <input
              type="text"
              value={footer.copyrightText || config.footerCopyright || ""}
              onChange={(e) => updateFooter("copyrightText", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>
        </div>

        {/* Footer Logo Image Dropzone */}
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
            Footer Logo Image (Optional — defaults to header logo if empty)
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 w-full">
              <ImageUploadDropzone
                value={footer.logoImageUrl || config.footerLogoImageUrl || ""}
                onChange={(url) => updateFooter("logoImageUrl", url)}
              />
            </div>
            {(footer.logoImageUrl || config.footerLogoImageUrl) && (
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 shrink-0 text-center">
                <span className="text-[10px] text-zinc-400 block mb-1">Preview (Dark Bg)</span>
                <img
                  src={footer.logoImageUrl || config.footerLogoImageUrl}
                  alt="Footer Logo Preview"
                  className="h-10 max-w-40 object-contain mx-auto"
                />
              </div>
            )}
          </div>
        </div>

        {/* About / Description Bilingual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              About Description (English)
            </label>
            <textarea
              rows={3}
              value={footer.aboutText || config.footerAboutText || ""}
              onChange={(e) => updateFooter("aboutText", e.target.value)}
              className="w-full rounded-xl border p-3 text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              About Description (বাংলা)
            </label>
            <textarea
              rows={3}
              value={footer.aboutTextBn || ""}
              onChange={(e) => updateFooter("aboutTextBn", e.target.value)}
              className="w-full rounded-xl border p-3 text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-[#e91e63]"
            />
          </div>
        </div>
      </div>

      {/* 2. Customer Support & Contact Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Phone className="h-5 w-5 text-[#e91e63]" />
          Support & Contact Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Support Phone Hotline (Click-to-Call)
            </label>
            <input
              type="text"
              value={footer.supportPhone || config.supportPhone || ""}
              onChange={(e) => updateFooter("supportPhone", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Support Email (Click-to-Email)
            </label>
            <input
              type="email"
              value={footer.supportEmail || config.supportEmail || ""}
              onChange={(e) => updateFooter("supportEmail", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Office Address (English)
            </label>
            <input
              type="text"
              value={footer.supportAddress || "Gulshan, Dhaka, Bangladesh"}
              onChange={(e) => updateFooter("supportAddress", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Office Address (বাংলা)
            </label>
            <input
              type="text"
              value={footer.supportAddressBn || "গুলশান, ঢাকা, বাংলাদেশ"}
              onChange={(e) => updateFooter("supportAddressBn", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              WhatsApp Hotline Number
            </label>
            <input
              type="text"
              value={footer.supportWhatsapp || "+880 1700-000000"}
              onChange={(e) => updateFooter("supportWhatsapp", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>
        </div>
      </div>

      {/* 3. Newsletter Subscription Controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-[#e91e63]" />
            Newsletter Subscription Box
          </h2>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={footer.showNewsletter !== false}
              onChange={(e) => updateFooter("showNewsletter", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e91e63]"></div>
            <span className="ml-2.5 text-xs font-bold text-gray-800">
              {footer.showNewsletter !== false ? "Visible" : "Hidden"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Newsletter Title (English)
            </label>
            <input
              type="text"
              value={footer.newsletterTitle || "Get Exclusive Deals & Beauty Tips"}
              onChange={(e) => updateFooter("newsletterTitle", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Newsletter Title (বাংলা)
            </label>
            <input
              type="text"
              value={footer.newsletterTitleBn || "এক্সক্লুসিভ অফার ও বিউটি টিপস পান"}
              onChange={(e) => updateFooter("newsletterTitleBn", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Newsletter Subtitle (English)
            </label>
            <input
              type="text"
              value={footer.newsletterSubtitle || "Subscribe for new arrivals, flash sale coupons & skincare routine guides."}
              onChange={(e) => updateFooter("newsletterSubtitle", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Newsletter Subtitle (বাংলা)
            </label>
            <input
              type="text"
              value={footer.newsletterSubtitleBn || "নতুন প্রোডাক্ট রিলিজ, ডিসকাউন্ট ভাউচার ও স্কিনকেয়ার গাইড পেতে সাবস্ক্রাইব করুন।"}
              onChange={(e) => updateFooter("newsletterSubtitleBn", e.target.value)}
              className="w-full rounded-xl border px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>
        </div>
      </div>

      {/* 4. Payment Method Badges */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#e91e63]" />
            Accepted Payment Badges
          </h2>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={footer.showPaymentBadges !== false}
              onChange={(e) => updateFooter("showPaymentBadges", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e91e63]"></div>
            <span className="ml-2.5 text-xs font-bold text-gray-800">
              {footer.showPaymentBadges !== false ? "Visible" : "Hidden"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: "bkash", label: "bKash" },
            { id: "nagad", label: "Nagad" },
            { id: "visa", label: "VISA" },
            { id: "mastercard", label: "Mastercard" },
            { id: "cod", label: "Cash on Delivery" },
          ].map((item) => {
            const isChecked = footer.acceptedPaymentMethods?.[item.id as keyof typeof footer.acceptedPaymentMethods] !== false;
            return (
              <label
                key={item.id}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => updatePaymentMethod(item.id, e.target.checked)}
                  className="rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                />
                <span className="text-xs font-bold text-gray-800">{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Social Media Links */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Share2 className="h-5 w-5 text-[#e91e63]" />
          Social Media URLs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Facebook Page Link
            </label>
            <input
              type="url"
              value={footer.socialLinks?.facebook || ""}
              onChange={(e) => updateSocialLink("facebook", e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Instagram Profile Link
            </label>
            <input
              type="url"
              value={footer.socialLinks?.instagram || ""}
              onChange={(e) => updateSocialLink("instagram", e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              YouTube Channel Link
            </label>
            <input
              type="url"
              value={footer.socialLinks?.youtube || ""}
              onChange={(e) => updateSocialLink("youtube", e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              TikTok Profile Link
            </label>
            <input
              type="url"
              value={footer.socialLinks?.tiktok || ""}
              onChange={(e) => updateSocialLink("tiktok", e.target.value)}
              placeholder="https://tiktok.com/@..."
              className="w-full rounded-xl border px-3.5 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#e91e63]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
