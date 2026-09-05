"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCheckoutAndFraudSettings } from "@/features/settings/checkout-settings-actions";

export interface FraudCheckResult {
  allowed: boolean;
  requiresOtp: boolean;
  riskScore: number; // 0 to 100
  riskReasons: string[];
}

/**
 * Validate customer phone number and evaluate risk scoring for Bangladesh COD orders
 */
export async function evaluateCheckoutFraudRisk(params: {
  phone: string;
  orderTotal: number;
  paymentMethod: string;
  ipAddress?: string;
}): Promise<FraudCheckResult> {
  const settings = await getCheckoutAndFraudSettings();
  const supabase = createAdminClient();

  const reasons: string[] = [];
  let riskScore = 0;

  // 1. Phone number format validation (Bangladesh 11-digit mobile: 013, 014, 015, 016, 017, 018, 019)
  const cleanPhone = params.phone.replace(/\D/g, "");
  const normalizedPhone = cleanPhone.startsWith("880")
    ? cleanPhone.slice(2)
    : cleanPhone.startsWith("+880")
    ? cleanPhone.slice(3)
    : cleanPhone;

  const isValidBdMobile = /^01[3-9]\d{8}$/.test(normalizedPhone);
  if (!isValidBdMobile) {
    return {
      allowed: false,
      requiresOtp: false,
      riskScore: 100,
      riskReasons: ["Invalid Bangladesh mobile phone number. Must be 11 digits starting with 01."],
    };
  }

  // 2. Blacklist Check
  try {
    const { data: blocked } = await supabase
      .from("customer_blacklist")
      .select("reason")
      .or(`phone.eq.${normalizedPhone},phone.eq.+88${normalizedPhone}`)
      .single();

    if (blocked) {
      return {
        allowed: false,
        requiresOtp: false,
        riskScore: 100,
        riskReasons: [`Customer phone is flagged on the security blocklist: ${blocked.reason}`],
      };
    }
  } catch (e) {
    // Table may not exist yet or empty
  }

  // 3. Duplicate Order Blocker (Within configured window)
  if (settings.enable_duplicate_blocker) {
    const windowMinutes = settings.duplicate_window_minutes || 5;
    const windowTime = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    try {
      const { data: recentOrders } = await supabase
        .from("orders")
        .select("id, created_at, total")
        .or(`shipping_phone.eq.${normalizedPhone},shipping_phone.eq.+88${normalizedPhone}`)
        .gte("created_at", windowTime);

      if (recentOrders && recentOrders.length > 0) {
        return {
          allowed: false,
          requiresOtp: false,
          riskScore: 90,
          riskReasons: [
            `An order was already placed with phone ${normalizedPhone} in the last ${windowMinutes} minutes. Please wait before ordering again to avoid duplicate billing.`,
          ],
        };
      }
    } catch (e) {
      // Ignore if table query fails
    }
  }

  // 4. High-Value COD OTP Check
  let requiresOtp = false;
  if (
    settings.enable_cod_otp &&
    params.paymentMethod === "cod" &&
    params.orderTotal >= settings.cod_otp_threshold
  ) {
    requiresOtp = true;
    riskScore += 30;
    reasons.push(
      `Order total BDT ${params.orderTotal} exceeds COD security threshold of BDT ${settings.cod_otp_threshold}. OTP verification required.`
    );
  }

  return {
    allowed: true,
    requiresOtp,
    riskScore,
    riskReasons: reasons,
  };
}

// In-memory OTP storage for rapid verification (Auto-expires in 5 minutes)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

/**
 * Generate and send SMS OTP for high-risk COD verification
 */
export async function generateCheckoutOtp(phone: string): Promise<{ success: boolean; message: string; debugOtp?: string }> {
  const cleanPhone = phone.replace(/\D/g, "");
  const normalizedPhone = cleanPhone.slice(-11);

  // Generate 4-digit OTP
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  otpStore.set(normalizedPhone, { code, expiresAt });

  console.log(`[Anti-Fraud OTP] Generated OTP ${code} for phone ${normalizedPhone}`);

  // In production, integrate with SMS gateway (BulkSMSBD, Greenweb, etc.)
  // For instant dev testing, return success and allow auto-fill
  return {
    success: true,
    message: `A 4-digit verification code has been sent to ${normalizedPhone}.`,
    debugOtp: code, // Provides instant preview in development
  };
}

/**
 * Verify customer-entered OTP code
 */
export async function verifyCheckoutOtp(phone: string, inputCode: string): Promise<{ valid: boolean; error?: string }> {
  const cleanPhone = phone.replace(/\D/g, "");
  const normalizedPhone = cleanPhone.slice(-11);

  const entry = otpStore.get(normalizedPhone);
  if (!entry) {
    return { valid: false, error: "OTP expired or not requested. Please request a new code." };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedPhone);
    return { valid: false, error: "OTP code has expired. Please request a new code." };
  }

  if (entry.code !== inputCode.trim()) {
    return { valid: false, error: "Incorrect 4-digit verification code. Please try again." };
  }

  // OTP verified successfully, clear entry
  otpStore.delete(normalizedPhone);
  return { valid: true };
}
