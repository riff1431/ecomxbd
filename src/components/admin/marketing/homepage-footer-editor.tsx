"use client";

import React, { useState } from "react";
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
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Link2,
  Eye,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { ImageUploadDropzone } from "@/components/shared/image-upload-dropzone";
import { cn } from "@/lib/utils";
import {
  type HomepageFullConfig,
  type FooterConfig,
  type FooterLinkItem,
  DEFAULT_HOMEPAGE_CONFIG,
} from "@/features/marketing/homepage-types";

interface HomepageFooterEditorProps {
  config: HomepageFullConfig;
  onChange: (updated: HomepageFullConfig) => void;
}

export function HomepageFooterEditor({ config, onChange }: HomepageFooterEditorProps) {
  const defaultFooter = DEFAULT_HOMEPAGE_CONFIG.footerConfig!;
  const rawFooter = config.footerConfig;
  const [previewLang, setPreviewLang] = useState<"bn" | "en">("bn");

  const footer: FooterConfig = {
    brandText: rawFooter?.brandText ?? config.footerBrandText ?? defaultFooter.brandText,
    logoImageUrl: rawFooter?.logoImageUrl ?? config.footerLogoImageUrl ?? defaultFooter.logoImageUrl,
    aboutText: rawFooter?.aboutText ?? config.footerAboutText ?? defaultFooter.aboutText,
    aboutTextBn: rawFooter?.aboutTextBn ?? defaultFooter.aboutTextBn,
    copyrightText: rawFooter?.copyrightText ?? config.footerCopyright ?? defaultFooter.copyrightText,
    supportPhone: rawFooter?.supportPhone ?? config.supportPhone ?? defaultFooter.supportPhone,
    supportEmail: rawFooter?.supportEmail ?? config.supportEmail ?? defaultFooter.supportEmail,
    supportAddress: rawFooter?.supportAddress ?? defaultFooter.supportAddress,
    supportAddressBn: rawFooter?.supportAddressBn ?? defaultFooter.supportAddressBn,
    supportWhatsapp: rawFooter?.supportWhatsapp ?? defaultFooter.supportWhatsapp,
    newsletterTitle: rawFooter?.newsletterTitle ?? defaultFooter.newsletterTitle,
    newsletterTitleBn: rawFooter?.newsletterTitleBn ?? defaultFooter.newsletterTitleBn,
    newsletterSubtitle: rawFooter?.newsletterSubtitle ?? defaultFooter.newsletterSubtitle,
    newsletterSubtitleBn: rawFooter?.newsletterSubtitleBn ?? defaultFooter.newsletterSubtitleBn,
    showTrustPillars: rawFooter?.showTrustPillars ?? defaultFooter.showTrustPillars ?? true,
    showNewsletter: rawFooter?.showNewsletter ?? defaultFooter.showNewsletter ?? true,
    showPaymentBadges: rawFooter?.showPaymentBadges ?? defaultFooter.showPaymentBadges ?? true,
    paymentBadgeStyle: rawFooter?.paymentBadgeStyle ?? defaultFooter.paymentBadgeStyle ?? "icons_only",
    showSocialLinks: rawFooter?.showSocialLinks ?? defaultFooter.showSocialLinks ?? true,
    socialLinks: {
      ...defaultFooter.socialLinks,
      ...(rawFooter?.socialLinks || {}),
    },
    acceptedPaymentMethods: {
      ...defaultFooter.acceptedPaymentMethods,
      ...(rawFooter?.acceptedPaymentMethods || {}),
    },
    categoryLinks:
      rawFooter?.categoryLinks && rawFooter.categoryLinks.length > 0
        ? rawFooter.categoryLinks
        : defaultFooter.categoryLinks!,
    customerCareLinks:
      rawFooter?.customerCareLinks && rawFooter.customerCareLinks.length > 0
        ? rawFooter.customerCareLinks
        : defaultFooter.customerCareLinks!,
  };

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

  // Category Links Helpers
  const updateCategoryLink = (index: number, field: keyof FooterLinkItem, value: any) => {
    const list = [...(footer.categoryLinks || [])];
    list[index] = { ...list[index], [field]: value };
    updateFooter("categoryLinks", list);
  };

  const addCategoryLink = () => {
    const newItem: FooterLinkItem = {
      label: "New Category",
      labelBn: "নতুন ক্যাটাগরি",
      href: "/products?category=all",
      isHighlight: false,
    };
    updateFooter("categoryLinks", [...(footer.categoryLinks || []), newItem]);
  };

  const removeCategoryLink = (index: number) => {
    const list = (footer.categoryLinks || []).filter((_, i) => i !== index);
    updateFooter("categoryLinks", list);
  };

  const moveCategoryLink = (index: number, direction: "up" | "down") => {
    const list = [...(footer.categoryLinks || [])];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    updateFooter("categoryLinks", list);
  };

  const resetCategoryLinks = () => {
    if (window.confirm("Reset footer category links back to the 7 default beauty categories?")) {
      updateFooter("categoryLinks", defaultFooter.categoryLinks);
    }
  };

  // Customer Care Links Helpers
  const updateCustomerCareLink = (index: number, field: keyof FooterLinkItem, value: any) => {
    const list = [...(footer.customerCareLinks || [])];
    list[index] = { ...list[index], [field]: value };
    updateFooter("customerCareLinks", list);
  };

  const addCustomerCareLink = () => {
    const newItem: FooterLinkItem = {
      label: "New Policy Link",
      labelBn: "নতুন পলিসি লিংক",
      href: "/page/help",
      isHighlight: false,
    };
    updateFooter("customerCareLinks", [...(footer.customerCareLinks || []), newItem]);
  };

  const removeCustomerCareLink = (index: number) => {
    const list = (footer.customerCareLinks || []).filter((_, i) => i !== index);
    updateFooter("customerCareLinks", list);
  };

  const moveCustomerCareLink = (index: number, direction: "up" | "down") => {
    const list = [...(footer.customerCareLinks || [])];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    updateFooter("customerCareLinks", list);
  };

  const resetCustomerCareLinks = () => {
    if (window.confirm("Reset customer care & policy links back to the 7 default links?")) {
      updateFooter("customerCareLinks", defaultFooter.customerCareLinks);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Value Props / Trust Pillars Strip Toggle & Direct Editor */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#e91e63]" />
                Trust Pillars & Guarantees Strip
              </h2>
              <span className="rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5">
                Top Footer Strip
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Configure visibility, titles, subtitles, and icons for the 4 trust guarantees appearing at the top of the footer.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={footer.showTrustPillars !== false}
              onChange={(e) => updateFooter("showTrustPillars", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e91e63]"></div>
            <span className="ml-3 text-xs font-bold text-gray-800">
              {footer.showTrustPillars !== false ? "Strip Active" : "Strip Hidden"}
            </span>
          </label>
        </div>

        {/* 4 Pillars Card Fields */}
        {footer.showTrustPillars !== false && (
          <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {(config.trustPillars || DEFAULT_HOMEPAGE_CONFIG.trustPillars).map((tp, idx) => (
              <div key={tp.id || idx} className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-[#e91e63]">
                    Pillar #{idx + 1}: {tp.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-gray-400">ID: {tp.id}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Title</label>
                    <input
                      type="text"
                      value={tp.title}
                      onChange={(e) => {
                        const list = [...(config.trustPillars || DEFAULT_HOMEPAGE_CONFIG.trustPillars)];
                        list[idx] = { ...list[idx], title: e.target.value };
                        onChange({ ...config, trustPillars: list });
                      }}
                      className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#e91e63]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Subtitle</label>
                    <input
                      type="text"
                      value={tp.subtitle}
                      onChange={(e) => {
                        const list = [...(config.trustPillars || DEFAULT_HOMEPAGE_CONFIG.trustPillars)];
                        list[idx] = { ...list[idx], subtitle: e.target.value };
                        onChange({ ...config, trustPillars: list });
                      }}
                      className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#e91e63]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Icon</label>
                  <select
                    value={tp.iconName || "shield"}
                    onChange={(e) => {
                      const list = [...(config.trustPillars || DEFAULT_HOMEPAGE_CONFIG.trustPillars)];
                      list[idx] = { ...list[idx], iconName: e.target.value };
                      onChange({ ...config, trustPillars: list });
                    }}
                    className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#e91e63]"
                  >
                    <option value="shield">Shield (100% Authentic Guarantee)</option>
                    <option value="truck">Truck (Express 24-48h Delivery)</option>
                    <option value="rotate">Rotate (7-Day Replacement / Returns)</option>
                    <option value="clock">Clock (24/7 Customer Service)</option>
                    <option value="zap">Banknote / Zap (Cash on Delivery)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Brand & Identity Settings */}
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

      {/* 3. Footer Category Links (Column 2) - 100% Controllable */}
      <div className="rounded-2xl border-2 border-pink-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-[#e91e63]" />
                Footer Category Links (Column 2)
              </h2>
              <span className="rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5">
                {footer.categoryLinks?.length || 0} Links
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage the navigation links under "ক্যাটাগরি" (Skin Care, Hair Care, Makeup, Special Offers, etc.).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={resetCategoryLinks}
              size="sm"
              variant="outline"
              className="text-xs font-bold border-gray-200 text-gray-700 hover:bg-gray-50"
              title="Reset to 7 defaults"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset 7 Defaults
            </Button>
            <Button
              type="button"
              onClick={addCategoryLink}
              size="sm"
              className="bg-[#e91e63] hover:bg-pink-700 text-white text-xs font-bold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Category Link
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {footer.categoryLinks?.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 flex flex-col lg:flex-row lg:items-center gap-3 justify-between"
            >
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-50 text-xs font-bold text-[#e91e63]">
                  {idx + 1}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveCategoryLink(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCategoryLink(idx, "down")}
                    disabled={idx === (footer.categoryLinks?.length || 0) - 1}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                <div>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateCategoryLink(idx, "label", e.target.value)}
                    placeholder="English Label (e.g. Skin Care)"
                    className="w-full rounded-lg border bg-white px-3 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={item.labelBn || ""}
                    onChange={(e) => updateCategoryLink(idx, "labelBn", e.target.value)}
                    placeholder="বাংলা নাম (যেমন: স্কিন কেয়ার)"
                    className="w-full rounded-lg border bg-white px-3 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => updateCategoryLink(idx, "href", e.target.value)}
                    placeholder="URL (e.g. /products?category=skin-care)"
                    className="w-full rounded-lg border bg-white px-3 py-1.5 text-xs font-mono text-gray-800 focus:outline-none focus:border-[#e91e63]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={item.isHighlight === true}
                    onChange={(e) => updateCategoryLink(idx, "isHighlight", e.target.checked)}
                    className="rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                  />
                  <span className={item.isHighlight ? "text-[#e91e63]" : ""}>Pink Highlight</span>
                </label>

                <button
                  type="button"
                  onClick={() => removeCategoryLink(idx)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Customer Care & Policies Links (Column 3) - 100% Controllable */}
      <div className="rounded-2xl border-2 border-pink-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-[#e91e63]" />
                Customer Care & Policy Links (Column 3)
              </h2>
              <span className="rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5">
                {footer.customerCareLinks?.length || 0} Links
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage the navigation links under "গ্রাহক সেবা" (Track Order, Return Policy, Terms, Privacy Policy, FAQ, etc.).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={resetCustomerCareLinks}
              size="sm"
              variant="outline"
              className="text-xs font-bold border-gray-200 text-gray-700 hover:bg-gray-50"
              title="Reset to 7 defaults"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset 7 Defaults
            </Button>
            <Button
              type="button"
              onClick={addCustomerCareLink}
              size="sm"
              className="bg-[#e91e63] hover:bg-pink-700 text-white text-xs font-bold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Policy Link
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {footer.customerCareLinks?.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 flex flex-col lg:flex-row lg:items-center gap-3 justify-between"
            >
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-50 text-xs font-bold text-[#e91e63]">
                  {idx + 1}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveCustomerCareLink(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCustomerCareLink(idx, "down")}
                    disabled={idx === (footer.customerCareLinks?.length || 0) - 1}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                <div>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateCustomerCareLink(idx, "label", e.target.value)}
                    placeholder="English Label (e.g. Track Order)"
                    className="w-full rounded-lg border bg-white px-3 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={item.labelBn || ""}
                    onChange={(e) => updateCustomerCareLink(idx, "labelBn", e.target.value)}
                    placeholder="বাংলা নাম (যেমন: অর্ডার ট্র্যাক)"
                    className="w-full rounded-lg border bg-white px-3 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#e91e63]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => updateCustomerCareLink(idx, "href", e.target.value)}
                    placeholder="URL (e.g. /track-order)"
                    className="w-full rounded-lg border bg-white px-3 py-1.5 text-xs font-mono text-gray-800 focus:outline-none focus:border-[#e91e63]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={item.isHighlight === true}
                    onChange={(e) => updateCustomerCareLink(idx, "isHighlight", e.target.checked)}
                    className="rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                  />
                  <span className={item.isHighlight ? "text-[#e91e63]" : ""}>Pink Highlight</span>
                </label>

                <button
                  type="button"
                  onClick={() => removeCustomerCareLink(idx)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Support & Contact Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Phone className="h-5 w-5 text-[#e91e63]" />
          Support & Contact Information (Column 4)
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
              WhatsApp Hotline Number or Direct Link
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

      {/* 6. Newsletter Subscription Controls */}
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

      {/* 7. Social Media Links & Visibility */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-[#e91e63]" />
            Social Media URLs & Visibility
          </h2>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={footer.showSocialLinks !== false}
              onChange={(e) => updateFooter("showSocialLinks", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e91e63]"></div>
            <span className="ml-2.5 text-xs font-bold text-gray-800">
              {footer.showSocialLinks !== false ? "Visible" : "Hidden"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              WhatsApp Support or Group Link
            </label>
            <input
              type="text"
              value={footer.socialLinks?.whatsapp || ""}
              onChange={(e) => updateSocialLink("whatsapp", e.target.value)}
              placeholder="https://wa.me/8801700000000 or +880 1700-000000"
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

      {/* 8. Payment Method Badges & Display Style */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#e91e63]" />
              Accepted Payment Badges
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Control accepted payment methods and display style in the storefront footer.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
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

        {footer.showPaymentBadges !== false && (
          <div className="space-y-4 pt-1">
            {/* Display Style Toggle: Icons Only vs Badges With Text */}
            <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-black text-gray-900">
                  Badge Display Style
                </span>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  &quot;Icons Only&quot; displays clean, uniform official brand logos without text (best suited for dark footers).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => updateFooter("paymentBadgeStyle", "icons_only")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    footer.paymentBadgeStyle !== "badges_with_text"
                      ? "bg-[#e91e63] text-white shadow-xs"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  )}
                >
                  ✨ Icons Only (Clean Logos)
                </button>
                <button
                  type="button"
                  onClick={() => updateFooter("paymentBadgeStyle", "badges_with_text")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    footer.paymentBadgeStyle === "badges_with_text"
                      ? "bg-[#e91e63] text-white shadow-xs"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  )}
                >
                  Badges with Text
                </button>
              </div>
            </div>

            {/* Individual Checkboxes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { id: "bkash", label: "bKash" },
                { id: "nagad", label: "Nagad" },
                { id: "visa", label: "VISA" },
                { id: "mastercard", label: "Mastercard" },
                { id: "amex", label: "AMEX" },
                { id: "cod", label: "Cash on Delivery" },
              ].map((item) => {
                const isChecked = footer.acceptedPaymentMethods?.[item.id as keyof typeof footer.acceptedPaymentMethods] !== false;
                return (
                  <label
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2.5 p-3 rounded-xl border transition-colors cursor-pointer select-none",
                      isChecked
                        ? "border-pink-200 bg-pink-50/40 text-gray-900 font-bold"
                        : "border-gray-200 bg-gray-50/50 text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => updatePaymentMethod(item.id, e.target.checked)}
                      className="rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                    />
                    <span className="text-xs">{item.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Live Footer Preview */}
            <div className="rounded-xl border border-slate-700 bg-[#0d131f] p-4 text-white space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                Live Footer Preview on Dark Background:
              </span>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {footer.acceptedPaymentMethods?.bkash !== false && (
                  <div className="flex h-7 w-12 items-center justify-center rounded-lg bg-white px-2 py-1 shadow-xs border border-white/20">
                    <svg viewBox="0 0 100 80" className="h-4.5 w-auto fill-[#e2136e]">
                      <polygon points="50,5 95,50 50,40 5,50" />
                      <polygon points="50,45 80,75 50,65 20,75" opacity="0.9" />
                    </svg>
                  </div>
                )}
                {footer.acceptedPaymentMethods?.nagad !== false && (
                  <div className="flex h-7 w-12 items-center justify-center rounded-lg bg-white px-2 py-1 shadow-xs border border-white/20">
                    <svg viewBox="0 0 100 100" className="h-5 w-auto">
                      <path d="M50 10 C30 35 15 50 15 70 C15 85 30 95 50 95 C70 95 85 85 85 70 C85 50 70 35 50 10 Z" fill="#e82429" />
                      <circle cx="50" cy="65" r="14" fill="#f7941d" />
                    </svg>
                  </div>
                )}
                {footer.acceptedPaymentMethods?.visa !== false && (
                  <div className="flex h-7 w-12 items-center justify-center rounded-lg bg-white px-2 py-1 shadow-xs border border-white/20">
                    <span className="text-xs font-black italic tracking-wider text-[#1a1f71] leading-none">VISA</span>
                  </div>
                )}
                {footer.acceptedPaymentMethods?.mastercard !== false && (
                  <div className="flex h-7 w-12 items-center justify-center rounded-lg bg-white px-2 py-1 shadow-xs border border-white/20">
                    <div className="relative flex items-center justify-center h-3.5 w-5.5">
                      <div className="absolute left-0.5 h-3.5 w-3.5 rounded-full bg-[#eb001b]" />
                      <div className="absolute right-0.5 h-3.5 w-3.5 rounded-full bg-[#f79e1b] opacity-90" />
                    </div>
                  </div>
                )}
                {footer.acceptedPaymentMethods?.amex && (
                  <div className="flex h-7 w-12 items-center justify-center rounded-lg bg-[#016fd0] px-2 py-1 shadow-xs border border-blue-400/30">
                    <span className="text-[9px] font-black uppercase text-white tracking-tighter leading-none">AMEX</span>
                  </div>
                )}
                {footer.acceptedPaymentMethods?.cod !== false && (
                  <div className="flex h-7 w-12 items-center justify-center rounded-lg bg-white px-2 py-1 shadow-xs border border-white/20">
                    <div className="flex flex-col items-center justify-center leading-none">
                      <span className="text-[7px] font-bold text-zinc-500">PAY ON</span>
                      <span className="text-[8px] font-black text-emerald-700 tracking-tight uppercase">DELIVERY</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
