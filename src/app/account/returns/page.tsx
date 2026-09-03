"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw, ShieldCheck, AlertCircle, Plus, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export default function AccountReturnsPage() {
  const [showModal, setShowModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [reason, setReason] = useState("damaged");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const mockReturns = [
    {
      id: "RET-9042",
      orderNumber: "ORD-2026-10291",
      item: "Laneige Lip Sleeping Mask (Berry 20g)",
      status: "Approved & Refunded",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      date: "28 Jan 2026",
      refundAmount: "৳1,850",
      notes: "Refund processed via original payment channel.",
    },
  ];

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      alert("Your return & exchange request has been submitted! Our customer care team will review within 24 hours.");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-[#e91e63]" /> Returns & Exchanges
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage product returns, refund status, and replacement requests.
          </p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-[#e91e63] hover:bg-[#d81b60] text-white text-xs font-bold rounded-xl self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Request New Return
        </Button>
      </div>

      {/* Return Policy Notice Strip */}
      <div className="rounded-2xl border border-pink-200 bg-pink-50/50 p-4 flex items-start gap-3 text-xs">
        <ShieldCheck className="h-5 w-5 text-[#e91e63] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-gray-900">7-Day Hassle-Free Return Guarantee</p>
          <p className="text-gray-600 leading-relaxed">
            If you received a damaged product, incorrect shade, or defective item, you can request an exchange or 100% refund within 7 days of delivery.
          </p>
        </div>
      </div>

      {/* Returns List */}
      <div className="space-y-4">
        {mockReturns.map((ret) => (
          <div key={ret.id} className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <span className="font-mono text-xs font-black text-[#e91e63]">{ret.id}</span>
                <span className="text-gray-400 text-xs mx-2">•</span>
                <span className="text-xs font-bold text-gray-700">Order: {ret.orderNumber}</span>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${ret.statusColor}`}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                {ret.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-medium block">Item Requested</span>
                <span className="font-bold text-gray-900">{ret.item}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Refund Value</span>
                <span className="font-black text-gray-900 text-sm text-emerald-700">{ret.refundAmount}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Date Processed</span>
                <span className="font-bold text-gray-800">{ret.date}</span>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              <span className="font-bold text-gray-800">Support Note: </span>
              {ret.notes}
            </div>
          </div>
        ))}
      </div>

      {/* Request Return Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in-0">
          <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-black text-gray-900">Request Return or Exchange</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReturn} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Order Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ORD-2026-237693"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#e91e63] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Reason for Return</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#e91e63] focus:outline-none"
                >
                  <option value="damaged">Damaged or Broken in Transit</option>
                  <option value="wrong_item">Received Wrong Product / Shade</option>
                  <option value="expired">Expired or Near Expiry</option>
                  <option value="defective">Defective Seal or Leakage</option>
                  <option value="other">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Detailed Explanation</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please describe the issue with the item..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-900 focus:bg-white focus:border-[#e91e63] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitted} className="bg-[#e91e63] hover:bg-[#d81b60] text-white text-xs font-bold">
                  {submitted ? "Submitting..." : "Submit Return Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
