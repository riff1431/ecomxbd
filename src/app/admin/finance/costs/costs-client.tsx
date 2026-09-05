"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Receipt, DollarSign, Plus, Trash2, X, AlertCircle, Tag, Calendar, Layers } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { addExpense, deleteExpense, type ExpenseItem } from "@/features/finance/actions";

const CATEGORIES = [
  "Freight & Customs",
  "Packaging Materials",
  "SMS Gateway",
  "Cloud Infrastructure",
  "Facebook & Meta Ads",
  "Office & Operations",
  "Influencer PR",
  "Other Expenses",
];

interface CostsClientProps {
  initialExpenses: ExpenseItem[];
}

export function CostsClient({ initialExpenses }: CostsClientProps) {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");

  const filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === selectedCategory);

  const totalCost = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Find largest category
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  let largestCatName = "None";
  let largestCatPct = 0;
  const overallTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  if (overallTotal > 0) {
    for (const [cat, sum] of Object.entries(categoryTotals)) {
      if (sum > (categoryTotals[largestCatName] || 0)) {
        largestCatName = cat;
        largestCatPct = Math.round((sum / overallTotal) * 100);
      }
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid expense amount");
      return;
    }
    if (!description.trim()) {
      setError("Please provide an expense description");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const updated = await addExpense({
        category,
        amount: Number(amount),
        description,
        date,
      });
      setExpenses(updated);
      setShowModal(false);
      setDescription("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (err: any) {
      setError(err.message || "Failed to record expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense record?")) return;
    setDeletingId(id);
    try {
      const updated = await deleteExpense(id);
      setExpenses(updated);
    } catch (err: any) {
      alert("Failed to delete expense: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Operational Costs & Expenses</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Track product import freight, custom duty, packaging, SMS gateway, and operational overheads.
          </p>
        </div>

        <Button onClick={() => setShowModal(true)} size="sm" className="shrink-0 text-xs">
          <Plus className="h-4 w-4 mr-1.5" />
          Record New Expense
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Total Operational Expenses</span>
          <p className="text-2xl font-extrabold text-red-600">-{formatPrice(totalCost)}</p>
          <span className="text-[11px] text-text-muted">
            {selectedCategory === "All" ? "Across all categories" : `Filtered: ${selectedCategory}`}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Largest Cost Driver</span>
          <p className="text-lg font-bold text-text">
            {largestCatName} {largestCatPct > 0 ? `(${largestCatPct}%)` : ""}
          </p>
          <span className="text-[11px] text-text-muted">Top spending category</span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Expense Entries</span>
          <p className="text-2xl font-extrabold text-text">{filteredExpenses.length} records</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Live updated in Supabase</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <span className="text-text-muted font-medium shrink-0 flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" /> Filter:
        </span>
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            selectedCategory === "All"
              ? "bg-primary-600 text-white shadow-sm"
              : "bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80 border border-border"
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80 border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Costs Ledger */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-bold text-text">Expense Ledger</h2>
          <span className="text-xs text-text-muted">Showing {filteredExpenses.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted text-xs">
                    No expense records found. Click &quot;Record New Expense&quot; above to add one.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                        <Tag className="h-3 w-3" />
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-text max-w-[340px]">
                      {exp.description}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-text-muted" />
                        {exp.date}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-red-600 whitespace-nowrap">
                      -{formatPrice(exp.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        disabled={deletingId === exp.id}
                        className="text-text-muted hover:text-red-600 transition-colors p-1"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-border animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary-600" />
                Record Operational Expense
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

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="exp-cat">Expense Category</Label>
                <select
                  id="exp-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-text focus:border-primary-500 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="exp-amount">Amount (BDT)</Label>
                <Input
                  id="exp-amount"
                  type="number"
                  placeholder="e.g. 15000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="exp-date">Expense Date</Label>
                <Input
                  id="exp-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="exp-desc">Description & Purpose</Label>
                <textarea
                  id="exp-desc"
                  rows={3}
                  placeholder="e.g. Incheon air cargo freight clearance for 300x Korean skincare serums..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-xs text-text focus:border-primary-500 focus:outline-none resize-none"
                  required
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
                  {submitting ? "Saving..." : "Save Expense"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
