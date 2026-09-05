import { getSettingsByGroup, updateGroupSettings } from "@/lib/settings/config-service";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Wrench, Save, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Maintenance Mode — Admin Dashboard",
};

export default async function AdminMaintenancePage() {
  const settings = await getSettingsByGroup("system");

  async function handleSave(formData: FormData) {
    "use server";
    const maintenanceEnabled = formData.get("maintenance_mode") === "on";
    const message = String(
      formData.get("maintenance_message") ||
        "We are performing scheduled maintenance to enhance your shopping experience. We'll be back shortly!"
    );
    const bypassIps = String(formData.get("bypass_ips") || "");

    await updateGroupSettings("system", {
      maintenance_mode: maintenanceEnabled,
      maintenance_message: message,
      bypass_ips: bypassIps,
    });
    revalidatePath("/admin/settings/maintenance");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="Storefront Maintenance Mode"
        description="Temporarily take the public storefront offline during catalog restructuring or scheduled infrastructure maintenance while retaining admin access."
        iconName="Wrench"
        isCore
      />

      <form action={handleSave} className="space-y-6 text-xs">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Maintenance Mode Activation
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface-secondary/40 hover:bg-surface-secondary/70 cursor-pointer">
              <div>
                <span className="font-bold text-text block text-sm">
                  Enable Maintenance Mode
                </span>
                <span className="text-text-muted text-[11px]">
                  When enabled, all public storefront visitors are shown the maintenance screen. Admins remain unaffected.
                </span>
              </div>
              <input
                type="checkbox"
                name="maintenance_mode"
                defaultChecked={settings.maintenance_mode ?? false}
                className="h-5 w-5 rounded border-border text-amber-600 focus:ring-amber-500"
              />
            </label>

            <div>
              <label className="block font-semibold text-text mb-1">
                Custom Public Maintenance Notice
              </label>
              <textarea
                rows={3}
                name="maintenance_message"
                defaultValue={
                  settings.maintenance_message ||
                  "We are performing scheduled updates to improve your beauty shopping experience. We will return shortly!"
                }
                className="w-full rounded-xl border border-border bg-white p-3 text-xs text-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Whitelisted Bypass IP Addresses (Comma-separated)
              </label>
              <input
                type="text"
                name="bypass_ips"
                defaultValue={settings.bypass_ips || "127.0.0.1, ::1"}
                placeholder="e.g. 103.205.71.12, 127.0.0.1"
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono text-text focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Maintenance Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
