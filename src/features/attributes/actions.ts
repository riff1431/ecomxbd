"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import { generateSlug } from "@/lib/utils";

export async function getAttributes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_attributes")
    .select("*, attribute_values(*)")
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getAttributeById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_attributes")
    .select("*, attribute_values(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createAttribute(input: {
  name: string;
  slug: string;
  type: string;
  values: Array<{ value: string; color_hex?: string }>;
}) {
  const supabase = await createClient();

  const { data: attr, error: attrError } = await supabase
    .from("product_attributes")
    .insert({ name: input.name, slug: input.slug, type: input.type })
    .select()
    .single();

  if (attrError) return { error: attrError.message };

  if (input.values.length > 0) {
    const rows = input.values.map((v, i) => ({
      attribute_id: attr.id,
      value: v.value,
      slug: generateSlug(v.value),
      color_hex: v.color_hex || null,
      sort_order: i,
    }));

    const { error: valError } = await supabase.from("attribute_values").insert(rows);
    if (valError) return { error: valError.message };
  }

  await logActivity({ action: "attribute.create", targetType: "product_attribute", targetId: attr.id });
  revalidatePath("/admin/attributes");
  return { data: attr };
}

export async function updateAttribute(
  id: string,
  input: {
    name: string;
    slug: string;
    type: string;
    values: Array<{ id?: string; value: string; color_hex?: string }>;
  }
) {
  const supabase = await createClient();

  const { error: attrError } = await supabase
    .from("product_attributes")
    .update({ name: input.name, slug: input.slug, type: input.type })
    .eq("id", id);

  if (attrError) return { error: attrError.message };

  // Delete existing values and re-insert
  await supabase.from("attribute_values").delete().eq("attribute_id", id);

  if (input.values.length > 0) {
    const rows = input.values.map((v, i) => ({
      attribute_id: id,
      value: v.value,
      slug: generateSlug(v.value),
      color_hex: v.color_hex || null,
      sort_order: i,
    }));

    const { error: valError } = await supabase.from("attribute_values").insert(rows);
    if (valError) return { error: valError.message };
  }

  await logActivity({ action: "attribute.update", targetType: "product_attribute", targetId: id });
  revalidatePath("/admin/attributes");
  return { success: true };
}

export async function deleteAttribute(id: string) {
  const supabase = await createClient();

  // Check usage in variants
  const { count } = await supabase
    .from("variant_attribute_values")
    .select("*, attribute_values!inner(attribute_id)", { count: "exact", head: true })
    .eq("attribute_values.attribute_id", id);

  if (count && count > 0) {
    return { error: `Cannot delete: this attribute is used in ${count} product variant(s).` };
  }

  await supabase.from("attribute_values").delete().eq("attribute_id", id);
  const { error } = await supabase.from("product_attributes").delete().eq("id", id);
  if (error) return { error: error.message };

  await logActivity({ action: "attribute.delete", targetType: "product_attribute", targetId: id });
  revalidatePath("/admin/attributes");
  return { success: true };
}
