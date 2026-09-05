"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Landmark, Wallet, ArrowDownRight, ArrowUpRight, Scale, Plus, Edit2, Trash2, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { saveAccount, deleteAccount, type AccountItem } from "@/features/finance/actions";

const ACCOUNT_TYPES = [
  "Asset (Bank)",
  "Asset (MFS)",
  "Asset (Receivable)",
  "Liability (Payable)",
  "Equity / Capital",
];

interface AccountingClientProps {
  initialAccounts: AccountItem[];
}

export function AccountingClient({ initialAccounts }: AccountingClientProps) {
  const [accounts, setAccounts] = useState<AccountItem[]>(initialAccounts);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState(ACCOUNT_TYPES[0]);
  const [balance, setBalance] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [error, setError] = useState("");

  const totalAssets = accounts
    .filter((a) => a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = Math.abs(
    accounts
      .filter((a) => a.balance < 0)
      .reduce((sum, a) => sum + a.balance, 0)
  );

  const netWorth = totalAssets - totalLiabilities;

  const openAddModal = () => {
    setEditingAccount(null);
    setName("");
    setType(ACCOUNT_TYPES[0]);
    setBalance("");
    setAccountNo("");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (acc: AccountItem) => {
    setEditingAccount(acc);
    setName(acc.name);
    setType(acc.type);
    setBalance(String(acc.balance));
    setAccountNo(acc.accountNo);
    setError("");
    setShowModal(true);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter an account name");
      return;
    }
    if (balance === "" || isNaN(Number(balance))) {
      setError("Please enter a valid numeric balance");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const updated = await saveAccount({
        id: editingAccount?.id,
        name,
        type,
        balance: Number(balance),
        accountNo: accountNo || "N/A",
      });
      setAccounts(updated);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to save account");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm("Are you sure you want to remove this financial account?")) return;
    setDeletingId(id);
    try {
      const updated = await deleteAccount(id);
      setAccounts(updated);
    } catch (err: any) {
      alert("Failed to delete account: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Chart of Accounts & Liquid Balances</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Live overview of corporate bank balances, mobile wallets (bKash/Nagad), COD receivables, and supplier liabilities.
          </p>
        </div>

        <Button onClick={openAddModal} size="sm" className="shrink-0 text-xs">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Account / Balance
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Total Liquid Assets</span>
          <p className="text-2xl font-extrabold text-text">{formatPrice(totalAssets)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center">
            <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
            {accounts.filter((a) => a.balance > 0).length} Active Asset Accounts
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Outstanding Payables</span>
          <p className="text-2xl font-extrabold text-red-600">-{formatPrice(totalLiabilities)}</p>
          <span className="text-[11px] text-text-muted">Supplier procurement balances</span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Net Working Capital</span>
          <p
            className={`text-2xl font-extrabold ${
              netWorth >= 0 ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {formatPrice(netWorth)}
          </p>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded border inline-block ${
              netWorth >= 0
                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                : "text-red-700 bg-red-50 border-red-200"
            }`}
          >
            {netWorth >= 0 ? "Positive Cash Flow" : "Working Capital Deficit"}
          </span>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-bold text-text">Account Balances Ledger</h2>
          <span className="text-xs text-text-muted">{accounts.length} active ledger records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">Account Entity</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Account / Ref Number</th>
                <th className="px-4 py-3 text-right">Current Balance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted text-xs">
                    No accounts registered yet.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-text flex items-center gap-2">
                      <Landmark className="h-4 w-4 text-primary-600 shrink-0" />
                      {acc.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          acc.type.includes("Liability") || acc.balance < 0
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {acc.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary font-mono text-[11px]">
                      {acc.accountNo}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-extrabold text-sm whitespace-nowrap ${
                        acc.balance >= 0 ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {acc.balance >= 0 ? formatPrice(acc.balance) : `-${formatPrice(Math.abs(acc.balance))}`}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => openEditModal(acc)}
                        className="text-text-muted hover:text-primary-600 transition-colors p-1"
                        title="Edit Account or Balance"
                      >
                        <Edit2 className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(acc.id)}
                        disabled={deletingId === acc.id}
                        className="text-text-muted hover:text-red-600 transition-colors p-1"
                        title="Delete account"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Account Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-border animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <Landmark className="h-4 w-4 text-primary-600" />
                {editingAccount ? "Edit Account / Update Balance" : "Register Financial Account"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-muted hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="acc-name">Account Title / Entity Name</Label>
                <Input
                  id="acc-name"
                  placeholder="e.g. BRAC Bank Corporate or bKash Merchant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="acc-type">Account Classification</Label>
                <select
                  id="acc-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-text focus:border-primary-500 focus:outline-none"
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="acc-balance">Current Balance (BDT)</Label>
                <Input
                  id="acc-balance"
                  type="number"
                  placeholder="Positive for asset, negative for payable (e.g. 50000 or -20000)"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  required
                />
                <p className="text-[10px] text-text-muted">
                  Use positive numbers for liquid funds or receivables. Use negative numbers for debts or supplier payables.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="acc-no">Account Number / Masked Reference</Label>
                <Input
                  id="acc-no"
                  placeholder="e.g. 1501-XXXX-XXXX-001 or SF-M-8823"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
