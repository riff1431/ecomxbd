"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { useLanguage } from "@/context/language-context";

interface CmsPageClientProps {
  slug: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function CmsPageClient({
  title,
  subtitle,
  lastUpdated,
  children,
}: CmsPageClientProps) {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-[70vh] bg-surface-secondary/40 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-xs text-text-muted hover:text-text mb-4">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            {language === "bn" ? "হোমে ফিরে যান" : "Back to Home"}
          </Button>
        </Link>

        {/* Page Header */}
        <div className="rounded-3xl border border-border bg-white p-8 sm:p-10 shadow-card space-y-3">
          <span className="rounded-full bg-primary-50 text-primary-700 px-3 py-0.5 text-xs font-bold uppercase border border-primary-200">
            {language === "bn" ? "অফিসিয়াল পলিসি ও তথ্য" : "Official Policy & Information"}
          </span>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">{title}</h1>
          <p className="text-sm text-text-secondary">{subtitle}</p>
          <div className="flex items-center gap-1.5 text-xs text-text-muted pt-2">
            <Clock className="h-3.5 w-3.5" />
            <span>{language === "bn" ? "সর্বশেষ সংস্করণ: " : "Last reviewed: "}{lastUpdated}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="rounded-3xl border border-border bg-white p-8 sm:p-10 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
