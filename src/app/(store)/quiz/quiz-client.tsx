"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  RefreshCw,
  Loader2,
  Droplets,
  Scale,
  Sun,
  Hourglass,
  Wind,
  CloudSun,
  CheckCircle2,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/shared/ui/button";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import {
  trackStartTrial,
  trackSchedule,
  trackSubmitApplication,
  trackAddToCart,
} from "@/lib/analytics/datalayer";
import { getMatchedQuizRoutine, type MatchedProduct } from "@/features/quiz/actions";

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: { label: string; desc: string; icon: React.ComponentType<{ className?: string }>; value: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "What is your primary skin type?",
    subtitle: "How does your face feel midway through the day in Bangladesh climate?",
    options: [
      { label: "Dry & Dehydrated", desc: "Feels tight, flaky, or rough after cleansing", icon: Droplets, value: "dry" },
      { label: "Oily & Shiny", desc: "Excess sebum around T-zone, prone to breakouts", icon: Sparkles, value: "oily" },
      { label: "Combination", desc: "Oily forehead and nose, normal/dry cheeks", icon: Scale, value: "combo" },
      { label: "Sensitive & Reactive", desc: "Easily irritated, redness, stung by harsh products", icon: ShieldCheck, value: "sensitive" },
    ],
  },
  {
    id: 2,
    title: "What is your main skincare concern?",
    subtitle: "Select the primary skin transformation you want to achieve.",
    options: [
      { label: "Deep Hydration & Glass Skin", desc: "Repair damaged barrier, plumpness, natural radiant glow", icon: Droplets, value: "hydration" },
      { label: "Acne, Pores & Texture", desc: "Clear active blemishes and smooth bumpy texture", icon: Sparkles, value: "acne" },
      { label: "Dark Spots & Hyperpigmentation", desc: "Fade sun spots, post-acne marks, and even tone", icon: Sun, value: "brightening" },
      { label: "Anti-Aging & Elasticity", desc: "Fine lines, firmness, collagen support", icon: Hourglass, value: "aging" },
    ],
  },
  {
    id: 3,
    title: "What is your daily lifestyle exposure?",
    subtitle: "Understanding your daily environmental stressors.",
    options: [
      { label: "High Outdoor & Sun Exposure", desc: "Daily commute, public transport, outdoor activities", icon: Sun, value: "outdoor" },
      { label: "Air Conditioned Indoors", desc: "8+ hours in AC office or study room (dehydrating)", icon: Wind, value: "indoor" },
      { label: "Balanced Indoor & Outdoor", desc: "Mix of regular desk work and daily errands", icon: CloudSun, value: "mixed" },
    ],
  },
];

export function SkincareQuizClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [routineAdded, setRoutineAdded] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [matchedData, setMatchedData] = useState<{
    routineTitle: string;
    routineSubtitle: string;
    products: MatchedProduct[];
  } | null>(null);

  const { addItem, openCart } = useCart();

  const handleSelectOption = async (value: string) => {
    if (currentStep === 0) {
      trackStartTrial("skincare_routine_quiz", "routine_match");
    }

    const updated = { ...answers, [currentStep]: value };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      trackSchedule("skincare_consultation_results");
      trackSubmitApplication("skincare_routine_assessment");
      setCurrentStep(QUESTIONS.length); // Results screen

      // Dynamically fetch matching in-stock products from Supabase
      setLoadingResults(true);
      try {
        const result = await getMatchedQuizRoutine(updated[0] || "combo", updated[1] || "hydration");
        setMatchedData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingResults(false);
      }
    }
  };

  const handleAddFullRoutine = () => {
    if (!matchedData || matchedData.products.length === 0) return;

    matchedData.products.forEach((prod) => {
      const price = prod.sale_price ?? prod.regular_price;
      addItem(
        {
          id: prod.id,
          product_id: prod.id,
          name: prod.name,
          slug: prod.slug,
          price,
          regular_price: prod.regular_price,
          image_url: prod.image_url,
          brand_name: prod.brand_name,
        },
        1
      );
    });

    setRoutineAdded(true);
    openCart();
  };

  const handleAddSingleItem = (prod: MatchedProduct) => {
    const price = prod.sale_price ?? prod.regular_price;
    addItem(
      {
        id: prod.id,
        product_id: prod.id,
        name: prod.name,
        slug: prod.slug,
        price,
        regular_price: prod.regular_price,
        image_url: prod.image_url,
        brand_name: prod.brand_name,
      },
      1
    );
    openCart();
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setRoutineAdded(false);
    setMatchedData(null);
  };

  // Results Screen
  if (currentStep >= QUESTIONS.length) {
    if (loadingResults || !matchedData) {
      return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-pink-100 text-[#e91e63] animate-pulse">
            <Sparkles className="h-8 w-8 animate-spin" />
          </div>
          <h2 className="text-xl font-black text-gray-900">
            Analyzing Your Skin Profile...
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Matching active formulations against 450+ certified imported cosmetics tailored for Bangladesh weather.
          </p>
        </div>
      );
    }

    const totalRoutinePrice = matchedData.products.reduce(
      (acc, p) => acc + (p.sale_price ?? p.regular_price),
      0
    );

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
        {/* Match Header */}
        <div className="rounded-3xl border border-pink-100 bg-linear-to-br from-pink-50/60 via-white to-pink-50/40 p-8 sm:p-10 shadow-card text-center space-y-3">
          <span className="rounded-full bg-pink-100 text-[#e91e63] px-3.5 py-1 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#e91e63]" />
            100% Dermatologically Matched Routine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {matchedData.routineTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            {matchedData.routineSubtitle}
          </p>
        </div>

        {/* Matched Products Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matchedData.products.map((prod) => {
            const currentPrice = prod.sale_price ?? prod.regular_price;
            const hasDiscount = prod.sale_price && prod.sale_price < prod.regular_price;

            return (
              <div
                key={prod.id}
                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-card space-y-4 flex flex-col justify-between hover:border-[#e91e63] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-pink-50 text-[#e91e63] px-2.5 py-0.5 text-[10px] font-black uppercase">
                      {prod.step_label}
                    </span>
                    {prod.country && (
                      <span className="text-[10px] font-bold text-gray-400">
                        {prod.country}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/products/${prod.slug}`}
                    className="block aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group"
                  >
                    <img
                      src={prod.image_url || "/product_placeholder.svg"}
                      alt={prod.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div>
                    {prod.brand_name && (
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                        {prod.brand_name}
                      </span>
                    )}
                    <Link
                      href={`/products/${prod.slug}`}
                      className="font-bold text-gray-900 text-sm hover:text-[#e91e63] line-clamp-2 transition-colors"
                    >
                      {prod.name}
                    </Link>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {prod.step_description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-gray-900 text-base">
                        {formatPrice(currentPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(prod.regular_price)}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> 100% Genuine
                    </span>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddSingleItem(prod)}
                    className="w-full text-xs font-bold rounded-xl h-8 border-gray-200 hover:border-[#e91e63] hover:text-[#e91e63]"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 mr-1" /> Add this Step Only
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total & 1-Click Buy Strip */}
        <div className="rounded-3xl border border-pink-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs text-gray-500 font-bold">
              Complete Routine Price ({matchedData.products.length} Products):
            </span>
            <div className="text-2xl font-black text-[#e91e63]">
              {formatPrice(totalRoutinePrice)}
            </div>
            {totalRoutinePrice >= 2000 ? (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                Eligible for FREE Express Nationwide Delivery!
              </span>
            ) : (
              <span className="text-xs text-gray-500 block">
                Standard delivery: ৳70 Inside Dhaka / ৳130 Outside
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="text-xs font-bold rounded-xl h-10 px-4"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Retake Quiz
            </Button>

            <Button
              onClick={handleAddFullRoutine}
              className="flex-1 sm:flex-none text-xs font-black rounded-xl h-10 px-6 bg-[#e91e63] hover:bg-sg-pink-hover text-white shadow-md"
            >
              <ShoppingBag className="h-4 w-4 mr-1.5" />
              {routineAdded ? "Routine Added to Bag!" : "Add Complete Routine to Bag"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentStep];

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10 px-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600 font-bold">
          <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-[#e91e63] rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-card space-y-6">
        <div>
          <span className="rounded-full bg-pink-50 text-[#e91e63] px-3 py-1 text-[11px] font-black uppercase">
            Step {currentStep + 1}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
            {q.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {q.subtitle}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {q.options.map((opt) => {
            const isSelected = answers[currentStep] === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelectOption(opt.value)}
                className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "border-[#e91e63] bg-pink-50/50 ring-2 ring-[#e91e63]/20 shadow-xs"
                    : "border-gray-200 bg-white hover:border-[#e91e63]/40 hover:bg-gray-50"
                }`}
              >
                <span className="shrink-0 p-2 rounded-xl bg-pink-50 text-[#e91e63]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="space-y-0.5">
                  <div className="font-bold text-gray-900 text-sm">
                    {opt.label}
                  </div>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Back Button */}
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-bold pt-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Previous Question
          </button>
        )}
      </div>
    </div>
  );
}
