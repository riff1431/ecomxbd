"use client";

import { useState } from "react";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Truck, MapPin, Plus, Edit2, Trash2, X, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { formatPrice } from "@/lib/utils";
import { saveShippingZone, deleteShippingZone, type ShippingZoneItem } from "@/features/logistics/actions";

interface ZonesClientProps {
  initialZones: ShippingZoneItem[];
}

export function ZonesClient({ initialZones }: ZonesClientProps) {
  const [zones, setZones] = useState<ShippingZoneItem[]>(initialZones);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZoneItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [regions, setRegions] = useState("");
  const [charge, setCharge] = useState("");
  const [freeThreshold, setFreeThreshold] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [sfRate, setSfRate] = useState("");
  const [pathaoRate, setPathaoRate] = useState("");
  const [error, setError] = useState("");

  const openAddModal = () => {
    setEditingZone(null);
    setName("");
    setRegions("");
    setCharge("60");
    setFreeThreshold("2500");
    setDeliveryTime("24-48 Hours");
    setEnabled(true);
    setSfRate("60");
    setPathaoRate("70");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (zone: ShippingZoneItem) => {
    setEditingZone(zone);
    setName(zone.name);
    setRegions(zone.regions);
    setCharge(String(zone.charge));
    setFreeThreshold(String(zone.freeThreshold));
    setDeliveryTime(zone.deliveryTime);
    setEnabled(zone.enabled);
    setSfRate(String(zone.courierRates?.steadfast || zone.charge));
    setPathaoRate(String(zone.courierRates?.pathao || zone.charge + 10));
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a zone name");
      return;
    }
    if (!charge || Number(charge) < 0) {
      setError("Please provide a valid delivery charge");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const updated = await saveShippingZone({
        id: editingZone?.id,
        name,
        regions,
        charge: Number(charge),
        freeThreshold: Number(freeThreshold || 0),
        deliveryTime: deliveryTime || "2-3 Days",
        enabled,
        courierRates: {
          steadfast: Number(sfRate || charge),
          pathao: Number(pathaoRate || charge),
          redx: Number(sfRate || charge),
        },
      });
      setZones(updated);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to save shipping zone");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipping zone?")) return;
    setDeletingId(id);
    try {
      const updated = await deleteShippingZone(id);
      setZones(updated);
    } catch (err: any) {
      alert("Failed to delete zone: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <ModuleHeader
          title="Geographic Shipping Zones & Delivery Rates"
          description="Configure regional parcel delivery fees, estimated transit days, and free delivery thresholds for Bangladesh."
          iconName="MapPin"
          isCore
        />

        <Button onClick={openAddModal} size="sm" className="text-xs shrink-0">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Shipping Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-text">{zone.name}</h3>
                  {zone.enabled ? (
                    <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold uppercase border border-emerald-200">
                      Active Zone
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-secondary text-text-muted px-2.5 py-0.5 text-[10px] font-bold uppercase border border-border">
                      Disabled
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                  {zone.regions}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(zone)}
                  className="text-xs h-8 px-3"
                >
                  <Edit2 className="h-3 w-3 mr-1 text-primary-600" />
                  Edit Rates
                </Button>
                <button
                  onClick={() => handleDelete(zone.id)}
                  disabled={deletingId === zone.id}
                  className="p-1.5 text-text-muted hover:text-red-600 transition-colors"
                  title="Delete zone"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-border bg-surface-secondary/40 p-3 space-y-1">
                <span className="text-text-muted font-medium text-[11px] block">Customer Delivery Fee</span>
                <span className="text-base font-extrabold text-primary-600">
                  {formatPrice(zone.charge)}
                </span>
              </div>

              <div className="rounded-xl border border-border bg-surface-secondary/40 p-3 space-y-1">
                <span className="text-text-muted font-medium text-[11px] block">Free Shipping Above</span>
                <span className="text-base font-extrabold text-emerald-600">
                  {formatPrice(zone.freeThreshold)}
                </span>
              </div>

              <div className="rounded-xl border border-border bg-surface-secondary/40 p-3 space-y-1">
                <span className="text-text-muted font-medium text-[11px] block">Estimated Transit</span>
                <span className="text-sm font-bold text-text flex items-center gap-1 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-text-muted" />
                  {zone.deliveryTime}
                </span>
              </div>

              <div className="rounded-xl border border-border bg-surface-secondary/40 p-3 space-y-1">
                <span className="text-text-muted font-medium text-[11px] block">Courier Cost Est.</span>
                <span className="text-xs font-mono text-text block">
                  SF: ৳{zone.courierRates?.steadfast || zone.charge} | Pathao: ৳{zone.courierRates?.pathao || zone.charge + 10}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Zone Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-border animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-600" />
                {editingZone ? "Edit Shipping Zone Rates" : "Create Shipping Zone"}
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

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <Label htmlFor="zone-name">Zone Title</Label>
                <Input
                  id="zone-name"
                  placeholder="e.g. Inside Dhaka City (Express)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="zone-regions">Included Districts / Areas</Label>
                <textarea
                  id="zone-regions"
                  rows={2}
                  placeholder="e.g. Dhaka North, Dhaka South, Gulshan, Banani, Dhanmondi..."
                  value={regions}
                  onChange={(e) => setRegions(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-xs text-text focus:border-primary-500 focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="zone-charge">Customer Delivery Fee (৳)</Label>
                  <Input
                    id="zone-charge"
                    type="number"
                    value={charge}
                    onChange={(e) => setCharge(e.target.value)}
                    min={0}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="zone-free">Free Delivery Above (৳)</Label>
                  <Input
                    id="zone-free"
                    type="number"
                    value={freeThreshold}
                    onChange={(e) => setFreeThreshold(e.target.value)}
                    min={0}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="zone-time">Estimated Transit</Label>
                  <Input
                    id="zone-time"
                    placeholder="e.g. 24-48 Hours"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="zone-enabled">Status</Label>
                  <select
                    id="zone-enabled"
                    value={enabled ? "active" : "disabled"}
                    onChange={(e) => setEnabled(e.target.value === "active")}
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-text focus:border-primary-500 focus:outline-none"
                  >
                    <option value="active">Active Zone</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
                <div className="space-y-1">
                  <Label htmlFor="zone-sf">SteadFast Rate (৳)</Label>
                  <Input
                    id="zone-sf"
                    type="number"
                    value={sfRate}
                    onChange={(e) => setSfRate(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="zone-pathao">Pathao Rate (৳)</Label>
                  <Input
                    id="zone-pathao"
                    type="number"
                    value={pathaoRate}
                    onChange={(e) => setPathaoRate(e.target.value)}
                  />
                </div>
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
                  {submitting ? "Saving..." : "Save Zone Rates"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
