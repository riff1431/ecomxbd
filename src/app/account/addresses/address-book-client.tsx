"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { saveCustomerAddress, deleteCustomerAddress } from "@/features/account/actions";
import { useLanguage } from "@/context/language-context";

interface AddressBookClientProps {
  initialAddresses: any[];
}

const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export function AddressBookClient({ initialAddresses }: AddressBookClientProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  const [addresses, setAddresses] = useState(initialAddresses);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    division: "Dhaka",
    district: "Dhaka City",
    area: "",
    address_line: "",
    postal_code: "",
    is_default: false,
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      phone: "",
      division: "Dhaka",
      district: "Dhaka City",
      area: "",
      address_line: "",
      postal_code: "",
      is_default: addresses.length === 0,
    });
    setShowModal(true);
  };

  const openEditModal = (addr: any) => {
    setEditingId(addr.id);
    setForm({
      name: addr.name,
      phone: addr.phone,
      division: addr.division,
      district: addr.district,
      area: addr.area,
      address_line: addr.address_line,
      postal_code: addr.postal_code || "",
      is_default: addr.is_default,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await saveCustomerAddress({
      id: editingId || undefined,
      ...form,
    });

    if (res.success && res.address) {
      if (editingId) {
        setAddresses(
          addresses.map((a) =>
            a.id === editingId ? res.address : form.is_default ? { ...a, is_default: false } : a
          )
        );
      } else {
        const updated = form.is_default
          ? addresses.map((a) => ({ ...a, is_default: false }))
          : addresses;
        setAddresses([res.address, ...updated]);
      }
      setShowModal(false);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isBn ? "আপনি কি নিশ্চিত এই ঠিকানাটি মুছে ফেলতে চান?" : "Are you sure you want to delete this address?")) return;
    const res = await deleteCustomerAddress(id);
    if (res.success) {
      setAddresses(addresses.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text">
            {isBn ? "সংরক্ষিত ঠিকানা" : "Saved Addresses"}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            {isBn
              ? "দ্রুত ও সহজ চেকআউটের জন্য আপনার ডেলিভারি ঠিকানা ম্যানেজ করুন।"
              : "Manage your delivery destinations for instant 1-click checkout."}
          </p>
        </div>
        <Button onClick={openAddModal} size="sm" className="bg-[#e91e63] hover:bg-[#d81557] text-white font-bold rounded-xl">
          <Plus className="h-4 w-4 mr-1.5" />
          {isBn ? "নতুন ঠিকানা যোগ করুন" : "Add New Address"}
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-white p-8 sm:p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[#e91e63]">
            <MapPin className="h-7 w-7" />
          </div>
          <h2 className="text-base font-bold text-text">
            {isBn ? "কোনো ডেলিভারি ঠিকানা সংরক্ষিত নেই" : "No delivery addresses saved"}
          </h2>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            {isBn
              ? "অর্ডার প্রক্রিয়া দ্রুত করতে আপনার বাসা বা অফিসের ঠিকানা সংরক্ষণ করুন।"
              : "Save your home or office address to speed up your checkout process."}
          </p>
          <Button onClick={openAddModal} size="sm" className="bg-[#e91e63] hover:bg-[#d81557] text-white font-bold rounded-xl px-5">
            {isBn ? "এখনই ঠিকানা যোগ করুন" : "Add Address Now"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded-3xl border bg-white p-5 shadow-card space-y-3 relative ${
                addr.is_default ? "border-primary-500 ring-2 ring-primary-500/10" : "border-border"
              }`}
            >
              {addr.is_default && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 text-primary-700 px-2.5 py-0.5 text-[10px] font-bold border border-primary-200">
                  <CheckCircle2 className="h-3 w-3" />
                  {isBn ? "ডিফল্ট ঠিকানা" : "Default Address"}
                </span>
              )}

              <div className="space-y-1 text-xs">
                <h3 className="font-bold text-sm text-text">{addr.name}</h3>
                <p className="font-semibold text-text">{addr.phone}</p>
                <p className="text-text-secondary">{addr.address_line}</p>
                <p className="text-text-secondary">
                  {addr.area}, {addr.district}, {addr.division}
                  {addr.postal_code ? ` - ${addr.postal_code}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-dashed border-border pt-3">
                <button
                  onClick={() => openEditModal(addr)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  {isBn ? "এডিট" : "Edit"}
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isBn ? "মুছে ফেলুন" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-600" />
                {editingId
                  ? (isBn ? "ঠিকানা সংশোধন করুন" : "Edit Address")
                  : (isBn ? "নতুন ডেলিভারি ঠিকানা যোগ করুন" : "Add New Delivery Address")}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-text-muted hover:bg-surface-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text mb-1">
                    {isBn ? "আপনার পুরো নাম" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text mb-1">
                    {isBn ? "মোবাইল নম্বর" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text mb-1">
                    {isBn ? "বিভাগ" : "Division"}
                  </label>
                  <select
                    value={form.division}
                    onChange={(e) => setForm({ ...form, division: e.target.value })}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:outline-none"
                  >
                    {BD_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-text mb-1">
                    {isBn ? "জেলা" : "District"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text mb-1">
                    {isBn ? "এলাকা / থানা" : "Area / Thana"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isBn ? "যেমন: গুলশান-১ / ধানমন্ডি" : "e.g. Gulshan-1 / Dhanmondi"}
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text mb-1">
                    {isBn ? "পোস্টাল কোড (ঐচ্ছিক)" : "Postal Code (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={form.postal_code}
                    onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  {isBn ? "বিস্তারিত ঠিকানা (বাড়ি, রোড, ফ্ল্যাট নম্বর)" : "Detailed Street Address"}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={isBn ? "বাড়ি নম্বর, রোড নম্বর, ফ্ল্যাট, ল্যান্ডমার্ক..." : "House, Road, Flat, Landmark..."}
                  value={form.address_line}
                  onChange={(e) => setForm({ ...form, address_line: e.target.value })}
                  className="w-full rounded-xl border border-border p-3 text-xs focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                  className="h-4 w-4 rounded text-[#e91e63]"
                />
                <span className="text-xs font-semibold text-text">
                  {isBn ? "ডিফল্ট ডেলিভারি ঠিকানা হিসেবে সেট করুন" : "Set as default delivery address"}
                </span>
              </label>

              <div className="pt-2 flex justify-end gap-2 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                  {isBn ? "বাতিল" : "Cancel"}
                </Button>
                <Button type="submit" disabled={loading} className="bg-[#e91e63] hover:bg-[#d81557] text-white">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  {isBn ? "সংরক্ষণ করুন" : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

