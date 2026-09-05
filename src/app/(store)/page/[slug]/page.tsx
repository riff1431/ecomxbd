import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { CmsPageClient } from "./cms-page-client";

const CMS_PAGES: Record<
  string,
  { title: string; subtitle: string; lastUpdated: string; content: React.ReactNode }
> = {
  about: {
    title: "About Blush & Budget",
    subtitle: "Your Trusted Gateway to 100% Authentic Global Skincare & Cosmetics",
    lastUpdated: "August 2026",
    content: (
      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <p>
          Founded in Dhaka, <strong>Blush &amp; Budget</strong> was born out of a simple mission: to make premium, original, and certified skincare from South Korea, the United Kingdom, and the United States readily accessible to beauty enthusiasts across all 64 districts of Bangladesh.
        </p>
        <h3 className="text-lg font-bold text-text pt-2">Direct Authorized Procurement</h3>
        <p>
          Every single serum, cleanser, sunscreen, and moisturizer in our inventory is directly procured from authorized international distributors in Seoul, London, and Dubai. We eliminate intermediaries to guarantee pristine product authenticity and the freshest batch production dates.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h4 className="font-bold text-text text-base">100% Original</h4>
            <p className="text-xs text-text-muted mt-1">Guaranteed authentic or 3x money back refund.</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h4 className="font-bold text-text text-base">Fast 24-48h Delivery</h4>
            <p className="text-xs text-text-muted mt-1">Doorstep delivery across Dhaka &amp; nationwide express.</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h4 className="font-bold text-text text-base">Cash on Delivery</h4>
            <p className="text-xs text-text-muted mt-1">Inspect your parcel at doorstep before making payment.</p>
          </div>
        </div>
      </div>
    ),
  },
  authenticity: {
    title: "100% Authenticity Guarantee",
    subtitle: "Our Triple-Check Verification Standard for Cosmetics in Bangladesh",
    lastUpdated: "August 2026",
    content: (
      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 flex items-start gap-4">
          <ShieldCheck className="h-8 w-8 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-emerald-800 text-base">Our Zero-Counterfeit Commitment</h3>
            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
              We understand the damage counterfeit skincare can cause. We source directly from official brand partners like COSRX Korea, CeraVe UK, and The Ordinary. If any product is proven non-authentic, we provide a 300% refund immediately.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-text pt-2">How to Verify Your Product:</h3>
        <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
          <li><strong>Batch Code Verification:</strong> Every box includes an embossed batch code verifiable on CheckFresh.com.</li>
          <li><strong>HiddenTag / QR Seals:</strong> Korean products feature genuine brand holographic authentication stickers.</li>
          <li><strong>Sealed Packaging:</strong> Untampered hygiene foil seals on every bottle and tube.</li>
        </ul>
      </div>
    ),
  },
  returns: {
    title: "7-Day Return & Replacement Policy",
    subtitle: "Hassle-Free Returns with Instant Doorstep Pickup",
    lastUpdated: "August 2026",
    content: (
      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <p>
          At Blush &amp; Budget, your skin health and satisfaction come first. If you received a damaged item, incorrect shade/variant, or defective pump, we offer a <strong>7-day replacement guarantee</strong>.
        </p>
        <h3 className="text-lg font-bold text-text pt-2">Eligibility for Return</h3>
        <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
          <li>Item must be unused, unwashed, and in original brand packaging with all tags attached.</li>
          <li>Report within 7 days of delivery with parcel unboxing video.</li>
          <li>Our courier partner will pick up the parcel directly from your address at zero extra cost.</li>
        </ul>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "How We Protect Your Personal Information",
    lastUpdated: "August 2026",
    content: (
      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>
          We respect your privacy. Your name, phone number, delivery address, and order details are strictly used to fulfill your deliveries via SteadFast/Pathao and send delivery tracking notifications.
        </p>
        <p>
          We never sell, rent, or trade customer contact details with third-party advertising brokers.
        </p>
      </div>
    ),
  },
  terms: {
    title: "Terms & Conditions",
    subtitle: "Shopping and Service Agreement",
    lastUpdated: "August 2026",
    content: (
      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>
          By placing an order on Blush &amp; Budget, you agree to inspect your parcel upon doorstep delivery and remit the agreed Cash on Delivery amount to the delivery rider.
        </p>
        <p>
          All pricing is listed in Bangladeshi Taka (BDT ৳) inclusive of applicable taxes.
        </p>
      </div>
    ),
  },
  faq: {
    title: "Frequently Asked Questions (FAQ)",
    subtitle: "Quick Answers on Orders, Authenticity, Delivery & Returns",
    lastUpdated: "August 2026",
    content: (
      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <h4 className="font-bold text-text text-base">১. আপনাদের প্রোডাক্ট কি ১০০% আসল ও অরিজিনাল?</h4>
          <p className="text-xs text-text-muted mt-2 leading-relaxed">
            হ্যাঁ, আমাদের প্রতিটি প্রোডাক্ট সরাসরি ব্র্যান্ড বা অনুমোদিত আন্তর্জাতিক ডিস্ট্রিবিউটর (কোরিয়া, ইউকে, ইউএসএ) থেকে আমদানি করা। নকল প্রমাণিত হলে ৩০০% মানিব্যাক গ্যারান্টি।
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <h4 className="font-bold text-text text-base">২. ডেলিভারি পেতে কত সময় লাগে?</h4>
          <p className="text-xs text-text-muted mt-2 leading-relaxed">
            ঢাকা সিটির ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ৩ থেকে ৫ কার্যদিবসের মধ্যে SteadFast / Pathao কুরিয়ারের মাধ্যমে ডেলিভারি সম্পন্ন করা হয়।
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <h4 className="font-bold text-text text-base">৩. ডেলিভারির সময় কি চেক করে নেওয়া যাবে?</h4>
          <p className="text-xs text-text-muted mt-2 leading-relaxed">
            অবশ্যই! ক্যাশ অন ডেলিভারিতে রাইডারের সামনে পার্সেলটি চেক করে মূল্য পরিশোধ করতে পারবেন।
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <h4 className="font-bold text-text text-base">৪. সমস্যা হলে রিটার্ন বা পরিবর্তন কীভাবে করব?</h4>
          <p className="text-xs text-text-muted mt-2 leading-relaxed">
            ডেলিভারি পাওয়ার ৭ দিনের মধ্যে আমাদের সাপোর্ট নম্বরে (+880 1700-000000) অথবা ফেসবুক পেজে আনবক্সিং ভিডিও সহ মেসেজ দিন। আমাদের কুরিয়ার প্রতিনিধি সরাসরি আপনার বাসা থেকে পার্সেলটি পিকআপ করে নিবেন।
          </p>
        </div>
      </div>
    ),
  },
  contact: {
    title: "Contact & Customer Care",
    subtitle: "We are here to assist you 7 days a week",
    lastUpdated: "August 2026",
    content: (
      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-white p-5 text-center shadow-xs">
            <h4 className="font-bold text-text text-base">Hotline</h4>
            <p className="text-xs text-text-muted mt-1">+880 1700-000000</p>
            <p className="text-[11px] text-text-muted mt-0.5">10:00 AM - 10:00 PM</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 text-center shadow-xs">
            <h4 className="font-bold text-text text-base">Email Support</h4>
            <p className="text-xs text-text-muted mt-1">support@example.com</p>
            <p className="text-[11px] text-text-muted mt-0.5">Response within 2 hours</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 text-center shadow-xs">
            <h4 className="font-bold text-text text-base">Headquarters</h4>
            <p className="text-xs text-text-muted mt-1">Gulshan, Dhaka, Bangladesh</p>
            <p className="text-[11px] text-text-muted mt-0.5">Nationwide Express Delivery</p>
          </div>
        </div>
      </div>
    ),
  },
};

// Aliases mapping so alternate slugs like return-policy, privacy-policy, terms-and-conditions all resolve
const SLUG_ALIASES: Record<string, string> = {
  "return-policy": "returns",
  "returns-policy": "returns",
  "privacy-policy": "privacy",
  "terms-and-conditions": "terms",
  "terms-conditions": "terms",
  "about-us": "about",
  "help": "faq",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = SLUG_ALIASES[slug] || slug;
  const page = CMS_PAGES[resolvedSlug];
  if (!page) return { title: "Page Not Found" };
  return {
    title: `${page.title} — Blush & Budget`,
    description: page.subtitle,
  };
}

export default async function CmsPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = SLUG_ALIASES[slug] || slug;
  const page = CMS_PAGES[resolvedSlug];

  if (!page) {
    notFound();
  }

  return (
    <CmsPageClient
      slug={slug}
      title={page.title}
      subtitle={page.subtitle}
      lastUpdated={page.lastUpdated}
    >
      {page.content}
    </CmsPageClient>
  );
}

