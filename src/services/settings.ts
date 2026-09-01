import { createClient } from "@/lib/supabase/server";
import type { Setting } from "@/types";

/**
 * Get all settings for a group.
 */
export async function getSettingsByGroup(group: string): Promise<Setting[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("group", group)
    .order("key");

  if (error) throw error;
  return data || [];
}

/**
 * Get a single setting value. Returns the typed value.
 */
export async function getSetting(
  group: string,
  key: string
): Promise<string | number | boolean | Record<string, unknown> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("value, type")
    .eq("group", group)
    .eq("key", key)
    .single();

  if (error || !data) return null;

  switch (data.type) {
    case "number":
      return Number(data.value);
    case "boolean":
      return data.value === "true";
    case "json":
      try {
        return JSON.parse(data.value);
      } catch {
        return data.value;
      }
    default:
      return data.value;
  }
}

/**
 * Update a setting value.
 */
export async function updateSetting(
  group: string,
  key: string,
  value: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("group", group)
    .eq("key", key);

  if (error) throw error;
}

/**
 * Bulk update settings.
 */
export async function updateSettings(
  settings: { group: string; key: string; value: string }[]
): Promise<void> {
  const supabase = await createClient();
  for (const setting of settings) {
    const { error } = await supabase
      .from("settings")
      .update({ value: setting.value, updated_at: new Date().toISOString() })
      .eq("group", setting.group)
      .eq("key", setting.key);

    if (error) throw error;
  }
}
