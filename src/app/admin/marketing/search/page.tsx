import { Search, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Search Analytics — Marketing",
};

const TOP_SEARCHES = [
  { query: "cosrx snail essence", count: 342, results: 1, ctr: "64%" },
  { query: "cerave hydrating cleanser", count: 289, results: 1, ctr: "58%" },
  { query: "beauty of joseon sunscreen", count: 215, results: 0, ctr: "0%" },
  { query: "niacinamide serum", count: 184, results: 1, ctr: "42%" },
  { query: "the ordinary salicylic acid", count: 142, results: 0, ctr: "0%" },
  { query: "retinol night cream", count: 98, results: 0, ctr: "0%" },
];

export default function AdminSearchAnalyticsPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Search Analytics & Consumer Demand</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Analyze what skincare enthusiasts are searching for across your storefront and identify unfulfilled product demand.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Total Search Queries</span>
          <p className="text-2xl font-extrabold text-text">1,270</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center">
            <ArrowUpRight className="h-3.5 w-3.5" /> +28% this week
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Search-to-Product CTR</span>
          <p className="text-2xl font-extrabold text-primary-600">54.2%</p>
          <span className="text-[11px] text-text-muted">High intent shoppers</span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Zero-Result Searches</span>
          <p className="text-2xl font-extrabold text-amber-600">38.4%</p>
          <span className="text-[11px] text-amber-700 font-semibold">Stock expansion opportunity</span>
        </div>
      </div>

      {/* Top Searches Table */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border">
          <h2 className="text-base font-bold text-text">Top Storefront Search Terms</h2>
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
              {TOP_SEARCHES.map((item) => (
                <tr key={item.query} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-text flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-primary-600" />
                    {item.query}
                  </td>
                  <td className="px-4 py-3 font-bold text-text">{item.count} searches</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.results > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.results} product(s)
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-text">{item.ctr}</td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {item.results === 0 ? "High demand — Source from Seoul" : "Active stock in inventory"}
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
