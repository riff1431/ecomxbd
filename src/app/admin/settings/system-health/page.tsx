import { runSystemHealthCheck } from "@/features/system/health-actions";
import { HealthClient } from "./health-client";

export const metadata = {
  title: "System Health & Diagnostics — Admin Dashboard",
};

export default async function AdminSystemHealthPage() {
  const initialChecks = await runSystemHealthCheck();
  return <HealthClient initialChecks={initialChecks} />;
}
