import { getSettingsByGroup, updateGroupSettings } from "@/lib/settings/config-service";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Image, Save, FileType, HardDrive } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Media Settings — Admin Dashboard",
};

export default async function AdminMediaSettingsPage() {
  const settings = await getSettingsByGroup("media");

  async function handleSave(formData: FormData) {
    "use server";
    const maxMb = Number(formData.get("max_upload_size_mb") || 10);
    await updateGroupSettings("media", {
      max_upload_size_mb: maxMb,
    });
    revalidatePath("/admin/media/settings");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="Global Media & Upload Limits"
        description="Configure file size limits, allowed extensions, and media preservation rules for product galleries and banner uploads."
        iconName="Image"
        isCore
      />

      <form action={handleSave} className="space-y-6 text-xs">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-primary-600" />
            File Size Limits & Formats
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text mb-1">
                Maximum File Upload Size (MB)
              </label>
              <input
                type="number"
                name="max_upload_size_mb"
                defaultValue={settings.max_upload_size_mb || 10}
                min={1}
                max={50}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Allowed Image Formats
              </label>
              <div className="rounded-xl border border-border bg-surface-secondary/50 px-3.5 py-2 font-mono text-text-muted">
                JPG, PNG, WEBP, GIF, AVIF
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Media Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
