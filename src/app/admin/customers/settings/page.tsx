import { getSettingsByGroup, updateGroupSettings } from "@/lib/settings/config-service";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Users, Save, ShieldAlert } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Customer Settings — Admin Dashboard",
};

export default async function AdminCustomerSettingsPage() {
  const settings = await getSettingsByGroup("customers");

  async function handleSave(formData: FormData) {
    "use server";
    const allowRegistration = formData.get("allow_registration") === "on";
    const requirePhoneOtp = formData.get("require_phone_otp") === "on";

    await updateGroupSettings("customers", {
      allow_registration: allowRegistration,
      require_phone_otp: requirePhoneOtp,
    });
    revalidatePath("/admin/customers/settings");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="Customer Accounts & Registration Policies"
        description="Manage new account sign-up permissions, mobile OTP verifications, and customer privacy terms."
        iconName="Users"
        isCore
      />

      <form action={handleSave} className="space-y-6 text-xs">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary-600" />
            Sign Up & Onboarding Rules
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer">
              <div>
                <span className="font-semibold text-text block">Allow Public Customer Registration</span>
                <span className="text-text-muted text-[11px]">
                  Permit new buyers to create accounts on /register.
                </span>
              </div>
              <input
                type="checkbox"
                name="allow_registration"
                defaultChecked={settings.allow_registration ?? true}
                className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer">
              <div>
                <span className="font-semibold text-text block">Require Mobile OTP for Sign Up</span>
                <span className="text-text-muted text-[11px]">
                  Sends instant 4-digit SMS OTP verification code before profile activation.
                </span>
              </div>
              <input
                type="checkbox"
                name="require_phone_otp"
                defaultChecked={settings.require_phone_otp ?? false}
                className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Customer Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
