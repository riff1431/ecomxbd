import { getActivityLogs } from "@/features/activity/actions";
import { ActivityClient } from "./activity-client";

export const metadata = {
  title: "Activity Logs — Admin",
  description: "Administrative activity, staff operations, and security audit trail.",
};

export default async function AdminActivityPage() {
  const logs = await getActivityLogs();

  return <ActivityClient initialLogs={logs} />;
}
