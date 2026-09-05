import { getSuppliers } from "@/features/suppliers/actions";
import { SupplierListClient } from "@/features/suppliers/supplier-list-client";

export const metadata = {
  title: "Suppliers — Finance",
  description: "Directory of authentic international skincare distributors and origin hubs.",
};

export default async function AdminFinanceSuppliersPage() {
  const suppliers = await getSuppliers();

  return <SupplierListClient initialSuppliers={suppliers} />;
}
