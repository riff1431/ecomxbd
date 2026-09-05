import { NextRequest, NextResponse } from "next/server";
import { sendTikTokCapiEvent } from "@/features/marketing/tiktok-actions";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      eventName,
      eventId,
      eventSourceUrl,
      userData = {},
      properties = {},
      testEventCode,
    } = body;

    if (!eventName || !eventId) {
      return NextResponse.json(
        { success: false, error: "Missing required eventName or eventId" },
        { status: 400 }
      );
    }

    // Capture client IP and User Agent
    const clientIpAddress =
      userData.clientIpAddress ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined;

    const clientUserAgent =
      userData.clientUserAgent ||
      req.headers.get("user-agent") ||
      undefined;

    // Capture TikTok cookies (_ttp, ttclid)
    const ttp = userData.ttp || req.cookies.get("_ttp")?.value || undefined;
    const ttclid = userData.ttclid || req.cookies.get("ttclid")?.value || undefined;

    const enrichedUserData = {
      ...userData,
      clientIpAddress,
      clientUserAgent,
      ttp,
      ttclid,
    };

    const result = await sendTikTokCapiEvent({
      eventName,
      eventId,
      eventSourceUrl: eventSourceUrl || req.headers.get("referer") || undefined,
      userData: enrichedUserData,
      properties,
      testEventCode,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[TikTok Route Error]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
