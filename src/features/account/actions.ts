"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getCustomerDashboardData() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) return null;

  const adminClient = createAdminClient();

  // Fetch Orders
  const { data: orders } = await adminClient
    .from("orders")
    .select("id, order_number, total, status, created_at, order_items(id)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orderList = orders || [];
  const totalOrders = orderList.length;
  const pendingOrders = orderList.filter((o) =>
    ["pending", "confirmed", "processing", "packed"].includes(o.status)
  ).length;
  const deliveredOrders = orderList.filter((o) => o.status === "delivered").length;
  const latestOrder = orderList[0] || null;

  return {
    user,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    latestOrder,
  };
}

export async function getCustomerOrders() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) return [];

  const adminClient = createAdminClient();
  const { data: orders } = await adminClient
    .from("orders")
    .select(`
      id,
      order_number,
      total,
      subtotal,
      shipping_amount,
      discount_amount,
      status,
      payment_method,
      payment_status,
      created_at,
      shipping_method,
      order_items (
        id,
        product_name_snapshot,
        unit_price,
        quantity,
        total
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return orders || [];
}

export async function getCustomerOrderById(orderId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) return null;

  const adminClient = createAdminClient();
  const { data: order, error } = await adminClient
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        product_name_snapshot,
        sku_snapshot,
        unit_price,
        quantity,
        total
      ),
      order_status_history (
        id,
        status,
        note,
        created_at
      )
    `)
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error || !order) return null;
  return order;
}

export async function getCustomerAddresses() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) return [];

  const adminClient = createAdminClient();
  const { data: addresses } = await adminClient
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  return addresses || [];
}

export async function saveCustomerAddress(input: {
  id?: string;
  name: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  address_line: string;
  postal_code?: string;
  is_default?: boolean;
}) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) return { error: "Authentication required" };

  const adminClient = createAdminClient();

  if (input.is_default) {
    // Reset other addresses is_default to false
    await adminClient
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  if (input.id) {
    // Update
    const { data, error } = await adminClient
      .from("addresses")
      .update({
        name: input.name,
        phone: input.phone,
        division: input.division,
        district: input.district,
        area: input.area,
        address_line: input.address_line,
        postal_code: input.postal_code || null,
        is_default: input.is_default || false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return { error: error.message };
    revalidatePath("/account/addresses");
    return { success: true, address: data };
  } else {
    // Insert
    const { data, error } = await adminClient
      .from("addresses")
      .insert({
        user_id: user.id,
        name: input.name,
        phone: input.phone,
        division: input.division,
        district: input.district,
        area: input.area,
        address_line: input.address_line,
        postal_code: input.postal_code || null,
        is_default: input.is_default || false,
      })
      .select()
      .single();

    if (error) return { error: error.message };
    revalidatePath("/account/addresses");
    return { success: true, address: data };
  }
}

export async function deleteCustomerAddress(addressId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) return { error: "Authentication required" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/addresses");
  return { success: true };
}
