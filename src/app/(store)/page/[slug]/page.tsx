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
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = CMS_PAGES[slug];
  if (!page) return { title: "Page Not Found" };
  return {
    title: `${page.title} — Blush & Budget`,
    description: page.subtitle,
  };
}

export default async function CmsPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = CMS_PAGES[slug];

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

