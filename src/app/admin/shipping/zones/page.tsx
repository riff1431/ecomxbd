import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Truck, MapPin, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export const metadata = {
  title: "Shipping Zones — Admin Dashboard",
};

export default function AdminShippingZonesPage() {
  const zones = [
    {
      id: "zone-1",
      name: "Inside Dhaka City (Express)",
      regions: "Dhaka North, Dhaka South, Gulshan, Banani, Dhanmondi, Mirpur, Uttara",
      charge: 60,
      freeThreshold: 2500,
      deliveryTime: "24-48 Hours",
      enabled: true,
      courierRates: { steadfast: 60, pathao: 70, redx: 60 },
    },
    {
      id: "zone-2",
      name: "Dhaka Suburbs & Greater Dhaka",
      regions: "Savar, Gazipur, Narayanganj, Keraniganj",
      charge: 100,
      freeThreshold: 3000,
      deliveryTime: "2-3 Days",
      enabled: true,
      courierRates: { steadfast: 90, pathao: 100, redx: 95 },
    },
    {
      id: "zone-3",
      name: "Outside Dhaka / Nationwide (All Divisions)",
      regions: "Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, Mymensingh",
      charge: 120,
      freeThreshold: 3500,
      deliveryTime: "3-5 Days",
      enabled: true,
      courierRates: { steadfast: 120, pathao: 130, redx: 120 },
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <ModuleHeader
          title="Geographic Shipping Zones & Delivery Rates"
          description="Configure regional parcel delivery fees, estimated transit days, and free delivery thresholds for Bangladesh."
          iconName="MapPin"
          isCore
        />

        <Button size="sm" className="text-xs shrink-0">
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
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active Zone
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">{zone.regions}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                  <Edit2 className="h-3 w-3 mr-1 text-primary-600" />
                  Edit Rates
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-surface-secondary/60 p-3 rounded-xl border border-border">
                <span className="text-text-muted text-[11px] block">Standard Rate</span>
                <span className="text-base font-extrabold text-text mt-0.5 block">
                  ৳{zone.charge}
                </span>
              </div>

              <div className="bg-surface-secondary/60 p-3 rounded-xl border border-border">
                <span className="text-text-muted text-[11px] block">Free Shipping Above</span>
                <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">
                  ৳{zone.freeThreshold}
                </span>
              </div>

              <div className="bg-surface-secondary/60 p-3 rounded-xl border border-border">
                <span className="text-text-muted text-[11px] block">Est. Delivery Time</span>
                <span className="text-sm font-bold text-text mt-0.5 block">
                  {zone.deliveryTime}
                </span>
              </div>

              <div className="bg-surface-secondary/60 p-3 rounded-xl border border-border">
                <span className="text-text-muted text-[11px] block">SteadFast / Pathao</span>
                <span className="text-xs font-semibold text-primary-600 mt-0.5 block">
                  ৳{zone.courierRates.steadfast} / ৳{zone.courierRates.pathao}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
