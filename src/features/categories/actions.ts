"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categorySchema, type CategoryFormData } from "@/validators";
import { logActivity } from "@/services/activity-log";

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getCategoryById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createCategory(formData: CategoryFormData) {
  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (existing) {
    return { error: { slug: ["This slug is already in use"] } };
  }

  const { data, error } = await supabase
    .from("categories")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return { error: { _form: [error.message] } };

  await logActivity({
    action: "category.create",
    targetType: "category",
    targetId: data.id,
    afterData: data as unknown as Record<string, unknown>,
  });

  revalidatePath("/admin/categories");
  return { data };
}

export async function updateCategory(id: string, formData: CategoryFormData) {
  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  // Check slug uniqueness excluding self
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", parsed.data.slug)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return { error: { slug: ["This slug is already in use"] } };
  }

  const { data: before } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: { _form: [error.message] } };

  await logActivity({
    action: "category.update",
    targetType: "category",
    targetId: id,
    beforeData: before as unknown as Record<string, unknown>,
    afterData: data as unknown as Record<string, unknown>,
  });

  revalidatePath("/admin/categories");
  return { data };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  // Check if products are assigned
  const { count } = await supabase
    .from("product_categories")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return { error: `Cannot delete: ${count} product(s) are assigned to this category.` };
  }

  // Check for child categories
  const { count: childCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true })
    .eq("parent_id", id);

  if (childCount && childCount > 0) {
    return { error: `Cannot delete: ${childCount} child category/categories exist.` };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return { error: error.message };

  await logActivity({
    action: "category.delete",
    targetType: "category",
    targetId: id,
  });

  revalidatePath("/admin/categories");
  return { success: true };
}
