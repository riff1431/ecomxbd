import { formatPrice } from "@/lib/utils";
import { Receipt, DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export const metadata = {
  title: "Costs & Expenses — Finance",
};

const EXPENSES_LIST = [
  { id: "e1", category: "Freight & Customs", amount: 45000, description: "Air cargo customs clearance from Incheon to Dhaka Airport (DAC)", date: "2026-08-28" },
  { id: "e2", category: "Packaging Materials", amount: 8500, description: "500x Custom branded holographic skincare mailer boxes & bubble wrap", date: "2026-08-25" },
  { id: "e3", category: "SMS Gateway", amount: 1500, description: "10,000 Masked transactional SMS credits (BulkSMSBD)", date: "2026-08-20" },
  { id: "e4", category: "Cloud Infrastructure", amount: 3200, description: "Supabase Pro tier + Cloudinary Media storage", date: "2026-08-01" },
];

export default function AdminFinanceCostsPage() {
  const totalCost = EXPENSES_LIST.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Operational Costs & Expenses</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Track product import freight, custom duty, packaging, SMS gateway, and operational overheads.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Total Expenses (August)</span>
          <p className="text-2xl font-extrabold text-red-600">-{formatPrice(totalCost)}</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Largest Category</span>
          <p className="text-lg font-bold text-text">Freight & Customs (77%)</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Expense Entries</span>
          <p className="text-2xl font-extrabold text-text">{EXPENSES_LIST.length} records</p>
        </div>
      </div>

      {/* Costs Ledger */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border">
          <h2 className="text-base font-bold text-text">Expense Ledger</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {EXPENSES_LIST.map((exp) => (
                <tr key={exp.id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-text">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] text-zinc-800 border border-zinc-200">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{exp.description}</td>
                  <td className="px-4 py-3 text-text-muted">{exp.date}</td>
                  <td className="px-4 py-3 font-extrabold text-red-600 text-right text-sm">
                    -{formatPrice(exp.amount)}
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
