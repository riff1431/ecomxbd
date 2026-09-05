"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Clock, Plus, DollarSign, Trash2, X, AlertCircle, Building2, Truck } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { addDue, settleDue, deleteDue, type DueItem } from "@/features/finance/actions";

interface DuesClientProps {
  initialDues: DueItem[];
}

export function DuesClient({ initialDues }: DuesClientProps) {
  const [dues, setDues] = useState<DueItem[]>(initialDues);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [settlingItem, setSettlingItem] = useState<DueItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Add form states
  const [entity, setEntity] = useState("");
  const [type, setType] = useState("Receivable (COD)");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Settle form states
  const [paymentAmount, setPaymentAmount] = useState("");
  const [settlementNote, setSettlementNote] = useState("");

  const filteredDues =
    statusFilter === "all" ? dues : dues.filter((d) => d.status === statusFilter);

  const totalReceivablesDue = dues
    .filter((d) => d.type.includes("Receivable") && d.status !== "settled")
    .reduce((sum, d) => sum + (d.amount - d.paid), 0);

  const totalPayablesDue = dues
    .filter((d) => d.type.includes("Payable") && d.status !== "settled")
    .reduce((sum, d) => sum + (d.amount - d.paid), 0);

  const totalSettled = dues
    .filter((d) => d.status === "settled")
    .reduce((sum, d) => sum + d.amount, 0);

  const handleAddDue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entity.trim()) {
      setError("Please provide an entity / vendor name");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const updated = await addDue({
        entity,
        type,
        amount: Number(amount),
        dueDate,
        notes,
      });
      setDues(updated);
      setShowAddModal(false);
      setEntity("");
      setAmount("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Failed to create due entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSettleDue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingItem) return;
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      setError("Please enter a valid payment amount");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const updated = await settleDue(
        settlingItem.id,
        Number(paymentAmount),
        settlementNote
      );
      setDues(updated);
      setSettlingItem(null);
      setPaymentAmount("");
      setSettlementNote("");
    } catch (err: any) {
      setError(err.message || "Failed to record settlement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDue = async (id: string) => {
    if (!confirm("Are you sure you want to remove this due record?")) return;
    setDeletingId(id);
    try {
      const updated = await deleteDue(id);
      setDues(updated);
    } catch (err: any) {
      alert("Failed to delete record: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Dues & Settlements Manager</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Track pending Cash on Delivery remittances from courier partners and upcoming supplier payments.
          </p>
        </div>

        <Button onClick={() => setShowAddModal(true)} size="sm" className="shrink-0 text-xs">
          <Plus className="h-4 w-4 mr-1.5" />
          Record New Due / Remittance
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Pending Courier COD</span>
          <p className="text-2xl font-extrabold text-emerald-700">+{formatPrice(totalReceivablesDue)}</p>
          <span className="text-[11px] text-text-muted">Unremitted funds from deliveries</span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Supplier Payables Due</span>
          <p className="text-2xl font-extrabold text-red-600">-{formatPrice(totalPayablesDue)}</p>
          <span className="text-[11px] text-text-muted">Pending overseas procurement</span>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-2">
          <span className="text-xs text-text-muted font-medium">Fully Settled Volume</span>
          <p className="text-2xl font-extrabold text-text">{formatPrice(totalSettled)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Cleared obligations</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border pb-2 text-xs">
        {["all", "due", "partial", "settled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-colors ${
              statusFilter === status
                ? "bg-primary-600 text-white shadow-sm"
                : "text-text-muted hover:text-text hover:bg-surface-secondary"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Dues Table */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-bold text-text">Active Dues & Remittances</h2>
          <span className="text-xs text-text-muted">{filteredDues.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">Party / Entity</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Settled</th>
                <th className="px-4 py-3">Due Balance</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-text-muted text-xs">
                    No records found for this filter.
                  </td>
                </tr>
              ) : (
                filteredDues.map((due) => {
                  const balanceDue = due.amount - due.paid;
                  return (
                    <tr key={due.id} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-text flex items-center gap-1.5">
                          {due.type.includes("COD") ? (
                            <Truck className="h-3.5 w-3.5 text-primary-600" />
                          ) : (
                            <Building2 className="h-3.5 w-3.5 text-blue-600" />
                          )}
                          {due.entity}
                        </div>
                        {due.notes && (
                          <span className="text-[11px] text-text-muted block max-w-[260px] truncate">
                            {due.notes}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                            due.type.includes("Receivable")
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {due.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-text whitespace-nowrap">
                        {formatPrice(due.amount)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-600 whitespace-nowrap">
                        {formatPrice(due.paid)}
                      </td>
                      <td className="px-4 py-3 font-extrabold text-red-600 whitespace-nowrap">
                        {formatPrice(balanceDue)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {due.dueDate}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            due.status === "settled"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : due.status === "partial"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {due.status === "settled" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {due.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                        {due.status !== "settled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSettlingItem(due);
                              setPaymentAmount(String(due.amount - due.paid));
                              setSettlementNote("");
                              setError("");
                            }}
                            className="text-xs h-7 px-2.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                          >
                            <DollarSign className="h-3 w-3 mr-0.5" />
                            Settle
                          </Button>
                        )}
                        <button
                          onClick={() => handleDeleteDue(due.id)}
                          disabled={deletingId === due.id}
                          className="text-text-muted hover:text-red-600 transition-colors p-1 align-middle"
                          title="Delete entry"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Due Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-border animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-600" />
                Record Due / Remittance
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
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

            <form onSubmit={handleAddDue} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="due-entity">Party / Entity Name</Label>
                <Input
                  id="due-entity"
                  placeholder="e.g. SteadFast Courier or Seoul Cosmetics Wholesale"
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="due-type">Type</Label>
                <select
                  id="due-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-text focus:border-primary-500 focus:outline-none"
                >
                  <option value="Receivable (COD)">Receivable (COD from Courier)</option>
                  <option value="Payable (Supplier)">Payable (To Skincare Supplier)</option>
                  <option value="Receivable (Other)">Receivable (Other)</option>
                  <option value="Payable (Operational)">Payable (Operational / Service)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="due-amount">Total Due Amount (BDT)</Label>
                <Input
                  id="due-amount"
                  type="number"
                  placeholder="e.g. 45000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="due-notes">Notes / Consignment Reference</Label>
                <textarea
                  id="due-notes"
                  rows={2}
                  placeholder="e.g. COD collection for delivered skincare parcels..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-xs text-text focus:border-primary-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Due Record"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settle Due Modal */}
      {settlingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-border animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Record Settlement / Payment
              </h3>
              <button
                onClick={() => setSettlingItem(null)}
                className="text-text-muted hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 bg-surface-secondary rounded-xl border border-border text-xs space-y-1">
              <p className="font-bold text-text">{settlingItem.entity}</p>
              <div className="flex justify-between text-text-secondary">
                <span>Total Due: {formatPrice(settlingItem.amount)}</span>
                <span>Already Paid: {formatPrice(settlingItem.paid)}</span>
              </div>
              <p className="font-extrabold text-red-600 pt-1 border-t border-border">
                Remaining Balance: {formatPrice(settlingItem.amount - settlingItem.paid)}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSettleDue} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="settle-amount">Amount Received / Paid (BDT)</Label>
                <Input
                  id="settle-amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  min="1"
                  max={settlingItem.amount - settlingItem.paid}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="settle-notes">Settlement Reference / Bank Cheque No</Label>
                <Input
                  id="settle-notes"
                  placeholder="e.g. Received via BRAC Bank corporate deposit or bKash"
                  value={settlementNote}
                  onChange={(e) => setSettlementNote(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSettlingItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? "Processing..." : "Confirm Settlement"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
