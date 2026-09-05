"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  type Language,
  translations,
  toBengaliNumber,
} from "@/lib/i18n/translations";
import { formatPrice } from "@/lib/utils";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: <N extends keyof (typeof translations)["bn"]>(
    namespace: N,
    key: keyof (typeof translations)["bn"][N]
  ) => string;
  toBn: (val: string | number) => string;
  formatPriceBn: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Bangla ('bn')
  const [language, setLanguageState] = useState<Language>("bn");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ecom_lang") as Language | null;
      if (saved === "en" || saved === "bn") {
        setLanguageState(saved);
      } else {
        // Explicitly set 'bn' as the default for new visitors
        setLanguageState("bn");
        localStorage.setItem("ecom_lang", "bn");
      }
    } catch {
      // Ignore localStorage errors (e.g. incognito)
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language === "bn" ? "bn" : "en";
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("ecom_lang", lang);
    } catch {}
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === "bn" ? "en" : "bn";
      try {
        localStorage.setItem("ecom_lang", next);
      } catch {}
      return next;
    });
  }, []);

  const t = useCallback(
    <N extends keyof (typeof translations)["bn"]>(
      namespace: N,
      key: keyof (typeof translations)["bn"][N]
    ): string => {
      const currentDict = translations[language] || translations.bn;
      const section = currentDict[namespace] as Record<string, string>;
      if (section && typeof section[key as string] === "string") {
        return section[key as string];
      }
      // Fallback to Bangla, then English
      const fallbackBn = (translations.bn[namespace] as Record<string, string>)?.[key as string];
      if (fallbackBn) return fallbackBn;
      const fallbackEn = (translations.en[namespace] as Record<string, string>)?.[key as string];
      return fallbackEn || String(key);
    },
    [language]
  );

  const toBn = useCallback(
    (val: string | number) => {
      if (language === "en") return String(val);
      return toBengaliNumber(val);
    },
    [language]
  );

  const formatPriceBn = useCallback(
    (amount: number) => {
      if (language === "bn") {
        const formatted = amount.toLocaleString("en-IN");
        return `৳${toBengaliNumber(formatted)}`;
      }
      return formatPrice(amount);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        toBn,
        formatPriceBn,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider during SSR/hydration
    return {
      language: "bn" as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: <N extends keyof (typeof translations)["bn"]>(
        namespace: N,
        key: keyof (typeof translations)["bn"][N]
      ): string => {
        const section = translations.bn[namespace] as Record<string, string>;
        return section?.[key as string] || String(key);
      },
      toBn: (val: string | number) => toBengaliNumber(val),
      formatPriceBn: (amount: number) => `৳${toBengaliNumber(amount.toLocaleString("en-IN"))}`,
    };
  }
  return context;
}
