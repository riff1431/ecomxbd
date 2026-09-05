"use client";

import Link from "next/link";
import {
  Sparkles,
  Droplets,
  Star,
  Shield,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function CategoriesClient() {
  const { language, t } = useLanguage();

  const categories = [
    {
      name: language === "bn" ? "স্কিন কেয়ার" : "Skin Care",
      slug: "skin-care",
      desc: language === "bn" ? "ক্লিনজার, টোনার, সিরাম, ময়েশ্চারাইজার ও সানস্ক্রিন" : "Cleansers, Toners, Serums, Moisturizers & SPF",
      icon: Droplets,
      color: "from-pink-500 to-rose-600",
      subcategories: [
        { name: language === "bn" ? "ক্লিনজার ও ফেসওয়াশ" : "Cleansers & Facewash", slug: "skin-care?type=cleanser" },
        { name: language === "bn" ? "টোনার ও মিস্ট" : "Toners & Mists", slug: "skin-care?type=toner" },
        { name: language === "bn" ? "সিরাম ও অ্যাম্পুল" : "Serums & Ampoules", slug: "skin-care?type=serum" },
        { name: language === "bn" ? "ময়েশ্চারাইজার ও ক্রিম" : "Moisturizers & Creams", slug: "skin-care?type=moisturizer" },
        { name: language === "bn" ? "সানস্ক্রিন ও সানব্লক" : "Sunscreen & SPF 50", slug: "skin-care?type=sunscreen" },
        { name: language === "bn" ? "আই ও লিপ কেয়ার" : "Eye & Lip Treatments", slug: "skin-care?type=eye-lip" },
      ],
    },
    {
      name: language === "bn" ? "হেয়ার কেয়ার" : "Hair Care",
      slug: "hair-care",
      desc: language === "bn" ? "শ্যাম্পু, কন্ডিশনার, হেয়ার অয়েল ও স্ক্যাল্প কেয়ার" : "Shampoos, Conditioners, Hair Oils & Scalp Care",
      icon: Sparkles,
      color: "from-amber-500 to-orange-600",
      subcategories: [
        { name: language === "bn" ? "শ্যাম্পু ও ক্লিনজার" : "Shampoos & Cleansers", slug: "hair-care?type=shampoo" },
        { name: language === "bn" ? "কন্ডিশনার ও হেয়ার মাস্ক" : "Conditioners & Hair Masks", slug: "hair-care?type=conditioner" },
        { name: language === "bn" ? "হেয়ার অয়েল ও সিরাম" : "Hair Oils & Serums", slug: "hair-care?type=oil" },
        { name: language === "bn" ? "অ্যান্টি-ড্যান্ড্রাফ চিকিৎসা" : "Anti-Dandruff Treatments", slug: "hair-care?type=treatment" },
      ],
    },
    {
      name: language === "bn" ? "মেকআপ" : "Makeup",
      slug: "makeup",
      desc: language === "bn" ? "ফাউন্ডেশন, লিপস্টিক, আইলাইনার ও সেটিং পাউডার" : "Foundations, Lipsticks, Eyeliners & Setting Powders",
      icon: Star,
      color: "from-purple-500 to-indigo-600",
      subcategories: [
        { name: language === "bn" ? "ফাউন্ডেশন ও বিবি ক্রিম" : "Foundations & BB Creams", slug: "makeup?type=foundation" },
        { name: language === "bn" ? "লিপস্টিক, লিপটিন্ট ও গ্লস" : "Lipsticks, Tints & Glosses", slug: "makeup?type=lip" },
        { name: language === "bn" ? "আইশ্যাডো ও মাশকারা" : "Eyeshadows & Mascaras", slug: "makeup?type=eyes" },
        { name: language === "bn" ? "সেটিং স্প্রে ও পাউডার" : "Setting Sprays & Powders", slug: "makeup?type=setting" },
      ],
    },
    {
      name: language === "bn" ? "বডি কেয়ার" : "Body Care",
      slug: "body-care",
      desc: language === "bn" ? "বডি লোশন, স্ক্রাব, বডিওয়াশ ও হ্যান্ড ক্রিম" : "Body Lotions, Scrubs, Washes & Hand Creams",
      icon: Shield,
      color: "from-teal-500 to-emerald-600",
      subcategories: [
        { name: language === "bn" ? "বডি লোশন ও বাটার" : "Body Lotions & Butters", slug: "body-care?type=lotion" },
        { name: language === "bn" ? "বডি ওয়াশ ও শাওয়ার জেল" : "Body Washes & Shower Gels", slug: "body-care?type=wash" },
        { name: language === "bn" ? "বডি স্ক্রাব ও এক্সফোলিয়েটর" : "Scrubs & Exfoliators", slug: "body-care?type=scrub" },
        { name: language === "bn" ? "হ্যান্ড ও ফুট কেয়ার" : "Hand & Foot Care", slug: "body-care?type=hand-foot" },
      ],
    },
  ];

  return (
    <div className="container-main py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e91e63]">
          <LayoutGrid className="h-4 w-4" />
          {language === "bn" ? "ক্যাটালগ ডিরেক্টরি" : "Catalog Directory"}
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-gray-900">
          {t("brandsAndCategories", "allCategories")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          {t("brandsAndCategories", "exploreCategories")}
        </p>
      </div>

      {/* Categories & Subcategories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4 hover:border-pink-200 transition-colors"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${cat.color} text-white shadow-xs`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-900">{cat.name}</h2>
                    <p className="text-[11px] text-gray-500">{cat.desc}</p>
                  </div>
                </div>

                <Link
                  href={`/products?category=${cat.slug}`}
                  className="text-xs font-bold text-[#e91e63] hover:underline flex items-center gap-0.5"
                >
                  {language === "bn" ? "সব দেখুন →" : "View All →"}
                </Link>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                {cat.subcategories.map((sub) => (
                  <Link
                    key={sub.name}
                    href={`/products?category=${sub.slug}`}
                    className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-xs font-semibold text-gray-800 hover:bg-pink-50 hover:text-[#e91e63] transition-colors"
                  >
                    <span className="truncate">{sub.name}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
