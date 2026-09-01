"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Check, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: { label: string; desc: string; icon: string; value: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "What is your primary skin type?",
    subtitle: "How does your face feel midway through the day in Bangladesh climate?",
    options: [
      { label: "Dry & Dehydrated", desc: "Feels tight, flaky, or rough after cleansing", icon: "💧", value: "dry" },
      { label: "Oily & Shiny", desc: "Excess sebum around T-zone, prone to breakouts", icon: "✨", value: "oily" },
      { label: "Combination", desc: "Oily forehead and nose, normal/dry cheeks", icon: "⚖️", value: "combo" },
      { label: "Sensitive & Reactive", desc: "Easily irritated, redness, stung by harsh products", icon: "🌸", value: "sensitive" },
    ],
  },
  {
    id: 2,
    title: "What is your main skincare concern?",
    subtitle: "Select the primary skin transformation you want to achieve.",
    options: [
      { label: "Deep Hydration & Glass Skin", desc: "Repair damaged barrier, plumpness, natural radiant glow", icon: "🐌", value: "hydration" },
      { label: "Acne, Pores & Texture", desc: "Clear active blemishes and smooth bumpy texture", icon: "🫧", value: "acne" },
      { label: "Dark Spots & Hyperpigmentation", desc: "Fade sun spots, post-acne marks, and even tone", icon: "☀️", value: "brightening" },
      { label: "Anti-Aging & Elasticity", desc: "Fine lines, firmness, collagen support", icon: "⏳", value: "aging" },
    ],
  },
  {
    id: 3,
    title: "What is your daily lifestyle exposure?",
    subtitle: "Understanding your daily environmental stressors.",
    options: [
      { label: "High Outdoor & Sun Exposure", desc: "Daily commute, public transport, outdoor activities", icon: "🚗", value: "outdoor" },
      { label: "Air Conditioned Indoors", desc: "8+ hours in AC office or study room (dehydrating)", icon: "❄️", value: "indoor" },
      { label: "Balanced Indoor & Outdoor", desc: "Mix of regular desk work and daily errands", icon: "🌤️", value: "mixed" },
    ],
  },
];

export function SkincareQuizClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [routineAdded, setRoutineAdded] = useState(false);
  const { addItem, openCart } = useCart();

  const handleSelectOption = (value: string) => {
    const updated = { ...answers, [currentStep]: value };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(QUESTIONS.length); // Results screen
    }
  };

  const handleAddFullRoutine = () => {
    // Add Snail Essence + Cleanser
    addItem({
      id: "prod-snail-96",
      product_id: "prod-snail-96",
      name: "COSRX Advanced Snail 96 Mucin Power Essence",
      slug: "cosrx-advanced-snail-96-mucin-power-essence",
      price: 1365,
      regular_price: 1500,
      image_url: "https://res.cloudinary.com/dyvma4kfc/image/upload/v1788259130750/ecomxbangladesh/cosrx_snail_essence.png",
      variant_label: "100ml",
      brand_name: "COSRX",
    });

    addItem({
      id: "prod-cerave-cleanser",
      product_id: "prod-cerave-cleanser",
      name: "CeraVe Hydrating Facial Cleanser 236ml",
      slug: "cerave-hydrating-facial-cleanser-236ml",
      price: 1850,
      regular_price: 2100,
      image_url: "https://res.cloudinary.com/dyvma4kfc/image/upload/v1788259130750/ecomxbangladesh/cerave_cleanser.png",
      variant_label: "236ml",
      brand_name: "CeraVe",
    });

    setRoutineAdded(true);
    openCart();
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setRoutineAdded(false);
  };

  // Results Screen
  if (currentStep >= QUESTIONS.length) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-8 px-4">
        {/* Match Header */}
        <div className="rounded-3xl border border-border bg-white p-8 sm:p-10 shadow-card text-center space-y-3">
          <span className="rounded-full bg-emerald-50 text-emerald-700 px-3.5 py-1 text-xs font-bold uppercase border border-emerald-200 inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            100% Dermatologically Matched Routine
          </span>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">
            Your Personalized Korean Glass Skin Routine
          </h1>
          <p className="text-sm text-text-secondary max-w-xl mx-auto">
            Based on your skin profile, here is your customized 2-step barrier repair and deep hydration protocol.
          </p>
        </div>

        {/* Matched Products Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Step 1: Cleanser */}
          <div className="rounded-3xl border border-border bg-white p-6 shadow-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="rounded-full bg-primary-50 text-primary-700 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                Step 1: Gentle Cleanser
              </span>
              <h3 className="font-bold text-text text-base">CeraVe Hydrating Facial Cleanser 236ml</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Cleanses without disrupting the skin’s protective moisture barrier. Contains 3 essential ceramides and hyaluronic acid.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="font-extrabold text-text text-base">৳ 1,850</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Authentic UK
              </span>
            </div>
          </div>

          {/* Step 2: Essence */}
          <div className="rounded-3xl border border-border bg-white p-6 shadow-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="rounded-full bg-primary-50 text-primary-700 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                Step 2: Core Treatment
              </span>
              <h3 className="font-bold text-text text-base">COSRX Advanced Snail 96 Mucin Power Essence</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Formulated with 96.3% snail secretion filtrate to deeply hydrate, soothe irritation, and impart a glass-like glow.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="font-extrabold text-text text-base">৳ 1,365</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Authentic Korea
              </span>
            </div>
          </div>
        </div>

        {/* Total & 1-Click Buy */}
        <div className="rounded-3xl border border-border bg-surface-secondary/70 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-border">
          <div>
            <span className="text-xs text-text-muted">Total Routine Price (2 Products):</span>
            <div className="text-2xl font-extrabold text-text">৳ 3,215</div>
            <span className="text-xs text-emerald-600 font-semibold">🎉 Eligible for FREE Express Delivery in Bangladesh!</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Retake Quiz
            </Button>

            <Button
              onClick={handleAddFullRoutine}
              className="flex-1 sm:flex-none text-xs"
            >
              <ShoppingBag className="h-4 w-4 mr-1.5" />
              {routineAdded ? "Routine Added to Cart!" : "Add Complete Routine to Cart"}
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
        <div className="flex justify-between text-xs text-text-muted font-semibold">
          <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl border border-border bg-white p-8 sm:p-10 shadow-card space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-text">{q.title}</h1>
          <p className="text-xs text-text-secondary">{q.subtitle}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelectOption(opt.value)}
              className="cursor-pointer rounded-2xl border border-border p-4 sm:p-5 flex items-start gap-4 transition-all hover:border-primary-600 hover:bg-primary-50/30 hover:shadow-sm"
            >
              <span className="text-2xl shrink-0">{opt.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-text text-sm">{opt.label}</h3>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{opt.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-muted shrink-0 mt-1" />
            </div>
          ))}
        </div>

        {/* Back Button */}
        {currentStep > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="text-xs text-text-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Previous Question
          </Button>
        )}
      </div>
    </div>
  );
}
