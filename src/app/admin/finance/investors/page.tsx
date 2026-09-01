import { formatPrice } from "@/lib/utils";
import { UserCheck, DollarSign, Percent, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Investors & Equity — Finance",
};

const INVESTORS = [
  {
    name: "Rahim Chowdhury",
    equity: "35.0%",
    capital: 2500000,
    profitDistributed: 185000,
    contact: "+880 1819-112233",
    status: "Active Stakeholder",
  },
  {
    name: "Tanzim Hasan",
    equity: "15.0%",
    capital: 1000000,
    profitDistributed: 78000,
    contact: "+880 1711-445566",
    status: "Active Stakeholder",
  },
];

export default function AdminFinanceInvestorsPage() {
  const totalCapital = INVESTORS.reduce((sum, inv) => sum + inv.capital, 0);
  const totalProfit = INVESTORS.reduce((sum, inv) => sum + inv.profitDistributed, 0);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Investors & Equity Shareholding</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Manage seed capital contributions, equity ownership percentages, and quarterly profit distributions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Total Paid-in Capital</span>
          <p className="text-2xl font-extrabold text-text">{formatPrice(totalCapital)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center">
            <ArrowUpRight className="h-3.5 w-3.5" /> 50% External Equity
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Total Profit Shared</span>
          <p className="text-2xl font-extrabold text-primary-600">{formatPrice(totalProfit)}</p>
          <span className="text-[11px] text-text-muted">Lifetime distributions</span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Cap Table</span>
          <p className="text-2xl font-extrabold text-text">{INVESTORS.length} Stakeholders</p>
          <span className="text-[11px] text-emerald-700 font-semibold">100% Fully Vested</span>
        </div>
      </div>

      {/* Investors Table */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border">
          <h2 className="text-base font-bold text-text">Stakeholder Ownership Ledger</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">Stakeholder</th>
                <th className="px-4 py-3">Equity Share</th>
                <th className="px-4 py-3">Capital Contribution</th>
                <th className="px-4 py-3">Profit Distributed</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INVESTORS.map((inv) => (
                <tr key={inv.name} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-text flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary-600" />
                    {inv.name}
                  </td>
                  <td className="px-4 py-3 font-extrabold text-primary-700">{inv.equity}</td>
                  <td className="px-4 py-3 font-bold text-text">{formatPrice(inv.capital)}</td>
                  <td className="px-4 py-3 text-emerald-600 font-semibold">
                    {formatPrice(inv.profitDistributed)}
                  </td>
                  <td className="px-4 py-3 font-mono text-text-muted">{inv.contact}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold uppercase border border-emerald-200">
                      {inv.status}
                    </span>
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
