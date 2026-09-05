import { getSettingsByGroup, updateGroupSettings } from "@/lib/settings/config-service";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { Megaphone, Save, Tag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Marketing Settings — Admin Dashboard",
};

export default async function AdminMarketingSettingsPage() {
  const settings = await getSettingsByGroup("marketing");

  async function handleSave(formData: FormData) {
    "use server";
    const allowCouponStacking = formData.get("allow_coupon_stacking") === "on";
    const abandonedCartHours = Number(formData.get("abandoned_cart_hours") || 2);

    await updateGroupSettings("marketing", {
      allow_coupon_stacking: allowCouponStacking,
      abandoned_cart_hours: abandonedCartHours,
    });
    revalidatePath("/admin/marketing/settings");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <ModuleHeader
        title="Marketing, Promotions & Cart Recovery"
        description="Configure coupon stacking behavior, promotional banners, and abandoned checkout trigger delays."
        iconName="Megaphone"
        isCore
      />

      <form action={handleSave} className="space-y-6 text-xs">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary-600" />
            Voucher & Coupon Rules
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface-secondary/40 cursor-pointer">
              <div>
                <span className="font-semibold text-text block">Allow Coupon Stacking with Sale Discounts</span>
                <span className="text-text-muted text-[11px]">
                  Permit discount coupon codes to apply on items that are already discounted on flash sale.
                </span>
              </div>
              <input
                type="checkbox"
                name="allow_coupon_stacking"
                defaultChecked={settings.allow_coupon_stacking ?? true}
                className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary-600" />
            Abandoned Checkout Recovery Automation
          </h2>

          <div>
            <label className="block font-semibold text-text mb-1">
              Trigger Automated Recovery SMS after (Hours)
            </label>
            <input
              type="number"
              name="abandoned_cart_hours"
              defaultValue={settings.abandoned_cart_hours || 2}
              min={1}
              max={48}
              className="w-48 rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-text focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm" className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Marketing Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
