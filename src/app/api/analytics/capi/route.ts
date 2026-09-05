import { NextRequest, NextResponse } from "next/server";
import { sendMetaCapiEvent } from "@/features/marketing/meta-actions";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      eventName,
      eventId,
      eventSourceUrl,
      userData = {},
      customData = {},
      testEventCode,
    } = body;

    if (!eventName || !eventId) {
      return NextResponse.json(
        { success: false, error: "Missing required eventName or eventId" },
        { status: 400 }
      );
    }

    // Automatically capture client IP and user-agent from request headers if not provided
    const clientIpAddress =
      userData.clientIpAddress ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined;

    const clientUserAgent =
      userData.clientUserAgent ||
      req.headers.get("user-agent") ||
      undefined;

    // Automatically read Meta cookies (_fbp, _fbc) from request cookies
    const fbp = userData.fbp || req.cookies.get("_fbp")?.value || undefined;
    const fbc = userData.fbc || req.cookies.get("_fbc")?.value || undefined;

    const enrichedUserData = {
      ...userData,
      clientIpAddress,
      clientUserAgent,
      fbp,
      fbc,
    };

    const result = await sendMetaCapiEvent({
      eventName,
      eventId,
      eventSourceUrl: eventSourceUrl || req.headers.get("referer") || undefined,
      userData: enrichedUserData,
      customData,
      testEventCode,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[CAPI Route Error]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
