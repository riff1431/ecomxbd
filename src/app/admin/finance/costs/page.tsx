import { getExpenses } from "@/features/finance/actions";
import { CostsClient } from "./costs-client";

export const metadata = {
  title: "Costs & Expenses — Finance",
  description: "Live operational expense tracking, logistics freight, custom clearance, and packaging overheads.",
};

export default async function AdminFinanceCostsPage() {
  const expenses = await getExpenses();

  return <CostsClient initialExpenses={expenses} />;
}
