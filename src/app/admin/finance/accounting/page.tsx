import { formatPrice } from "@/lib/utils";
import { Landmark, Wallet, ArrowDownRight, ArrowUpRight, Scale } from "lucide-react";

export const metadata = {
  title: "Accounting & Balances — Finance",
};

const ACCOUNTS = [
  { name: "BRAC Bank (Corporate Account)", type: "Asset (Bank)", balance: 485000, accountNo: "1501-XXXX-XXXX-001" },
  { name: "The City Bank (Merchant Account)", type: "Asset (Bank)", balance: 210000, accountNo: "1102-XXXX-XXXX-002" },
  { name: "bKash Merchant Wallet", type: "Asset (MFS)", balance: 65400, accountNo: "017XXXXXXXX" },
  { name: "SteadFast Courier COD Receivable", type: "Asset (Receivable)", balance: 45200, accountNo: "SF-M-8823" },
  { name: "Seoul Wholesale Supplier Payable", type: "Liability (Payable)", balance: -120000, accountNo: "SUP-KR-01" },
];

export default function AdminFinanceAccountingPage() {
  const totalAssets = ACCOUNTS.filter((a) => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = Math.abs(
    ACCOUNTS.filter((a) => a.balance < 0).reduce((sum, a) => sum + a.balance, 0)
  );
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Chart of Accounts & Liquid Balances</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Live overview of corporate bank balances, mobile wallets (bKash/Nagad), COD receivables, and supplier liabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Total Liquid Assets</span>
          <p className="text-2xl font-extrabold text-text">{formatPrice(totalAssets)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center">
            <ArrowUpRight className="h-3.5 w-3.5" /> 4 Active Asset Accounts
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Outstanding Payables</span>
          <p className="text-2xl font-extrabold text-red-600">-{formatPrice(totalLiabilities)}</p>
          <span className="text-[11px] text-text-muted">Supplier procurement balances</span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Net Working Capital</span>
          <p className="text-2xl font-extrabold text-emerald-700">{formatPrice(netWorth)}</p>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
            Positive Cash Flow
          </span>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border">
          <h2 className="text-base font-bold text-text">Account Balances Ledger</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">Account Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Identifier / Ref</th>
                <th className="px-4 py-3 text-right">Balance (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ACCOUNTS.map((acc) => (
                <tr key={acc.name} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-text flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary-600" />
                    {acc.name}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{acc.type}</td>
                  <td className="px-4 py-3 font-mono text-text-muted">{acc.accountNo}</td>
                  <td
                    className={`px-4 py-3 font-extrabold text-right text-sm ${
                      acc.balance >= 0 ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {acc.balance >= 0 ? formatPrice(acc.balance) : `-${formatPrice(Math.abs(acc.balance))}`}
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
