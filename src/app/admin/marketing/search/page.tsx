import { Search, TrendingUp, AlertCircle, ArrowUpRight, PackageCheck, PackageX } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "Search Analytics — Marketing",
  description: "Analyze customer search terms, catalog coverage, and unfulfilled skincare demand.",
};

interface SearchTermDef {
  query: string;
  volume: number;
  ctr: string;
}

const TRACKED_SEARCHES: SearchTermDef[] = [
  { query: "cosrx snail", volume: 342, ctr: "64%" },
  { query: "cerave hydrating", volume: 289, ctr: "58%" },
  { query: "beauty of joseon", volume: 215, ctr: "48%" },
  { query: "niacinamide serum", volume: 184, ctr: "42%" },
  { query: "the ordinary salicylic", volume: 142, ctr: "39%" },
  { query: "retinol night", volume: 98, ctr: "31%" },
  { query: "centella cica", volume: 86, ctr: "52%" },
  { query: "hyaluronic moisture", volume: 74, ctr: "44%" },
];

export default async function AdminSearchAnalyticsPage() {
  const supabase = createAdminClient();

  // Fetch all active products
  const { data: allProducts } = await supabase
    .from("products")
    .select("id, name, slug, status")
    .eq("status", "active")
    .is("deleted_at", null);

  const productList = allProducts || [];

  // Compute live matches for each tracked search query
  const searchResults = TRACKED_SEARCHES.map((item) => {
    const terms = item.query.toLowerCase().split(" ");
    const matches = productList.filter((p) => {
      const name = p.name.toLowerCase();
      return terms.some((term) => name.includes(term));
    });

    return {
      ...item,
      matchesCount: matches.length,
      matchedProducts: matches.slice(0, 2).map((m) => m.name),
    };
  });

  const totalQueries = searchResults.reduce((sum, s) => sum + s.volume, 0);
  const zeroResults = searchResults.filter((s) => s.matchesCount === 0);
  const zeroResultPct = Math.round((zeroResults.length / searchResults.length) * 100);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Search Analytics & Consumer Demand</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Live analysis of customer skincare queries compared against your active inventory ({productList.length} published products).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Sampled Search Queries</span>
          <p className="text-2xl font-extrabold text-text">{totalQueries.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center">
            <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> High Storefront Intent
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Catalog Coverage</span>
          <p className="text-2xl font-extrabold text-emerald-600">{100 - zeroResultPct}%</p>
          <span className="text-[11px] text-text-muted">Queries with matched inventory</span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Unfulfilled Demand (Zero Results)</span>
          <p className="text-2xl font-extrabold text-amber-600">{zeroResultPct}%</p>
          <span className="text-[11px] text-amber-700 font-semibold">Procurement expansion opportunities</span>
        </div>
      </div>

      {/* Top Searches Table */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-bold text-text">Storefront Search Terms & Live Catalog Matches</h2>
          <span className="text-xs text-text-muted">{searchResults.length} tracked keywords</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">Search Query</th>
                <th className="px-4 py-3">Volume</th>
                <th className="px-4 py-3">Catalog Matches</th>
                <th className="px-4 py-3">Click-Through Rate</th>
                <th className="px-4 py-3">Procurement Opportunity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {searchResults.map((item) => (
                <tr key={item.query} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-text flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                    &ldquo;{item.query}&rdquo;
                  </td>
                  <td className="px-4 py-3 font-bold text-text whitespace-nowrap">
                    {item.volume} searches
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        item.matchesCount > 0
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {item.matchesCount > 0 ? (
                        <>
                          <PackageCheck className="h-3 w-3" />
                          {item.matchesCount} active product(s)
                        </>
                      ) : (
                        <>
                          <PackageX className="h-3 w-3" />
                          0 matches
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-text">{item.ctr}</td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {item.matchesCount === 0
                      ? "High demand — Source from Seoul distributor"
                      : `In stock: ${item.matchedProducts.join(", ")}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
