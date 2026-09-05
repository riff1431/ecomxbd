"use client";

import { useLanguage } from "@/context/language-context";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "header-top" | "header-main" | "homepage-pill" | "mobile";
  className?: string;
}

export function LanguageSwitcher({
  variant = "header-top",
  className,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "header-top") {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full bg-white/10 p-0.5 border border-white/20 text-xs",
          className
        )}
      >
        <button
          type="button"
          onClick={() => setLanguage("bn")}
          className={cn(
            "rounded-full px-2.5 py-0.5 font-bold transition-all text-[11px]",
            language === "bn"
              ? "bg-[#e91e63] text-white shadow-xs"
              : "text-zinc-300 hover:text-white"
          )}
          aria-label="বাংলায় পরিবর্তন করুন"
        >
          বাংলা
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={cn(
            "rounded-full px-2.5 py-0.5 font-bold transition-all text-[11px]",
            language === "en"
              ? "bg-[#e91e63] text-white shadow-xs"
              : "text-zinc-300 hover:text-white"
          )}
          aria-label="Switch to English"
        >
          EN
        </button>
      </div>
    );
  }

  if (variant === "homepage-pill") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1.5 shadow-xs text-xs font-semibold",
          className
        )}
      >
        <Globe className="h-3.5 w-3.5 text-[#e91e63] shrink-0" />
        <span className="text-gray-500 text-[11px] hidden sm:inline">ভাষা:</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setLanguage("bn")}
            className={cn(
              "rounded-full px-2.5 py-0.5 transition-all text-xs font-bold",
              language === "bn"
                ? "bg-[#e91e63] text-white shadow-xs"
                : "text-gray-700 hover:text-[#e91e63] hover:bg-pink-50"
            )}
          >
            বাংলা
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={cn(
              "rounded-full px-2.5 py-0.5 transition-all text-xs font-bold",
              language === "en"
                ? "bg-[#e91e63] text-white shadow-xs"
                : "text-gray-700 hover:text-[#e91e63] hover:bg-pink-50"
            )}
          >
            English
          </button>
        </div>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div
        className={cn(
          "flex items-center justify-between rounded-xl bg-surface-secondary border border-border p-2 text-xs",
          className
        )}
      >
        <div className="flex items-center gap-2 font-medium text-text">
          <Globe className="h-4 w-4 text-[#e91e63]" />
          <span>ভাষা / Language</span>
        </div>
        <div className="flex items-center rounded-lg bg-white p-0.5 border border-border shadow-xs">
          <button
            type="button"
            onClick={() => setLanguage("bn")}
            className={cn(
              "rounded-md px-3 py-1 font-bold transition-all text-xs",
              language === "bn"
                ? "bg-[#e91e63] text-white shadow-xs"
                : "text-text-muted hover:text-text"
            )}
          >
            বাংলা
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={cn(
              "rounded-md px-3 py-1 font-bold transition-all text-xs",
              language === "en"
                ? "bg-[#e91e63] text-white shadow-xs"
                : "text-text-muted hover:text-text"
            )}
          >
            EN
          </button>
        </div>
      </div>
    );
  }

  // Default header-main
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-gray-100 p-1 border border-gray-200 text-xs",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        className={cn(
          "rounded-full px-2.5 py-1 font-bold transition-all text-xs",
          language === "bn"
            ? "bg-[#e91e63] text-white shadow-xs"
            : "text-gray-600 hover:text-black"
        )}
      >
        বাংলা
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={cn(
          "rounded-full px-2.5 py-1 font-bold transition-all text-xs",
          language === "en"
            ? "bg-[#e91e63] text-white shadow-xs"
            : "text-gray-600 hover:text-black"
        )}
      >
        English
      </button>
    </div>
  );
}
