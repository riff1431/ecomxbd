"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCheckoutAndFraudSettings } from "@/features/settings/checkout-settings-actions";

export interface AbandonedCartPayload {
  customer_name: string;
  phone: string;
  email?: string;
  division?: string;
  district?: string;
  thana?: string;
  address?: string;
  cart_items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    image_url?: string;
  }[];
  subtotal: number;
}

/**
 * Capture customer checkout data in real time as they type
 */
export async function captureAbandonedCart(payload: AbandonedCartPayload) {
  const settings = await getCheckoutAndFraudSettings();
  if (!settings.enable_abandoned_cart_capture) return { skipped: true };

  const cleanPhone = payload.phone.replace(/\D/g, "");
  if (cleanPhone.length < 10) return { skipped: true }; // Only capture when phone is nearly complete

  const supabase = createAdminClient();

  try {
    const { error } = await supabase.from("incomplete_orders").upsert(
      {
        phone: cleanPhone,
        customer_name: payload.customer_name || "Shopper",
        email: payload.email || null,
        shipping_division: payload.division || null,
        shipping_district: payload.district || null,
        shipping_thana: payload.thana || null,
        shipping_address: payload.address || null,
        cart_items: payload.cart_items,
        cart_total: payload.subtotal,
        last_active_at: new Date().toISOString(),
        status: "abandoned",
      },
      { onConflict: "phone" }
    );

    if (error) {
      console.warn("[Abandoned Cart Capture Note]", error.message);
    }

    return { success: true };
  } catch (e) {
    return { skipped: true };
  }
}
