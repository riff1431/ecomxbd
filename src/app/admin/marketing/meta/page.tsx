"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ExternalLink, ShieldCheck, CheckCircle2, Code2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { trackMetaEvent } from "@/components/analytics/meta-pixel";

export default function AdminMetaSettingsPage() {
  const [pixelId, setPixelId] = useState("123456789012345");
  const [capiToken, setCapiToken] = useState("");
  const [testCode, setTestCode] = useState("TEST89582");
  const [saved, setSaved] = useState(false);
  const [tested, setTested] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestEvent = () => {
    trackMetaEvent("Purchase", {
      value: 1365.0,
      currency: "BDT",
      content_name: "COSRX Advanced Snail 96 Mucin Power Essence",
      content_type: "product",
    });
    setTested(true);
    setTimeout(() => setTested(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Meta Pixel & Conversions API (CAPI)</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Configure Facebook / Instagram pixel tracking, Conversions API deduplication, and Dynamic Catalog feeds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings Form */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4 text-xs">
          <h2 className="text-base font-bold text-text flex items-center gap-2 border-b border-border pb-2">
            <Sparkles className="h-4 w-4 text-primary-600" />
            Meta Tracking Credentials
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-semibold text-text mb-1">
                Meta Pixel ID
              </label>
              <input
                type="text"
                required
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Conversions API (CAPI) Access Token
              </label>
              <input
                type="password"
                placeholder="EAAB..."
                value={capiToken}
                onChange={(e) => setCapiToken(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Test Event Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. TEST12345"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              {saved && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Credentials saved!
                </span>
              )}
              <Button type="submit" size="sm" className="ml-auto text-xs">
                <Save className="h-3.5 w-3.5 mr-1" />
                Save Settings
              </Button>
            </div>
          </form>
        </div>

        {/* Dynamic Catalog Feed Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4 text-xs">
            <h2 className="text-base font-bold text-text flex items-center gap-2 border-b border-border pb-2">
              <Code2 className="h-4 w-4 text-primary-600" />
              Meta Product Catalog XML Feed
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Use this real-time dynamic XML feed to sync your skincare catalog with Facebook / Instagram Shop and run Advantage+ catalog ads.
            </p>

            <div className="rounded-xl bg-surface-secondary p-3 font-mono text-[11px] text-text-secondary break-all border border-border">
              http://localhost:3000/api/feed/meta
            </div>

            <Link href="/api/feed/meta" target="_blank" className="inline-block">
              <Button variant="outline" size="sm" className="text-xs">
                <ExternalLink className="h-3.5 w-3.5 mr-1 text-primary-600" />
                Open Live XML Feed
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-3 text-xs">
            <h3 className="font-bold text-text">Verify Pixel Event Dispatch</h3>
            <p className="text-text-secondary">
              Click below to fire a test &quot;Purchase&quot; event into the active Meta Pixel script.
            </p>
            <div className="flex items-center gap-2">
              <Button onClick={handleTestEvent} size="sm" variant="secondary" className="text-xs">
                Fire Test Purchase Event
              </Button>
              {tested && (
                <span className="text-xs font-semibold text-emerald-600">
                  Dispatched!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
