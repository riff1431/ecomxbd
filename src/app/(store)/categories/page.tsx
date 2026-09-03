import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Sparkles,
  Droplets,
  Star,
  Shield,
  Sun,
  ChevronRight,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";

export const metadata = {
  title: "All Categories — Blush & Budget",
  description: "Browse beauty and cosmetics by category: Skincare, Haircare, Makeup, Body Care, and Sunscreen.",
};

const CATEGORY_DATA = [
  {
    name: "Skin Care",
    slug: "skin-care",
    desc: "Cleansers, Toners, Serums, Moisturizers & SPF",
    icon: Droplets,
    color: "from-pink-500 to-rose-600",
    subcategories: [
      { name: "Cleansers & Facewash", slug: "skin-care?type=cleanser" },
      { name: "Toners & Mists", slug: "skin-care?type=toner" },
      { name: "Serums & Ampoules", slug: "skin-care?type=serum" },
      { name: "Moisturizers & Creams", slug: "skin-care?type=moisturizer" },
      { name: "Sunscreen & SPF 50", slug: "skin-care?type=sunscreen" },
      { name: "Eye & Lip Treatments", slug: "skin-care?type=eye-lip" },
    ],
  },
  {
    name: "Hair Care",
    slug: "hair-care",
    desc: "Shampoos, Conditioners, Hair Oils & Scalp Care",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
    subcategories: [
      { name: "Shampoos & Cleansers", slug: "hair-care?type=shampoo" },
      { name: "Conditioners & Hair Masks", slug: "hair-care?type=conditioner" },
      { name: "Hair Oils & Serums", slug: "hair-care?type=oil" },
      { name: "Anti-Dandruff Treatments", slug: "hair-care?type=treatment" },
    ],
  },
  {
    name: "Makeup",
    slug: "makeup",
    desc: "Foundations, Lipsticks, Eyeliners & Setting Powders",
    icon: Star,
    color: "from-purple-500 to-indigo-600",
    subcategories: [
      { name: "Foundations & BB Creams", slug: "makeup?type=foundation" },
      { name: "Lipsticks, Tints & Glosses", slug: "makeup?type=lip" },
      { name: "Eyeshadows & Mascaras", slug: "makeup?type=eyes" },
      { name: "Setting Sprays & Powders", slug: "makeup?type=setting" },
    ],
  },
  {
    name: "Body Care",
    slug: "body-care",
    desc: "Body Lotions, Scrubs, Washes & Hand Creams",
    icon: Shield,
    color: "from-teal-500 to-emerald-600",
    subcategories: [
      { name: "Body Lotions & Butters", slug: "body-care?type=lotion" },
      { name: "Body Washes & Shower Gels", slug: "body-care?type=wash" },
      { name: "Scrubs & Exfoliators", slug: "body-care?type=scrub" },
      { name: "Hand & Foot Care", slug: "body-care?type=hand-foot" },
    ],
  },
];

export default async function CategoriesPage() {
  return (
    <div className="container-main py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e91e63]">
          <LayoutGrid className="h-4 w-4" />
          Catalog Directory
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-gray-900">
          Browse Categories
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Explore products curated for your beauty and personal care routine.
        </p>
      </div>

      {/* Categories & Subcategories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORY_DATA.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4 hover:border-pink-200 transition-colors"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-xs`}>
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
                  View All &rarr;
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
