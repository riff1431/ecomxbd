import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, any> = {
    app: { status: "healthy", timestamp: new Date().toISOString() },
    database: { status: "unknown" },
    storage: { status: "unknown" },
  };

  // 1. Supabase Database connectivity check
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").select("id").limit(1);
    if (error) {
      checks.database = { status: "degraded", error: error.message };
    } else {
      checks.database = { status: "healthy" };
    }
  } catch (e: any) {
    checks.database = { status: "unhealthy", error: e.message };
  }

  // 2. Cloudinary storage config check
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (cloudName) {
    checks.storage = { status: "healthy", cloud_name: cloudName };
  } else {
    checks.storage = { status: "unconfigured" };
  }

  const responseTime = `${Date.now() - startTime}ms`;
  const isAllHealthy = Object.values(checks).every(
    (c: any) => c.status === "healthy"
  );

  return NextResponse.json(
    {
      status: isAllHealthy ? "ok" : "degraded",
      response_time: responseTime,
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      checks,
    },
    { status: isAllHealthy ? 200 : 503 }
  );
}
