"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendSmsNotification } from "@/features/sms/actions";

export interface RiskEvaluation {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  isBlacklisted: boolean;
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

// In-memory initial blacklist & monitored accounts
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
    blacklist_reason: "Repeated fake COD orders and courier doorstep rejection across Dhaka",
    notes: "Courier SteadFast returned parcel 4 times with 'Customer Unreachable'",
    updated_at: new Date().toISOString(),
  },
  {
    id: "fp-2",
    identifier_type: "phone",
    identifier_value: "01888888888",
    risk_score: 65,
    cancellation_count: 2,
    rejected_delivery_count: 1,
    return_abuse_count: 0,
    is_blacklisted: false,
    blacklist_reason: "",
    notes: "Requires phone verification before parcel booking",
    updated_at: new Date().toISOString(),
  },
];

let memoryAbandonedCheckouts = [
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
    last_active_at: new Date(Date.now() - 3600000).toISOString(),
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
    last_active_at: new Date(Date.now() - 14400000).toISOString(),
  },
];

export async function evaluateOrderRisk({
  phone,
  district,
  total,
  paymentMethod,
}: {
  phone: string;
  district: string;
  total: number;
  paymentMethod: string;
}): Promise<RiskEvaluation> {
  const reasons: string[] = [];
  let score = 5; // Baseline low risk

  // Check blacklist
  const profile = memoryFraudProfiles.find(
    (p) => p.identifier_value === phone.trim()
  );

  if (profile) {
    if (profile.is_blacklisted) {
      return {
        riskScore: 100,
        riskLevel: "critical",
        isBlacklisted: true,
        reasons: [`Phone number is Blacklisted: ${profile.blacklist_reason}`],
        recommendedAction: "block",
      };
    }
    score += profile.risk_score * 0.7;
    if (profile.rejected_delivery_count > 0) {
      reasons.push(`${profile.rejected_delivery_count} previous rejected courier deliveries`);
    }
    if (profile.cancellation_count > 0) {
      reasons.push(`${profile.cancellation_count} previous cancelled orders`);
    }
  }

  // High total value COD order risk
  if (paymentMethod === "cod" && total > 5000) {
    score += 25;
    reasons.push("High-value COD order over ৳5,000");
  }

  // Normalize score
  score = Math.min(100, Math.max(0, Math.round(score)));

  let riskLevel: "low" | "medium" | "high" | "critical" = "low";
  let recommendedAction: "allow" | "flag" | "require_advance" | "block" = "allow";

  if (score >= 80) {
    riskLevel = "critical";
    recommendedAction = "block";
  } else if (score >= 60) {
    riskLevel = "high";
    recommendedAction = "require_advance";
  } else if (score >= 30) {
    riskLevel = "medium";
    recommendedAction = "flag";
  }

  return {
    riskScore: score,
    riskLevel,
    isBlacklisted: false,
    reasons: reasons.length > 0 ? reasons : ["Normal verified customer activity"],
    recommendedAction,
  };
}

export async function getFraudProfiles(): Promise<FraudProfile[]> {
  const supabase = createAdminClient();
  try {
    const { data } = await supabase.from("fraud_profiles").select("*");
    if (data && data.length > 0) return data;
  } catch (e) {}
  return memoryFraudProfiles;
}

export async function toggleBlacklistStatus(
  identifierValue: string,
  isBlacklisted: boolean,
  reason?: string
) {
  const supabase = createAdminClient();
  try {
    await supabase.from("fraud_profiles").upsert(
      {
        identifier_type: "phone",
        identifier_value: identifierValue,
        is_blacklisted: isBlacklisted,
        blacklist_reason: reason || "Flagged by Admin",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "identifier_type, identifier_value" }
    );
  } catch (e) {}

  // Update memory
  const idx = memoryFraudProfiles.findIndex((p) => p.identifier_value === identifierValue);
  if (idx !== -1) {
    memoryFraudProfiles[idx].is_blacklisted = isBlacklisted;
    if (reason) memoryFraudProfiles[idx].blacklist_reason = reason;
  } else {
    memoryFraudProfiles.push({
      id: `fp-${Date.now()}`,
      identifier_type: "phone",
      identifier_value: identifierValue,
      risk_score: isBlacklisted ? 90 : 10,
      cancellation_count: 0,
      rejected_delivery_count: 0,
      return_abuse_count: 0,
      is_blacklisted: isBlacklisted,
      blacklist_reason: reason || "Manual entry",
      updated_at: new Date().toISOString(),
    });
  }

  return { success: true };
}

export async function getAbandonedCheckouts() {
  const supabase = createAdminClient();
  try {
    const { data } = await supabase.from("abandoned_checkouts").select("*");
    if (data && data.length > 0) return data;
  } catch (e) {}
  return memoryAbandonedCheckouts;
}

export async function sendAbandonedRecoverySms(checkoutId: string) {
  const checkout = memoryAbandonedCheckouts.find((c) => c.id === checkoutId);
  if (!checkout) return { error: "Checkout record not found" };

  checkout.recovery_status = "sms_sent";

  // Dispatch recovery SMS
  await sendSmsNotification({
    recipientPhone: checkout.customer_phone,
    eventType: "flash_promo",
    variables: {
      customer_name: checkout.customer_name,
      promo_code: "RECOVER5",
    },
  });

  return { success: true };
}
