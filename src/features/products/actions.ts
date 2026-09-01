"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";

export async function getProducts(filters?: {
  status?: string;
  brand_id?: string;
  category_id?: string;
  search?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, brands(name), inventory(on_hand, available)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.brand_id) query = query.eq("brand_id", filters.brand_id);
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      brands(id, name),
      product_categories(category_id, categories(id, name)),
      product_tags(tag_id, tags(id, name)),
      product_variants(*, variant_attribute_values(attribute_value_id, attribute_values(id, value, color_hex, attribute_id, product_attributes(name)))),
      product_media(*, media(*)),
      inventory(*)
    `)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createProduct(input: {
  product: Record<string, unknown>;
  category_ids?: string[];
  tag_names?: string[];
  variants?: Array<{
    sku?: string;
    regular_price?: number;
    sale_price?: number;
    cost_price?: number;
    weight?: number;
    image_url?: string;
    status: string;
    attribute_value_ids: string[];
  }>;
  initial_stock?: number;
}) {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Insert product
  const { data: product, error: prodError } = await supabase
    .from("products")
    .insert({ ...input.product, created_by: user?.id, updated_by: user?.id })
    .select()
    .single();

  if (prodError) return { error: prodError.message };

  // Assign categories
  if (input.category_ids?.length) {
    const { error: catError } = await supabase.from("product_categories").insert(
      input.category_ids.map((cid) => ({ product_id: product.id, category_id: cid }))
    );
    if (catError) return { error: catError.message };
  }

  // Create or find tags
  if (input.tag_names?.length) {
    for (const tagName of input.tag_names) {
      const slug = tagName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      let tagId: string;

      const { data: existing } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existing) {
        tagId = existing.id;
      } else {
        const { data: newTag, error: tagErr } = await supabase
          .from("tags")
          .insert({ name: tagName, slug })
          .select("id")
          .single();
        if (tagErr) continue;
        tagId = newTag.id;
      }

      await supabase.from("product_tags").insert({ product_id: product.id, tag_id: tagId });
    }
  }

  // Create variants (for variable products)
  if (input.variants?.length) {
    for (const variant of input.variants) {
      const { attribute_value_ids, ...variantData } = variant;
      const { data: v, error: vErr } = await supabase
        .from("product_variants")
        .insert({ ...variantData, product_id: product.id })
        .select()
        .single();

      if (vErr) continue;

      // Assign attribute values
      if (attribute_value_ids.length) {
        await supabase.from("variant_attribute_values").insert(
          attribute_value_ids.map((avid) => ({
            variant_id: v.id,
            attribute_value_id: avid,
          }))
        );
      }

      // Create inventory for variant
      await supabase.from("inventory").insert({
        product_id: product.id,
        variant_id: v.id,
        on_hand: 0,
        reserved: 0,
        available: 0,
        low_stock_threshold: 5,
      });
    }
  } else {
    // Create inventory for simple product
    const stock = input.initial_stock ?? 0;
    await supabase.from("inventory").insert({
      product_id: product.id,
      variant_id: null,
      on_hand: stock,
      reserved: 0,
      available: stock,
      low_stock_threshold: 5,
    });
  }

  await logActivity({
    action: "product.create",
    targetType: "product",
    targetId: product.id,
    afterData: product as unknown as Record<string, unknown>,
  });

  revalidatePath("/admin/products");
  return { data: product };
}

export async function updateProduct(
  id: string,
  input: {
    product: Record<string, unknown>;
    category_ids?: string[];
    tag_names?: string[];
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: product, error } = await supabase
    .from("products")
    .update({ ...input.product, updated_by: user?.id })
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: error.message };

  // Sync categories
  if (input.category_ids) {
    await supabase.from("product_categories").delete().eq("product_id", id);
    if (input.category_ids.length) {
      await supabase.from("product_categories").insert(
        input.category_ids.map((cid) => ({ product_id: id, category_id: cid }))
      );
    }
  }

  // Sync tags
  if (input.tag_names) {
    await supabase.from("product_tags").delete().eq("product_id", id);
    for (const tagName of input.tag_names) {
      const slug = tagName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      let tagId: string;

      const { data: existing } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existing) {
        tagId = existing.id;
      } else {
        const { data: newTag, error: tagErr } = await supabase
          .from("tags")
          .insert({ name: tagName, slug })
          .select("id")
          .single();
        if (tagErr) continue;
        tagId = newTag.id;
      }

      await supabase.from("product_tags").insert({ product_id: id, tag_id: tagId });
    }
  }

  await logActivity({
    action: "product.update",
    targetType: "product",
    targetId: id,
    afterData: product as unknown as Record<string, unknown>,
  });

  revalidatePath("/admin/products");
  return { data: product };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  // Soft delete
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("id", id);

  if (error) return { error: error.message };

  await logActivity({ action: "product.delete", targetType: "product", targetId: id });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function bulkUpdateProductStatus(ids: string[], status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ status })
    .in("id", ids);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  return { success: true };
}
