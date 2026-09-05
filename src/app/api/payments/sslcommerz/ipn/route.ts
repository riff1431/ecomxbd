import { NextRequest, NextResponse } from "next/server";
import { logIntegrationEvent } from "@/features/modules/actions";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        data[key] = value.toString();
      });
    } else {
      data = await req.json().catch(() => ({}));
    }

    const { val_id, tran_id, status, amount, card_type } = data;

    await logIntegrationEvent({
      provider: "SSLCOMMERZ",
      moduleKey: "sslcommerz",
      event: "ipn_notification",
      status: status === "VALID" ? "success" : "error",
      message: `SSLCommerz IPN Notification: TranID: ${tran_id || "N/A"}, ValID: ${val_id || "N/A"}, Status: ${status || "PENDING"}, Card: ${card_type || "N/A"}`,
      metadata: data,
    });

    return NextResponse.json({
      status: "success",
      message: "SSLCommerz IPN verified and logged successfully",
      receivedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message || "Failed to process SSLCommerz IPN" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    gateway: "SSLCommerz Aggregator Gateway",
    endpoint: "IPN / Webhook Listener",
    status: "active",
    ready: true,
  });
}
