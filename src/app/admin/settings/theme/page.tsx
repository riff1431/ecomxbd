"use client";

import { useState } from "react";
import { Palette, Sparkles, Save, CheckCircle2, Sliders, Type, Layout } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export default function AdminThemeSettingsPage() {
  const [themeColor, setThemeColor] = useState("rose");
  const [announcement, setAnnouncement] = useState("⚡ 100% Authentic Korean & UK Skincare | Free Delivery over ৳2,500!");
  const [insideDhakaFree, setInsideDhakaFree] = useState(2500);
  const [outsideDhakaFree, setOutsideDhakaFree] = useState(3500);
  const [supportPhone, setSupportPhone] = useState("+880 1700-000000");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const themes = [
    { id: "rose", name: "Rose Gold Luxe (Active)", bg: "bg-rose-500", border: "border-rose-500" },
    { id: "emerald", name: "Korean Botanical Emerald", bg: "bg-emerald-600", border: "border-emerald-600" },
    { id: "violet", name: "Modern Velvet Plum", bg: "bg-purple-600", border: "border-purple-600" },
    { id: "dark", name: "Midnight Monochrome", bg: "bg-zinc-900", border: "border-zinc-900" },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Storefront Theme & Branding Customizer</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Customize your storefront brand palette, announcement banner, and free shipping delivery rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Color Theme Selector */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-text flex items-center gap-2 border-b border-border pb-2">
            <Palette className="h-4 w-4 text-primary-600" />
            Brand Color Palette
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {themes.map((t) => (
              <div
                key={t.id}
                onClick={() => setThemeColor(t.id)}
                className={`cursor-pointer rounded-2xl border-2 p-3 space-y-2 transition-all ${
                  themeColor === t.id ? `${t.border} bg-surface-secondary/70 shadow-sm` : "border-border hover:border-zinc-300"
                }`}
              >
                <div className={`h-8 w-full rounded-xl ${t.bg}`} />
                <span className="font-bold text-text text-xs block text-center">{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-text flex items-center gap-2 border-b border-border pb-2">
            <Type className="h-4 w-4 text-primary-600" />
            Announcement Bar & Top Notification
          </h2>

          <div>
            <label className="block font-semibold text-text mb-1">
              Top Announcement Text
            </label>
            <input
              type="text"
              required
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:border-primary-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Delivery Rules */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-text flex items-center gap-2 border-b border-border pb-2">
            <Sliders className="h-4 w-4 text-primary-600" />
            Shipping & Free Delivery Thresholds (BDT)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text mb-1">
                Inside Dhaka Free Shipping Threshold (৳)
              </label>
              <input
                type="number"
                required
                value={insideDhakaFree}
                onChange={(e) => setInsideDhakaFree(Number(e.target.value))}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Outside Dhaka Free Shipping Threshold (৳)
              </label>
              <input
                type="number"
                required
                value={outsideDhakaFree}
                onChange={(e) => setOutsideDhakaFree(Number(e.target.value))}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:border-primary-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Theme preferences saved!
            </span>
          )}
          <Button type="submit" size="sm" className="ml-auto text-xs">
            <Save className="h-3.5 w-3.5 mr-1" />
            Save Storefront Theme
          </Button>
        </div>
      </form>
    </div>
  );
}
