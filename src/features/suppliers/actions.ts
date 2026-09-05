"use server";

import { getSetting, updateGroupSettings } from "@/lib/settings/config-service";
import { revalidatePath } from "next/cache";

export interface SupplierItem {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  status: "active" | "inactive";
  notes: string;
}

const DEFAULT_SUPPLIERS: SupplierItem[] = [
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

export async function getSuppliers(): Promise<SupplierItem[]> {
  const suppliers = await getSetting<SupplierItem[]>("finance", "suppliers", DEFAULT_SUPPLIERS);
  return suppliers || DEFAULT_SUPPLIERS;
}

export async function saveSupplier(data: {
  id?: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  status?: "active" | "inactive";
  notes: string;
}): Promise<SupplierItem[]> {
  const current = await getSuppliers();
  let updated: SupplierItem[];

  if (data.id) {
    updated = current.map((s) =>
      s.id === data.id
        ? {
            ...s,
            name: data.name.trim(),
            company: data.company.trim(),
            phone: data.phone.trim(),
            email: data.email.trim(),
            address: data.address.trim(),
            status: data.status || s.status,
            notes: data.notes.trim(),
          }
        : s
    );
  } else {
    const newSup: SupplierItem = {
      id: `sup-${Date.now()}`,
      name: data.name.trim(),
      company: data.company.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      address: data.address.trim(),
      status: data.status || "active",
      notes: data.notes.trim(),
    };
    updated = [...current, newSup];
  }

  await updateGroupSettings("finance", { suppliers: updated });
  revalidatePath("/admin/finance/suppliers");
  return updated;
}

export async function deleteSupplier(id: string): Promise<SupplierItem[]> {
  const current = await getSuppliers();
  const updated = current.filter((s) => s.id !== id);
  await updateGroupSettings("finance", { suppliers: updated });
  revalidatePath("/admin/finance/suppliers");
  return updated;
}
