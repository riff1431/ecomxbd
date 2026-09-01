"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getCoupons() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch coupons:", error);
    return [];
  }
  return data || [];
}

export async function createCoupon(input: {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  max_discount?: number | null;
  min_cart_amount?: number | null;
  usage_limit?: number | null;
}) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("coupons")
    .insert({
      code: input.code.trim().toUpperCase(),
      type: input.type,
      value: input.value,
      max_discount: input.max_discount || null,
      min_cart_amount: input.min_cart_amount || null,
      usage_limit: input.usage_limit || null,
      usage_count: 0,
      scope: "all",
      status: "active",
      starts_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/coupons");
  return { success: true, coupon: data };
}

export async function deleteCoupon(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/coupons");
  return { success: true };
}
