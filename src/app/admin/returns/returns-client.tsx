"use client";

import { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Eye,
  Filter,
  Search,
  Check,
  Ban,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { updateReturnStatus, type ReturnRequest } from "@/features/returns/actions";
import Link from "next/link";

interface ReturnsClientProps {
  initialReturns: ReturnRequest[];
}

export function ReturnsClient({ initialReturns }: ReturnsClientProps) {
  const [returnsList, setReturnsList] = useState<ReturnRequest[]>(initialReturns);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, newStatus: ReturnRequest["status"]) => {
    setUpdatingId(id);
    try {
      await updateReturnStatus(id, newStatus, adminNoteInput || undefined);
      setReturnsList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus, admin_notes: adminNoteInput || r.admin_notes } : r))
      );
      if (selectedReturn?.id === id) {
        setSelectedReturn((prev) => (prev ? { ...prev, status: newStatus, admin_notes: adminNoteInput || prev.admin_notes } : null));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReturns = returnsList.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesSearch =
      r.return_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.customer?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.order?.order_number || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ReturnRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" /> Pending Review
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
            <CheckCircle2 className="h-3 w-3" /> Return Approved
          </span>
        );
      case "item_received":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
            <Package className="h-3 w-3" /> Item Received at Hub
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <Check className="h-3 w-3" /> Refunded
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
    }
  };

  const pendingCount = returnsList.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6 max-w-7xl">
      <ModuleHeader
        title="Customer Returns & RMA Management"
        description="Review customer return requests, inspect evidence photos, dispatch reverse courier pickups, and authorize bKash/Nagad refunds."
        icon={RotateCcw}
        badgeLabel={`${pendingCount} Pending Action`}
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-text-muted">Total Requests</span>
          <p className="text-2xl font-extrabold text-text mt-1">{returnsList.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-amber-600">Pending Review</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-blue-600">Approved for Pickup</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">
            {returnsList.filter((r) => r.status === "approved" || r.status === "item_received").length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-emerald-600">Successfully Refunded</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {returnsList.filter((r) => r.status === "refunded").length}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-border shadow-card">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by RMA #, Order #, or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-secondary/50 pl-9 pr-4 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Returns" },
            { id: "pending", label: "Pending" },
            { id: "approved", label: "Approved" },
            { id: "item_received", label: "Received" },
            { id: "refunded", label: "Refunded" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Returns Table / Grid */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text">
            <thead className="bg-surface-secondary/60 text-[11px] font-bold uppercase tracking-wider text-text-muted border-b border-border">
              <tr>
                <th className="px-5 py-3.5">RMA # & Date</th>
                <th className="px-5 py-3.5">Order & Customer</th>
                <th className="px-5 py-3.5">Reason for Return</th>
                <th className="px-5 py-3.5">Refund Method & Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReturns.map((item) => (
                <tr key={item.id} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-primary-600">{item.return_number}</span>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-text">{item.customer?.full_name || "Customer"}</div>
                    <p className="text-[11px] text-text-muted font-mono">{item.order?.order_number}</p>
                    <p className="text-[11px] text-text-secondary">{item.customer?.phone}</p>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="line-clamp-2 text-text font-medium">{item.reason}</p>
                    {item.customer_notes && (
                      <p className="text-[11px] text-text-muted italic mt-0.5">"{item.customer_notes}"</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-text">৳{item.refund_amount.toLocaleString()}</span>
                    <p className="text-[10px] font-semibold uppercase text-text-muted tracking-wider mt-0.5">
                      {item.refund_method}
                    </p>
                  </td>
                  <td className="px-5 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReturn(item);
                          setAdminNoteInput(item.admin_notes || "");
                        }}
                        className="text-xs h-7 px-2.5"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Inspect
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReturns.length === 0 && (
          <div className="p-12 text-center space-y-2">
            <RotateCcw className="h-8 w-8 text-text-muted mx-auto" />
            <h3 className="text-sm font-bold text-text">No return requests found</h3>
            <p className="text-xs text-text-secondary">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* Inspect / Modal Drawer */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-border shadow-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                  Return RMA Inspection
                </span>
                <h2 className="text-lg font-bold text-text">{selectedReturn.return_number}</h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Order: <span className="font-mono font-bold">{selectedReturn.order?.order_number}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedReturn(null)}
                className="text-text-muted hover:text-text p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-text-muted">Customer Name:</span>
                <p className="font-bold text-text">{selectedReturn.customer?.full_name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-text-muted">Contact Phone:</span>
                <p className="font-bold text-text">{selectedReturn.customer?.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-text-muted">Refund Amount:</span>
                <p className="font-bold text-text text-sm">৳{selectedReturn.refund_amount.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-text-muted">Refund Method:</span>
                <p className="font-bold uppercase text-text">{selectedReturn.refund_method}</p>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-surface-secondary/50 rounded-2xl p-4 border border-border space-y-2 text-xs">
              <span className="font-bold text-text">Return Reason:</span>
              <p className="text-text-secondary leading-relaxed">{selectedReturn.reason}</p>
              {selectedReturn.customer_notes && (
                <div className="pt-2 border-t border-border">
                  <span className="text-text-muted font-semibold">Customer Note:</span>
                  <p className="text-text italic">{selectedReturn.customer_notes}</p>
                </div>
              )}
            </div>

            {/* Evidence photos if any */}
            {selectedReturn.images && selectedReturn.images.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-text">Uploaded Evidence:</span>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {selectedReturn.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Return evidence"
                      className="h-28 w-28 object-cover rounded-xl border border-border"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-text">Admin Internal Processing Notes:</label>
              <textarea
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                rows={2}
                placeholder="Enter courier consignment note, refund reference number, or inspection remarks..."
                className="w-full rounded-xl border border-border p-3 text-xs focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(selectedReturn.id, "approved")}
                  disabled={updatingId === selectedReturn.id || selectedReturn.status === "approved"}
                  className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve Pickup
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(selectedReturn.id, "item_received")}
                  disabled={updatingId === selectedReturn.id || selectedReturn.status === "item_received"}
                  className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                >
                  <Package className="h-3.5 w-3.5 mr-1" /> Mark Item Received
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(selectedReturn.id, "refunded")}
                  disabled={updatingId === selectedReturn.id || selectedReturn.status === "refunded"}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Issue Refund
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(selectedReturn.id, "rejected")}
                  disabled={updatingId === selectedReturn.id || selectedReturn.status === "rejected"}
                  className="text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                >
                  <Ban className="h-3.5 w-3.5 mr-1" /> Reject
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={() => setSelectedReturn(null)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
