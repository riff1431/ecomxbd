import { createClient } from "@/lib/supabase/server";

interface LogActivityParams {
  action: string;
  targetType: string;
  targetId?: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

/**
 * Log an admin activity event.
 * Should be called from server actions / API routes only.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action: params.action,
      target_type: params.targetType,
      target_id: params.targetId || null,
      before_data: params.beforeData || null,
      after_data: params.afterData || null,
      ip: params.ip || null,
      user_agent: params.userAgent || null,
    });
  } catch (error) {
    // Activity logging should never break the main flow
    console.error("Failed to log activity:", error);
  }
}
