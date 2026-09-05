import { getAccounts } from "@/features/finance/actions";
import { AccountingClient } from "./accounting-client";

export const metadata = {
  title: "Accounting & Balances — Finance",
  description: "Live overview of corporate bank balances, mobile wallets (bKash/Nagad), COD receivables, and supplier liabilities.",
};

export default async function AdminFinanceAccountingPage() {
  const accounts = await getAccounts();

  return <AccountingClient initialAccounts={accounts} />;
}
