import { getCustomerDashboardData } from "@/features/account/actions";
import { AccountOverviewClient } from "./account-overview-client";

export default async function AccountOverviewPage() {
  const data = await getCustomerDashboardData();

  return <AccountOverviewClient data={data} />;
}
