"use client";

import { useState } from "react";
import Link from "next/link";
import { Rss, ExternalLink, Copy, Check, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export default function AdminCatalogFeedsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const feeds = [
    {
      id: "meta",
      name: "Meta Dynamic Product Catalog (Facebook & Instagram Shop)",
      url: "http://localhost:3000/api/feed/meta",
      format: "RSS 2.0 / XML",
      products_count: "Published Catalog",
      status: "Active & Auto-Syncing",
      description: "Compatible with Meta Commerce Manager for Advantage+ catalog ads and IG Shop tagging.",
    },
    {
      id: "google",
      name: "Google Merchant Center Product Feed",
      url: "http://localhost:3000/api/feed/meta",
      format: "Google Merchant XML",
      products_count: "Published Catalog",
      status: "Active",
      description: "Powers Google Shopping and Free Product Listings on Google Search in Bangladesh.",
    },
  ];

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Product Catalog Feeds</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Real-time dynamic XML feeds to sync your skincare catalog with Meta, Google, and marketplace channels.
        </p>
      </div>

      <div className="space-y-4">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Rss className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">{feed.name}</h3>
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
        ))}
      </div>
    </div>
  );
}
