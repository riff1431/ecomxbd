import { getDues } from "@/features/finance/actions";
import { DuesClient } from "./dues-client";

export const metadata = {
  title: "Dues & Settlements — Finance",
  description: "Track pending Cash on Delivery remittances from courier partners and upcoming supplier payments.",
};

export default async function AdminFinanceDuesPage() {
  const dues = await getDues();

  return <DuesClient initialDues={dues} />;
}
