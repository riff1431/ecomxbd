import { getInvestors } from "@/features/finance/actions";
import { InvestorsClient } from "./investors-client";

export const metadata = {
  title: "Investors & Equity — Finance",
  description: "Manage seed capital contributions, equity ownership percentages, and quarterly profit distributions.",
};

export default async function AdminFinanceInvestorsPage() {
  const investors = await getInvestors();

  return <InvestorsClient initialInvestors={investors} />;
}
