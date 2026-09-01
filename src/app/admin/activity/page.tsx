import { Activity, ShieldCheck, Truck, Ban, Star, Tag, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Activity Logs — Admin",
};

const AUDIT_LOGS = [
  {
    id: "log-1",
    action: "Courier Consignment Booked",
    icon: Truck,
    details: "Booked order ORD-2026-895823 with SteadFast Courier (Consignment: SF-895823-DH)",
    user: "Master Admin",
    time: "10 mins ago",
    category: "Logistics",
  },
  {
    id: "log-2",
    action: "Customer Blacklisted",
    icon: Ban,
    details: "Added 01999999999 to fraud blacklist (Reason: 4 Doorstep delivery rejections)",
    user: "Master Admin",
    time: "25 mins ago",
    category: "Security",
  },
  {
    id: "log-3",
    action: "Product Review Approved",
    icon: Star,
    details: "Approved 5-star verified review on COSRX Advanced Snail 96 Mucin Power Essence",
    user: "Master Admin",
    time: "1 hour ago",
    category: "Social Proof",
  },
  {
    id: "log-4",
    action: "SMS Notification Dispatched",
    icon: MessageSquare,
    details: "Sent automated Order Confirmed SMS to 01712345678 via BulkSMSBD gateway",
    user: "System Trigger",
    time: "2 hours ago",
    category: "Marketing",
  },
  {
    id: "log-5",
    action: "Meta XML Feed Generated",
    icon: Tag,
    details: "Synced published catalog products with Meta Advantage+ Catalog feed (/api/feed/meta)",
    user: "System Cron",
    time: "4 hours ago",
    category: "Integrations",
  },
];

export default function AdminActivityPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Administrative Activity & Audit Trail</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Immutable audit record of staff actions, security events, logistics bookings, and automated triggers.
        </p>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-2xl border border-border bg-white shadow-card p-6 space-y-6">
        <div className="divide-y divide-border">
          {AUDIT_LOGS.map((log) => {
            const Icon = log.icon;
            return (
              <div key={log.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3 text-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-secondary text-primary-600 shrink-0 mt-0.5 border border-border">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text text-xs">{log.action}</span>
                    <span className="text-[11px] text-text-muted">{log.time}</span>
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed">{log.details}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-text-muted font-semibold">
                      By: {log.user}
                    </span>
                    <span className="rounded bg-primary-50 px-1.5 py-0.5 text-[10px] text-primary-700 font-bold uppercase">
                      {log.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
