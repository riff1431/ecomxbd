"use server";

import { getSettingsByGroup, updateGroupSettings } from "@/lib/settings/config-service";
import { revalidatePath } from "next/cache";

export interface CheckoutAndFraudSettings {
  // Dynamic Delivery Charges (BDT)
  inside_dhaka_rate: number;
  sub_dhaka_rate: number;
  outside_dhaka_rate: number;
  free_shipping_threshold: number;
  enable_free_shipping_meter: boolean;

  // Anti-Fraud & Risk Protection
  enable_cod_otp: boolean;
  cod_otp_threshold: number; // Trigger OTP for COD orders exceeding this BDT amount
  enable_duplicate_blocker: boolean;
  duplicate_window_minutes: number;

  // Abandoned Cart Capture
  enable_abandoned_cart_capture: boolean;
  abandoned_cart_recovery_hours: number;
  abandoned_cart_discount_code?: string;
}

const DEFAULT_SETTINGS: CheckoutAndFraudSettings = {
  inside_dhaka_rate: 70,
  sub_dhaka_rate: 100,
  outside_dhaka_rate: 130,
  free_shipping_threshold: 2500,
  enable_free_shipping_meter: true,

  enable_cod_otp: true,
  cod_otp_threshold: 3000,
  enable_duplicate_blocker: true,
  duplicate_window_minutes: 5,

  enable_abandoned_cart_capture: true,
  abandoned_cart_recovery_hours: 2,
  abandoned_cart_discount_code: "SAVE5",
};

/**
 * Fetch checkout and anti-fraud settings from database
 */
export async function getCheckoutAndFraudSettings(): Promise<CheckoutAndFraudSettings> {
  try {
    const data = await getSettingsByGroup("checkout_fraud");
    return {
      inside_dhaka_rate: Number(data.inside_dhaka_rate ?? DEFAULT_SETTINGS.inside_dhaka_rate),
      sub_dhaka_rate: Number(data.sub_dhaka_rate ?? DEFAULT_SETTINGS.sub_dhaka_rate),
      outside_dhaka_rate: Number(data.outside_dhaka_rate ?? DEFAULT_SETTINGS.outside_dhaka_rate),
      free_shipping_threshold: Number(data.free_shipping_threshold ?? DEFAULT_SETTINGS.free_shipping_threshold),
      enable_free_shipping_meter: data.enable_free_shipping_meter !== false,

      enable_cod_otp: data.enable_cod_otp !== false,
      cod_otp_threshold: Number(data.cod_otp_threshold ?? DEFAULT_SETTINGS.cod_otp_threshold),
      enable_duplicate_blocker: data.enable_duplicate_blocker !== false,
      duplicate_window_minutes: Number(data.duplicate_window_minutes ?? DEFAULT_SETTINGS.duplicate_window_minutes),

      enable_abandoned_cart_capture: data.enable_abandoned_cart_capture !== false,
      abandoned_cart_recovery_hours: Number(data.abandoned_cart_recovery_hours ?? DEFAULT_SETTINGS.abandoned_cart_recovery_hours),
      abandoned_cart_discount_code: data.abandoned_cart_discount_code || DEFAULT_SETTINGS.abandoned_cart_discount_code,
    };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save checkout & anti-fraud settings to database
 */
export async function saveCheckoutAndFraudSettings(settings: Partial<CheckoutAndFraudSettings>) {
  await updateGroupSettings("checkout_fraud", settings as Record<string, any>);
  revalidatePath("/checkout");
  revalidatePath("/admin/settings/checkout");
  return { success: true };
}
