import { getAbandonedCheckouts } from "@/features/fraud/actions";
import { AbandonedCheckoutsClient } from "@/features/fraud/abandoned-checkouts-client";

export const metadata = {
  title: "Incomplete Orders — Admin Dashboard",
};

export default async function AdminIncompleteOrdersPage() {
  const checkouts = await getAbandonedCheckouts();

  return <AbandonedCheckoutsClient initialCheckouts={checkouts} />;
}
