"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { getStoreFeatureSettings } from "@/features/settings/feature-settings-actions";

export async function submitReview(input: {
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
  reviewer_name?: string;
  reviewer_email?: string;
  skin_type?: string;
}) {
  const featureSettings = await getStoreFeatureSettings();
  if (featureSettings.enable_customer_reviews === false) {
    return { error: "Customer reviews are currently disabled by store management." };
  }

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  const adminClient = createAdminClient();

  // Check if user has purchased this product for verified badge
  let orderItemId: string | null = null;
  if (user) {
    const { data: orderItem } = await adminClient
      .from("order_items")
      .select("id, order_id, orders!inner(user_id)")
      .eq("product_id", input.product_id)
      .eq("orders.user_id", user.id)
      .limit(1)
      .maybeSingle();

    orderItemId = orderItem?.id || null;
  }

  const reviewStatus = featureSettings.auto_approve_reviews ? "approved" : "pending";

  const { data: review, error } = await adminClient
    .from("reviews")
    .insert({
      product_id: input.product_id,
      user_id: user?.id || null,
      order_item_id: orderItemId,
      rating: input.rating,
      title: input.title?.trim() || null,
      comment: input.comment?.trim() || null,
      status: reviewStatus,
    })
    .select()
    .single();

  if (error) {
    console.error("Review submission error:", error);
    return { error: error.message };
  }

  revalidatePath(`/products`);
  return {
    success: true,
    review: reviewStatus === "approved" ? review : null,
    pendingModeration: reviewStatus === "pending",
  };
}

export async function getProductReviews(productId: string) {
  const adminClient = createAdminClient();

  const { data: reviews, error } = await adminClient
    .from("reviews")
    .select(`
      id,
      rating,
      title,
      comment,
      admin_reply,
      created_at,
      order_item_id,
      profiles (
        full_name,
        email
      )
    `)
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return reviews || [];
}

export async function getAdminReviews() {
  const adminClient = createAdminClient();

  const { data: reviews, error } = await adminClient
    .from("reviews")
    .select(`
      id,
      rating,
      title,
      comment,
      status,
      admin_reply,
      created_at,
      products (
        id,
        name,
        slug
      ),
      profiles (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin reviews:", error);
    return [];
  }

  return reviews || [];
}

export async function moderateReview(
  reviewId: string,
  status: "approved" | "rejected" | "spam",
  adminReply?: string
) {
  const adminClient = createAdminClient();

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (adminReply !== undefined) {
    updateData.admin_reply = adminReply.trim() || null;
    updateData.admin_reply_at = adminReply.trim() ? new Date().toISOString() : null;
  }

  const { data, error } = await adminClient
    .from("reviews")
    .update(updateData)
    .eq("id", reviewId)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/reviews");
  return { success: true, review: data };
}
