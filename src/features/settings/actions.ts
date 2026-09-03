"use server";

import { getSettingsByGroup, updateGroupSettings } from "@/lib/settings/config-service";
import { revalidatePath } from "next/cache";

// Store Settings
export async function getStoreSettings() {
  return getSettingsByGroup("general");
}

export async function saveStoreSettings(settings: {
  store_name: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
}) {
  await updateGroupSettings("general", settings);
  revalidatePath("/admin/settings/store");
  revalidatePath("/");
  return { success: true };
}

// SEO Settings
export async function getSeoSettings() {
  return getSettingsByGroup("seo");
}

export async function saveSeoSettings(settings: {
  meta_title: string;
  meta_description: string;
  og_image_url?: string;
  canonical_url?: string;
  twitter_handle?: string;
}) {
  await updateGroupSettings("seo", settings);
  revalidatePath("/admin/settings/seo");
  revalidatePath("/");
  return { success: true };
}

// Checkout & Customer Settings
export async function getCheckoutSettings() {
  return getSettingsByGroup("checkout");
}

export async function saveCheckoutSettings(settings: {
  guest_checkout_enabled?: boolean;
  allow_customer_registration?: boolean;
  cod_enabled?: boolean;
  cod_max_amount?: number;
  min_order_amount?: number;
  require_phone?: boolean;
  require_email?: boolean;
  order_notes_enabled?: boolean;
}) {
  await updateGroupSettings("checkout", settings);
  revalidatePath("/admin/settings/checkout");
  revalidatePath("/checkout");
  revalidatePath("/login");
  revalidatePath("/register");
  return { success: true };
}
