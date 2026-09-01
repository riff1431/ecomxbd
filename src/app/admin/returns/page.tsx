import { getAdminReturns } from "@/features/returns/actions";
import { ReturnsClient } from "./returns-client";

export const metadata = {
  title: "Customer Returns & RMA — Admin Dashboard",
  description: "Manage product returns, inspection workflows, reverse courier pickups, and customer refunds.",
};

export default async function AdminReturnsPage() {
  const returns = await getAdminReturns();

  return <ReturnsClient initialReturns={returns} />;
}
