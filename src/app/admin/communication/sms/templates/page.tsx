import { getSmsTemplates } from "@/features/sms/actions";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { MessageSquare, Edit2, Plus, Code } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export const metadata = {
  title: "SMS Templates Manager — Admin Dashboard",
};

export default async function AdminSmsTemplatesPage() {
  const templates = await getSmsTemplates();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <ModuleHeader
          title="SMS Notification Templates & Dynamic Variables"
          description="Manage automated message content for OTP verification, order placements, courier dispatches, and delivery confirmations."
          iconName="MessageSquare"
          backHref="/admin/communication/sms"
        />

        <Button size="sm" className="text-xs shrink-0">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Create Template
        </Button>
      </div>

      <div className="space-y-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-3"
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text">{tpl.name}</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-surface-secondary text-primary-700 font-semibold border border-border">
                  {tpl.event_type}
                </span>
              </div>

              <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                <Edit2 className="h-3 w-3 mr-1 text-primary-600" />
                Edit Template
              </Button>
            </div>

            <div className="bg-surface-secondary/70 p-3 rounded-xl border border-border font-sans text-xs text-text leading-relaxed">
              &quot;{tpl.template}&quot;
            </div>

            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className="text-text-muted font-medium flex items-center gap-1">
                <Code className="h-3 w-3" />
                Variables:
              </span>
              {tpl.variables.map((v: string) => (
                <span
                  key={v}
                  className="rounded-md bg-primary-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary-700 border border-primary-100"
                >
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
