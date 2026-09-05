"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  type Language,
  translations,
  toBengaliNumber,
} from "@/lib/i18n/translations";
import { formatPrice } from "@/lib/utils";

export interface LocalizationConfig {
  default_language: "bn" | "en";
  enable_language_switcher: boolean;
  show_homepage_language_bar: boolean;
}

export const DEFAULT_LOCALIZATION_CONFIG: LocalizationConfig = {
  default_language: "bn",
  enable_language_switcher: true,
  show_homepage_language_bar: true,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isSwitcherEnabled: boolean;
  showHomepageBar: boolean;
  defaultLanguage: Language;
  t: <N extends keyof (typeof translations)["bn"]>(
    namespace: N,
    key: keyof (typeof translations)["bn"][N]
  ) => string;
  toBn: (val: string | number) => string;
  formatPriceBn: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig?: LocalizationConfig;
}) {
  const config = initialConfig || DEFAULT_LOCALIZATION_CONFIG;
  const configuredDefault = config.default_language || "bn";

  // If switcher is disabled by admin, strictly lock to admin's configured default language
  const [language, setLanguageState] = useState<Language>(configuredDefault);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!config.enable_language_switcher) {
      setLanguageState(configuredDefault);
      return;
    }

    try {
      const saved = localStorage.getItem("ecom_lang") as Language | null;
      if (saved === "en" || saved === "bn") {
        setLanguageState(saved);
      } else {
        setLanguageState(configuredDefault);
        localStorage.setItem("ecom_lang", configuredDefault);
      }
    } catch {
      // Ignore localStorage errors
    }
    setMounted(true);
  }, [config.enable_language_switcher, configuredDefault]);

  // Synchronize document attributes and font classes for Hind Siliguri vs Inter
  useEffect(() => {
    if (typeof document !== "undefined") {
      const isBn = language === "bn";
      document.documentElement.lang = isBn ? "bn" : "en";
      document.documentElement.classList.toggle("lang-bn", isBn);
      document.documentElement.classList.toggle("lang-en", !isBn);
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    if (!config.enable_language_switcher) return; // Admin locked
    setLanguageState(lang);
    try {
      localStorage.setItem("ecom_lang", lang);
    } catch {}
  }, [config.enable_language_switcher]);

  const toggleLanguage = useCallback(() => {
    if (!config.enable_language_switcher) return; // Admin locked
    setLanguageState((prev) => {
      const next = prev === "bn" ? "en" : "bn";
      try {
        localStorage.setItem("ecom_lang", next);
      } catch {}
      return next;
    });
  }, [config.enable_language_switcher]);

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
        isSwitcherEnabled: config.enable_language_switcher,
        showHomepageBar: config.show_homepage_language_bar,
        defaultLanguage: configuredDefault,
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
      isSwitcherEnabled: true,
      showHomepageBar: true,
      defaultLanguage: "bn" as Language,
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
