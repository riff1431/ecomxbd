import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logIntegrationEvent } from "@/features/modules/actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { paymentID, trxID, status, amount } = body;

    await logIntegrationEvent({
      provider: "BKASH",
      moduleKey: "bkash",
      event: "webhook_received",
      status: status === "Completed" ? "success" : "error",
      message: `bKash Callback Received: PaymentID: ${paymentID || "N/A"}, TrxID: ${trxID || "N/A"}, Status: ${status || "PENDING"}`,
      metadata: body,
    });

    return NextResponse.json({
      status: "success",
      message: "bKash IPN callback processed successfully",
      receivedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message || "Failed to process bKash callback" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    gateway: "bKash Tokenized Payment Gateway",
    endpoint: "IPN / Callback Handler",
    status: "active",
    ready: true,
  });
}
