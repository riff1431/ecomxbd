"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface CreateOrderInput {
  customer: {
    name: string;
    phone: string;
    email?: string;
    district: string;
    thana: string;
    address: string;
    notes?: string;
  };
  items: Array<{
    product_id: string;
    variant_id?: string | null;
    quantity: number;
    name: string;
    price: number;
  }>;
  shipping: {
    method: string;
    amount: number;
  };
  couponCode?: string | null;
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const supabaseUserClient = await createClient();
    const { data: authData } = await supabaseUserClient.auth.getUser();
    const user = authData?.user || null;

    const supabaseAdmin = createAdminClient();

    // 1. Calculate and re-verify Subtotal
    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of input.items) {
      const { data: product } = await supabaseAdmin
        .from("products")
        .select("id, name, sku, regular_price, sale_price")
        .eq("id", item.product_id)
        .single();

      if (!product) {
        return { error: `Product not found: ${item.name}` };
      }

      const activePrice = product.sale_price ?? product.regular_price;
      const lineTotal = activePrice * item.quantity;
      subtotal += lineTotal;

      validatedItems.push({
        product_id: product.id,
        variant_id: item.variant_id || null,
        product_name_snapshot: product.name,
        sku_snapshot: product.sku || null,
        unit_price: activePrice,
        quantity: item.quantity,
        total: lineTotal,
      });
    }

    // 2. Validate Coupon & Discount
    let discountAmount = 0;
    let appliedCoupon: any = null;

    if (input.couponCode) {
      const { data: coupon } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("code", input.couponCode.toUpperCase())
        .eq("status", "active")
        .maybeSingle();

      if (coupon && (!coupon.min_cart_amount || subtotal >= coupon.min_cart_amount)) {
        appliedCoupon = coupon;
        if (coupon.type === "percentage") {
          const raw = (subtotal * coupon.value) / 100;
          discountAmount = coupon.max_discount ? Math.min(raw, coupon.max_discount) : raw;
        } else if (coupon.type === "fixed") {
          discountAmount = Math.min(coupon.value, subtotal);
        } else if (coupon.type === "free_shipping") {
          // Free shipping handles the delivery fee
        }
      }
    }

    // 3. Shipping Charge
    const isFreeShipping =
      appliedCoupon?.type === "free_shipping" ||
      (input.customer.district.toLowerCase().includes("dhaka") && subtotal >= 2500) ||
      subtotal >= 3500;

    const shippingAmount = isFreeShipping ? 0 : input.shipping.amount;
    const total = Math.max(0, subtotal - discountAmount + shippingAmount);

    // 4. Generate Order Number: ORD-2026-XXXXXX
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ORD-2026-${randomSuffix}`;

    // 5. Insert Order
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user?.id || null,
        guest_name: input.customer.name,
        guest_phone: input.customer.phone,
        guest_email: input.customer.email || null,
        is_guest: !user,
        subtotal,
        discount_amount: discountAmount,
        shipping_amount: shippingAmount,
        tax_amount: 0,
        total,
        payment_method: "cod",
        payment_status: "pending",
        shipping_method: input.shipping.method,
        shipping_address_snapshot: {
          name: input.customer.name,
          phone: input.customer.phone,
          email: input.customer.email || null,
          district: input.customer.district,
          thana: input.customer.thana,
          address: input.customer.address,
        },
        public_note: input.customer.notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (orderErr) {
      console.error("Order creation failed:", orderErr);
      return { error: `Failed to place order: ${orderErr.message}` };
    }

    // 6. Insert Order Items
    const itemsToInsert = validatedItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    await supabaseAdmin.from("order_items").insert(itemsToInsert);

    // 7. Insert Initial Status History
    await supabaseAdmin.from("order_status_history").insert({
      order_id: order.id,
      status: "pending",
      note: "Order placed via website with Cash on Delivery",
      created_by: user?.id || null,
    });

    // 8. Update Coupon Usage if applicable
    if (appliedCoupon) {
      await supabaseAdmin.from("coupon_usage").insert({
        coupon_id: appliedCoupon.id,
        user_id: user?.id || null,
        order_id: order.id,
        discount_amount: discountAmount,
      });

      await supabaseAdmin
        .from("coupons")
        .update({ usage_count: (appliedCoupon.usage_count || 0) + 1 })
        .eq("id", appliedCoupon.id);
    }

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    };
  } catch (err: any) {
    console.error("Unexpected checkout error:", err);
    return { error: err.message || "An unexpected error occurred during checkout" };
  }
}

export async function getOrderById(orderId: string) {
  const supabaseAdmin = createAdminClient();

  const { data: order, error } = await supabaseAdmin
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
    .single();

  if (error || !order) return null;
  return order;
}

export async function getAdminOrders(statusFilter?: string) {
  const supabase = createAdminClient();
  let query = supabase
    .from("orders")
    .select("*, order_items(id, quantity)")
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Failed to fetch admin orders:", error);
    return [];
  }
  return data || [];
}

export async function updateOrderStatus(orderId: string, newStatus: string, note?: string) {
  const supabaseAdmin = createAdminClient();
  const supabaseUser = await createClient();
  const { data: authData } = await supabaseUser.auth.getUser();

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select()
    .single();

  if (error) return { error: error.message };

  await supabaseAdmin.from("order_status_history").insert({
    order_id: orderId,
    status: newStatus,
    note: note || `Status updated to ${newStatus}`,
    created_by: authData?.user?.id || null,
  });

  return { success: true, order: data };
}

export async function updateAdminOrderFull(orderId: string, payload: {
  status?: string;
  note?: string;
  internalNote?: string;
  payment_method?: string;
  payment_status?: string;
  shipping_amount?: number;
  discount_amount?: number;
  total?: number;
  shipping_address_snapshot?: any;
}) {
  const supabaseAdmin = createAdminClient();
  const supabaseUser = await createClient();
  const { data: authData } = await supabaseUser.auth.getUser();

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (payload.status) updateData.status = payload.status;
  if (payload.payment_method) updateData.payment_method = payload.payment_method;
  if (payload.payment_status) updateData.payment_status = payload.payment_status;
  if (payload.shipping_amount !== undefined) updateData.shipping_amount = payload.shipping_amount;
  if (payload.discount_amount !== undefined) updateData.discount_amount = payload.discount_amount;
  if (payload.total !== undefined) updateData.total = payload.total;
  if (payload.shipping_address_snapshot) updateData.shipping_address_snapshot = payload.shipping_address_snapshot;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
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
    .single();

  if (error) return { error: error.message };

  if (payload.status || payload.note) {
    await supabaseAdmin.from("order_status_history").insert({
      order_id: orderId,
      status: payload.status || data.status,
      note: payload.note || `Order modified by admin`,
      created_by: authData?.user?.id || null,
    });
  }

  return { success: true, order: data };
}

export async function trackOrder(orderNumber: string, phone: string) {
  const supabase = createAdminClient();
  const cleanNumber = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.trim();

  const { data: order, error } = await supabase
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
    .eq("order_number", cleanNumber)
    .or(`guest_phone.eq.${cleanPhone},shipping_address_snapshot->>phone.eq.${cleanPhone}`)
    .maybeSingle();

  if (error || !order) {
    return { error: "No order found matching this Order Number and Phone Number combination." };
  }

  return { order };
}
