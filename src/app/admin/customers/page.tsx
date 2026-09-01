import { getAdminCustomers } from "@/features/customers/actions";
import { CustomerListClient } from "@/features/customers/customer-list-client";

export const metadata = {
  title: "Customers — Admin Dashboard",
};

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return <CustomerListClient initialCustomers={customers} />;
}
