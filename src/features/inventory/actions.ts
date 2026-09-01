"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";

export async function getInventory(filters?: {
  stock_status?: "in_stock" | "low_stock" | "out_of_stock";
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("inventory")
    .select(`
      *,
      products (
        id,
        name,
        slug,
        sku,
        regular_price
      ),
      product_variants (
        id,
        sku,
        regular_price
      )
    `)
    .order("updated_at", { ascending: false });

  if (filters?.stock_status === "out_of_stock") {
    query = query.lte("available", 0);
  } else if (filters?.stock_status === "low_stock") {
    query = query.gt("available", 0).lte("available", 5);
  } else if (filters?.stock_status === "in_stock") {
    query = query.gt("available", 5);
  }

  const { data, error } = await query;
  if (error) throw error;

  let results = data;
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter((item) => {
      const pName = item.products?.name?.toLowerCase() || "";
      const pSku = item.products?.sku?.toLowerCase() || "";
      const vSku = item.product_variants?.sku?.toLowerCase() || "";
      return pName.includes(q) || pSku.includes(q) || vSku.includes(q);
    });
  }

  return results;
}

export async function adjustStock(input: {
  inventory_id: string;
  type: "purchase" | "sale" | "adjustment" | "return" | "damage" | "cancellation" | "manual";
  quantity_change: number;
  notes?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get current inventory record
  const { data: current, error: fetchErr } = await supabase
    .from("inventory")
    .select("*")
    .eq("id", input.inventory_id)
    .single();

  if (fetchErr || !current) {
    return { error: "Inventory record not found." };
  }

  const newOnHand = Math.max(0, current.on_hand + input.quantity_change);
  const newAvailable = Math.max(0, newOnHand - current.reserved);

  let updatedDamaged = current.damaged;
  if (input.type === "damage") {
    updatedDamaged += Math.abs(input.quantity_change);
  }

  // Update inventory record
  const { data: updated, error: updateErr } = await supabase
    .from("inventory")
    .update({
      on_hand: newOnHand,
      available: newAvailable,
      damaged: updatedDamaged,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.inventory_id)
    .select()
    .single();

  if (updateErr) {
    return { error: updateErr.message };
  }

  // Log movement to inventory_movements table
  const { error: moveErr } = await supabase.from("inventory_movements").insert({
    inventory_id: input.inventory_id,
    product_id: current.product_id,
    variant_id: current.variant_id,
    type: input.type,
    quantity_change: input.quantity_change,
    notes: input.notes || null,
    created_by: user?.id || null,
  });

  if (moveErr) {
    console.error("Failed to log inventory movement:", moveErr);
  }

  // Log to general activity logs
  await logActivity({
    action: "inventory.adjust",
    targetType: "inventory",
    targetId: input.inventory_id,
    beforeData: current as unknown as Record<string, unknown>,
    afterData: updated as unknown as Record<string, unknown>,
  });

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  return { data: updated };
}

export async function getInventoryMovements(inventoryId?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("inventory_movements")
    .select(`
      *,
      products (name, sku),
      profiles (full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (inventoryId) {
    query = query.eq("inventory_id", inventoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
