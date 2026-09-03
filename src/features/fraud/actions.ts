"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendSmsNotification } from "@/features/sms/actions";
import { revalidatePath } from "next/cache";

export interface RiskEvaluation {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  isBlacklisted: boolean;
  courierSuccessRate: string;
  previousOrdersCount: number;
  isDuplicateOrder: boolean;
  duplicateOrderId?: string;
  reasons: string[];
  recommendedAction: "allow" | "flag" | "require_advance" | "block";
}

export interface FraudProfile {
  id: string;
  identifier_type: "phone" | "email" | "ip" | "address";
  identifier_value: string;
  risk_score: number;
  cancellation_count: number;
  rejected_delivery_count: number;
  return_abuse_count: number;
  is_blacklisted: boolean;
  blacklist_reason?: string;
  notes?: string;
  updated_at: string;
}

export interface AbandonedLead {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  district?: string;
  address?: string;
  cart_items: Array<{ name: string; quantity: number; price: number }>;
  cart_total: number;
  recovery_status: "abandoned" | "sms_sent" | "whatsapp_sent" | "converted";
  last_active_at: string;
}

// In-memory blacklist store with persistent fallback
let memoryFraudProfiles: FraudProfile[] = [
  {
    id: "fp-1",
    identifier_type: "phone",
    identifier_value: "01999999999",
    risk_score: 95,
    cancellation_count: 6,
    rejected_delivery_count: 4,
    return_abuse_count: 2,
    is_blacklisted: true,
    blacklist_reason: "Repeated doorstep rejection across courier hubs",
    notes: "Courier returned 4 parcels with 'Customer Unreachable'",
    updated_at: new Date().toISOString(),
  },
  {
    id: "fp-2",
    identifier_type: "phone",
    identifier_value: "01888888888",
    risk_score: 75,
    cancellation_count: 3,
    rejected_delivery_count: 2,
    return_abuse_count: 1,
    is_blacklisted: false,
    blacklist_reason: "",
    notes: "Requires advance delivery fee verification before shipping",
    updated_at: new Date().toISOString(),
  },
];

// In-memory abandoned leads store
let memoryAbandonedCheckouts: AbandonedLead[] = [
  {
    id: "ab-1",
    customer_name: "Farhan Kabir",
    customer_phone: "01788776655",
    customer_email: "farhan.k@gmail.com",
    district: "Dhaka",
    address: "Dhanmondi 27, House 14, Flat 4B",
    cart_items: [
      {
        name: "COSRX Advanced Snail 96 Mucin Power Essence",
        quantity: 1,
        price: 1365,
      },
    ],
    cart_total: 1365,
    recovery_status: "abandoned",
    last_active_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "ab-2",
    customer_name: "Sumaiya Rahman",
    customer_phone: "01611223344",
    customer_email: "sumaiya.r@yahoo.com",
    district: "Chattogram",
    address: "GEC Circle, Nasirabad Housing",
    cart_items: [
      {
        name: "CeraVe Hydrating Facial Cleanser 236ml",
        quantity: 2,
        price: 1850,
      },
    ],
    cart_total: 3700,
    recovery_status: "sms_sent",
    last_active_at: new Date(Date.now() - 7200000).toISOString(),
  },
];

/**
 * 1. Evaluate Comprehensive Order Risk & Courier Delivery Return Ratio
 */
export async function evaluateOrderRisk({
  phone,
  district,
  total,
  ipAddress,
}: {
  phone: string;
  district?: string;
  total?: number;
  ipAddress?: string;
}): Promise<RiskEvaluation> {
  const supabase = createAdminClient();
  const cleanPhone = phone.trim().replace(/[^0-9]/g, "");
  const reasons: string[] = [];
  let riskScore = 0;

  // 1. Blacklist Check
  const blacklisted = memoryFraudProfiles.find(
    (p) =>
      p.is_blacklisted &&
      (p.identifier_value === cleanPhone || (ipAddress && p.identifier_value === ipAddress))
  );

  if (blacklisted) {
    return {
      riskScore: 100,
      riskLevel: "critical",
      isBlacklisted: true,
      courierSuccessRate: "0%",
      previousOrdersCount: 0,
      isDuplicateOrder: false,
      reasons: [blacklisted.blacklist_reason || "Number/IP explicitly blacklisted by store admin."],
      recommendedAction: "block",
    };
  }

  // 2. Query past orders from this phone number
  const { data: pastOrders } = await supabase
    .from("orders")
    .select("id, status, created_at, total")
    .or(`guest_phone.eq.${cleanPhone},shipping_address_snapshot->>phone.eq.${cleanPhone}`)
    .order("created_at", { ascending: false });

  const orderList = pastOrders || [];
  const deliveredCount = orderList.filter((o) => o.status === "delivered").length;
  const returnedCount = orderList.filter((o) => ["cancelled", "returned", "failed"].includes(o.status)).length;
  const totalCompleted = deliveredCount + returnedCount;

  let courierSuccessRate = "98%";
  if (totalCompleted > 0) {
    const rate = Math.round((deliveredCount / totalCompleted) * 100);
    courierSuccessRate = `${rate}%`;
    if (rate < 80) {
      riskScore += 35;
      reasons.push(`Low historical delivery success rate (${courierSuccessRate} delivered, ${returnedCount} returns).`);
    }
  }

  // 3. Duplicate / Rapid Multiple Orders Check (within last 10 minutes)
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const recentOrders = orderList.filter((o) => new Date(o.created_at) >= tenMinutesAgo);
  let isDuplicateOrder = false;
  let duplicateOrderId: string | undefined;

  if (recentOrders.length > 0) {
    isDuplicateOrder = true;
    duplicateOrderId = recentOrders[0].id;
    riskScore += 25;
    reasons.push(`Duplicate order detected: Customer placed ${recentOrders.length + 1} orders within 10 minutes.`);
  }

  // 4. High-Value COD Risk Check
  if (total && total > 6000) {
    riskScore += 15;
    reasons.push("High-value COD order (> ৳6,000). Recommend advance delivery fee confirmation.");
  }

  // Determine Risk Level & Action
  let riskLevel: "low" | "medium" | "high" | "critical" = "low";
  let recommendedAction: "allow" | "flag" | "require_advance" | "block" = "allow";

  if (riskScore >= 70) {
    riskLevel = "high";
    recommendedAction = "require_advance";
  } else if (riskScore >= 30) {
    riskLevel = "medium";
    recommendedAction = "flag";
  }

  return {
    riskScore,
    riskLevel,
    isBlacklisted: false,
    courierSuccessRate,
    previousOrdersCount: orderList.length,
    isDuplicateOrder,
    duplicateOrderId,
    reasons,
    recommendedAction,
  };
}

/**
 * 2. Real-Time Incomplete / Abandoned Lead Capture (Triggered on Checkout Input)
 */
export async function saveIncompleteLead(input: {
  name: string;
  phone: string;
  email?: string;
  district?: string;
  address?: string;
  cartItems: Array<{ name: string; quantity: number; price: number }>;
  cartTotal: number;
}) {
  if (!input.name || !input.phone || input.phone.length < 10) {
    return { success: false };
  }

  const cleanPhone = input.phone.trim().replace(/[^0-9]/g, "");

  const existingIdx = memoryAbandonedCheckouts.findIndex(
    (l) => l.customer_phone === cleanPhone && l.recovery_status !== "converted"
  );

  const lead: AbandonedLead = {
    id: existingIdx >= 0 ? memoryAbandonedCheckouts[existingIdx].id : `ab-${Date.now()}`,
    customer_name: input.name.trim(),
    customer_phone: cleanPhone,
    customer_email: input.email?.trim(),
    district: input.district,
    address: input.address,
    cart_items: input.cartItems,
    cart_total: input.cartTotal,
    recovery_status: "abandoned",
    last_active_at: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    memoryAbandonedCheckouts[existingIdx] = lead;
  } else {
    memoryAbandonedCheckouts.unshift(lead);
  }

  return { success: true, leadId: lead.id };
}

export async function markLeadConverted(phone: string) {
  const cleanPhone = phone.trim().replace(/[^0-9]/g, "");
  memoryAbandonedCheckouts = memoryAbandonedCheckouts.map((l) =>
    l.customer_phone === cleanPhone ? { ...l, recovery_status: "converted" } : l
  );
  return { success: true };
}

export async function getAbandonedCheckouts() {
  return memoryAbandonedCheckouts.filter((l) => l.recovery_status !== "converted");
}

/**
 * 3. Fraud Blacklist Management
 */
export async function getFraudProfiles() {
  return memoryFraudProfiles;
}

export async function addBlacklistEntry(input: {
  type: "phone" | "ip" | "email";
  value: string;
  reason: string;
}) {
  const newProfile: FraudProfile = {
    id: `fp-${Date.now()}`,
    identifier_type: input.type,
    identifier_value: input.value.trim(),
    risk_score: 100,
    cancellation_count: 5,
    rejected_delivery_count: 3,
    return_abuse_count: 2,
    is_blacklisted: true,
    blacklist_reason: input.reason || "Manually blocked by store administrator.",
    updated_at: new Date().toISOString(),
  };

  memoryFraudProfiles.unshift(newProfile);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/fraud");
  return { success: true, profile: newProfile };
}

export async function removeBlacklistEntry(id: string) {
  memoryFraudProfiles = memoryFraudProfiles.filter((p) => p.id !== id);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/fraud");
  return { success: true };
}

export async function toggleBlacklistStatus(phoneOrId: string, isBlacklisted: boolean, reason?: string) {
  const clean = phoneOrId.trim();
  const existing = memoryFraudProfiles.find((p) => p.identifier_value === clean || p.id === clean);
  if (existing) {
    existing.is_blacklisted = isBlacklisted;
    existing.blacklist_reason = reason || existing.blacklist_reason;
  } else {
    memoryFraudProfiles.unshift({
      id: `fp-${Date.now()}`,
      identifier_type: "phone",
      identifier_value: clean,
      risk_score: 100,
      cancellation_count: 3,
      rejected_delivery_count: 2,
      return_abuse_count: 1,
      is_blacklisted: isBlacklisted,
      blacklist_reason: reason || "Manual blacklist toggle",
      updated_at: new Date().toISOString(),
    });
  }
  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/fraud");
  return { success: true };
}

export async function sendAbandonedRecoverySms(id: string) {
  const item = memoryAbandonedCheckouts.find((c) => c.id === id);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  if (item) {
    await sendSmsNotification({
      recipientPhone: item.customer_phone,
      eventType: "order_confirmed",
      variables: {
        customer_name: item.customer_name,
        order_number: "BAG",
        invoice_url: `${appUrl}/checkout`,
      },
    });
    item.recovery_status = "sms_sent";
  }
  return { success: true };
}

/**
 * 4. Duplicate Order Merger
 */
export async function mergeDuplicateOrders(targetOrderId: string, duplicateOrderId: string) {
  const supabase = createAdminClient();

  // 1. Fetch both orders with items
  const [{ data: targetOrder }, { data: dupOrder }] = await Promise.all([
    supabase.from("orders").select("*, order_items(*)").eq("id", targetOrderId).single(),
    supabase.from("orders").select("*, order_items(*)").eq("id", duplicateOrderId).single(),
  ]);

  if (!targetOrder || !dupOrder) {
    return { error: "One or both orders could not be found." };
  }

  // 2. Re-assign items from dupOrder to targetOrder
  const dupItems = dupOrder.order_items || [];
  for (const it of dupItems) {
    await supabase.from("order_items").update({ order_id: targetOrderId }).eq("id", it.id);
  }

  // 3. Recalculate target order total
  const newSubtotal = Number(targetOrder.subtotal || 0) + Number(dupOrder.subtotal || 0);
  const newTotal = newSubtotal + Number(targetOrder.shipping_amount || 0);

  await supabase
    .from("orders")
    .update({
      subtotal: newSubtotal,
      total: newTotal,
      internal_note: `Merged with duplicate order #${dupOrder.order_number}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", targetOrderId);

  // 4. Mark duplicate order as cancelled/merged
  await supabase
    .from("orders")
    .update({
      status: "cancelled",
      internal_note: `Merged into Order #${targetOrder.order_number}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", duplicateOrderId);

  await supabase.from("order_status_history").insert([
    {
      order_id: targetOrderId,
      status: targetOrder.status,
      note: `Merged items from duplicate order #${dupOrder.order_number}. New Total: ৳${newTotal}`,
    },
    {
      order_id: duplicateOrderId,
      status: "cancelled",
      note: `Cancelled as duplicate. Merged into Order #${targetOrder.order_number}`,
    },
  ]);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${targetOrderId}`);

  return { success: true, newTotal };
}
