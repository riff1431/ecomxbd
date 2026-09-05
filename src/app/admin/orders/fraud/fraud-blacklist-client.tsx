"use client";

import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  Phone,
  Globe,
  AlertTriangle,
  Search,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { addBlacklistEntry, removeBlacklistEntry, type FraudProfile } from "@/features/fraud/actions";

interface FraudBlacklistClientProps {
  initialProfiles: FraudProfile[];
}

export default function FraudBlacklistClient({ initialProfiles }: FraudBlacklistClientProps) {
  const [profiles, setProfiles] = useState<FraudProfile[]>(initialProfiles);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<"phone" | "ip" | "email">("phone");
  const [addValue, setAddValue] = useState("");
  const [addReason, setAddReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addValue.trim()) return;
    setSaving(true);

    const res = await addBlacklistEntry({
      type: addType,
      value: addValue,
      reason: addReason,
    });

    if (res.success && res.profile) {
      setProfiles([res.profile, ...profiles]);
      setAddValue("");
      setAddReason("");
      setShowAddModal(false);
      setMsg("Entry added to security blacklist!");
      setTimeout(() => setMsg(null), 3500);
    }
    setSaving(false);
  };

  const handleRemove = async (id: string) => {
    await removeBlacklistEntry(id);
    setProfiles(profiles.filter((p) => p.id !== id));
    setMsg("Entry removed from blacklist.");
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Fraud Detection & Blacklist Control
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Prevent fake Cash on Delivery orders, courier doorstep rejections, and block malicious phone numbers or IP addresses.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-xs"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Add to Blacklist
        </Button>
      </div>

      {msg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg(null)} className="opacity-60 hover:opacity-100 p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-red-200/60 pb-3">
            <h2 className="text-sm font-black text-red-900 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-600" /> Add Blacklist & Blocking Rule
            </h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-xs text-gray-500 hover:text-gray-900 font-bold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAdd} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Target Type</label>
                <select
                  value={addType}
                  onChange={(e) => setAddType(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold focus:border-red-600 focus:outline-none"
                >
                  <option value="phone">Mobile Phone Number (01...)</option>
                  <option value="ip">IP Address</option>
                  <option value="email">Email Address</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Blocked Identifier Value</label>
                <input
                  type="text"
                  required
                  placeholder={addType === "phone" ? "01999999999" : addType === "ip" ? "103.145.2.1" : "name@example.com"}
                  value={addValue}
                  onChange={(e) => setAddValue(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold font-mono focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Reason for Blacklist</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Courier rejection 4 times across Dhaka"
                  value={addReason}
                  onChange={(e) => setAddReason(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="submit"
                disabled={saving}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Confirm & Block Identifier
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Blacklist Table */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase text-gray-900">
            Active Blocked Identifiers ({profiles.length})
          </h2>
          <span className="text-xs text-red-600 font-bold">100% Rejected at Checkout</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-black border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Identifier</th>
                <th className="px-5 py-3">Blacklist Reason</th>
                <th className="px-5 py-3">Doorstep Rejections</th>
                <th className="px-5 py-3">Risk Score</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold uppercase text-gray-700">
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] border border-gray-200">
                      {p.identifier_type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-gray-900">{p.identifier_value}</td>
                  <td className="px-5 py-3.5 text-gray-600 max-w-xs">{p.blacklist_reason || "Manually blocked"}</td>
                  <td className="px-5 py-3.5 font-bold text-red-600">{p.rejected_delivery_count} returns</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 text-[10px] font-black">
                      {p.risk_score}% Risk
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                      title="Unblock Identifier"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
