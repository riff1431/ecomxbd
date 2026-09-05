"use client";

import { useState } from "react";
import Link from "next/link";
import { Rss, ExternalLink, Copy, Check, Sparkles, Video, Globe } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export default function AdminCatalogFeedsPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "";

  const feeds = [
    {
      id: "meta",
      name: "Meta Dynamic Product Catalog (Facebook & Instagram Shop)",
      url: `${origin}/api/feed/meta`,
      format: "RSS 2.0 / XML",
      badge: "Meta Commerce",
      icon: Sparkles,
      iconColor: "text-blue-600 bg-blue-50",
      status: "Active & Auto-Syncing",
      description:
        "Compatible with Meta Commerce Manager for Advantage+ dynamic catalog ads, carousel remarketing, and Instagram Shop product tagging.",
    },
    {
      id: "tiktok",
      name: "TikTok Product Catalog Feed (TikTok Shop & Ads Manager)",
      url: `${origin}/api/feed/tiktok`,
      format: "RSS 2.0 / XML (TikTok Spec)",
      badge: "TikTok Ads",
      icon: Video,
      iconColor: "text-pink-600 bg-pink-50",
      status: "Active & Auto-Syncing",
      description:
        "Syncs directly with TikTok Catalog Manager for Video Shopping Ads, Dynamic Showcase Ads (DSA), and product link anchors in TikTok videos.",
    },
    {
      id: "google",
      name: "Google Merchant Center Product Feed",
      url: `${origin}/api/feed/google`,
      format: "Google Merchant XML",
      badge: "Google Merchant",
      icon: Globe,
      iconColor: "text-emerald-600 bg-emerald-50",
      status: "Active & Auto-Syncing",
      description:
        "Powers Google Shopping, Performance Max (PMax) campaigns, and Free Organic Product Listings on Google Search in Bangladesh.",
    },
  ];

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-border pb-4 bg-white p-6 rounded-3xl shadow-card">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
            Omnichannel Data Feeds
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <Rss className="h-6 w-6 text-primary-600" />
          Product Catalog Feeds
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Real-time dynamic XML feeds to sync your published product catalog across Meta (Facebook &amp; Instagram), TikTok Shop / Ads Manager, and Google Merchant Center.
        </p>
      </div>

      <div className="space-y-4">
        {feeds.map((feed) => {
          const Icon = feed.icon;
          return (
            <div
              key={feed.id}
              className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${feed.iconColor}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-text">{feed.name}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-surface-secondary text-text-secondary border border-border">
                        {feed.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-text-muted">Format: {feed.format}</span>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-0.5 text-[10px] font-bold border border-emerald-200 uppercase w-fit">
                  {feed.status}
                </span>
              </div>

              <p className="text-text-secondary leading-relaxed">{feed.description}</p>

              <div className="flex items-center gap-2 bg-surface-secondary/70 p-2.5 rounded-xl border border-border">
                <span className="font-mono text-[11px] text-text-secondary truncate flex-1">
                  {feed.url}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(feed.id, feed.url)}
                  className="text-xs shrink-0"
                >
                  {copied === feed.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy URL
                    </>
                  )}
                </Button>
                <Link href={feed.url} target="_blank">
                  <Button variant="outline" size="sm" className="text-xs shrink-0">
                    <ExternalLink className="h-3.5 w-3.5 mr-1 text-primary-600" />
                    View XML
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
