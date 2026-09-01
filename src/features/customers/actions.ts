"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getAdminCustomers() {
  const supabase = createAdminClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      full_name,
      phone,
      role,
      created_at,
      orders (
        id,
        total,
        status
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch customers:", error);
    return [];
  }

  // Aggregate metrics
  return (profiles || []).map((p: any) => {
    const orders = p.orders || [];
    const totalSpent = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

    return {
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      phone: p.phone,
      role: p.role,
      created_at: p.created_at,
      order_count: orders.length,
      total_spent: totalSpent,
    };
  });
}
