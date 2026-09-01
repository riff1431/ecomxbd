"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { logActivity } from "@/services/activity-log";

export async function getMedia(filters?: {
  folder?: string;
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("media")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filters?.folder) {
    query = query.eq("folder", filters.folder);
  }

  if (filters?.search) {
    query = query.or(`alt_text.ilike.%${filters.search}%,public_id.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function saveMediaRecord(input: {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
  folder?: string;
  alt_text?: string;
  caption?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("media")
    .insert({
      public_id: input.public_id,
      secure_url: input.secure_url,
      resource_type: input.resource_type || "image",
      format: input.format,
      width: input.width || null,
      height: input.height || null,
      bytes: input.bytes || null,
      folder: input.folder || "general",
      alt_text: input.alt_text || null,
      caption: input.caption || null,
      created_by: user?.id || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  await logActivity({
    action: "media.upload",
    targetType: "media",
    targetId: data.id,
    afterData: { public_id: input.public_id, url: input.secure_url },
  });

  revalidatePath("/admin/media");
  return { data };
}

export async function updateMediaMetadata(
  id: string,
  input: { alt_text?: string; caption?: string }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media")
    .update({
      alt_text: input.alt_text || null,
      caption: input.caption || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/media");
  return { data };
}

export async function deleteMediaRecord(id: string, public_id: string) {
  const supabase = await createClient();

  // Try to delete from Cloudinary
  try {
    await deleteCloudinaryAsset(public_id);
  } catch (cloudErr) {
    console.warn("Could not delete from Cloudinary:", cloudErr);
  }

  // Soft delete in database
  const { error } = await supabase
    .from("media")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logActivity({
    action: "media.delete",
    targetType: "media",
    targetId: id,
    beforeData: { public_id },
  });

  revalidatePath("/admin/media");
  return { success: true };
}
