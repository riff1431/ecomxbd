import { createAdminClient } from "@/lib/supabase/admin";
import { SupplierListClient } from "@/features/suppliers/supplier-list-client";

export const metadata = {
  title: "Suppliers — Finance",
};

const DEFAULT_SUPPLIERS = [
  {
    id: "sup-1",
    name: "Kim Min-jun",
    company: "Seoul Cosmetics Wholesale Ltd",
    phone: "+82-2-1234-5678",
    email: "supply@seoulcosmetics.kr",
    address: "Gangnam-gu, Seoul, South Korea",
    status: "active",
    notes: "Direct authorized distributor for COSRX and Beauty of Joseon",
  },
  {
    id: "sup-2",
    name: "David Miller",
    company: "Cerave Distribution UK",
    phone: "+44-20-7946-0912",
    email: "orders@ceravedist.co.uk",
    address: "London, United Kingdom",
    status: "active",
    notes: "Official UK Cerave hydrating cleansers import partner",
  },
  {
    id: "sup-3",
    name: "Amina Al-Mansoor",
    company: "Dubai Skincare Trading FZC",
    phone: "+971-4-321-9876",
    email: "trade@dubaiskincare.ae",
    address: "Deira, Dubai, UAE",
    status: "active",
    notes: "Middle East logistics hub for The Ordinary formulations",
  },
];

export default async function AdminFinanceSuppliersPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("suppliers").select("*");
  const suppliers = data && data.length > 0 ? data : DEFAULT_SUPPLIERS;

  return <SupplierListClient initialSuppliers={suppliers} />;
}
