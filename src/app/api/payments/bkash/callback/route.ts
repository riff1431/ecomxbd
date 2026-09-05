import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { executeBkashPayment, queryBkashPayment } from "@/lib/payments/bkash";
import { logIntegrationEvent } from "@/features/modules/actions";
import { getBaseUrl } from "@/lib/utils";

/**
 * bKash Redirect & Callback Handler
 * Handles both GET (customer browser redirect from bKash PGW)
 * and POST (server-to-server IPN webhook).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status"); // "success" | "failure" | "cancel"
  const baseUrl = getBaseUrl();

  if (!paymentID || !status) {
    return NextResponse.redirect(`${baseUrl}/checkout?error=Invalid bKash callback parameters`);
  }

  // Handle Cancellation or Failure from customer screen
  if (status === "cancel") {
    await logIntegrationEvent({
      provider: "BKASH",
      moduleKey: "bkash",
      event: "payment_cancelled",
      status: "error",
      message: `Customer cancelled bKash payment session. PaymentID: ${paymentID}`,
      metadata: { paymentID, status },
    });
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=bKash payment was cancelled. You can complete your order using Cash on Delivery or retry.`
    );
  }

  if (status === "failure") {
    await logIntegrationEvent({
      provider: "BKASH",
      moduleKey: "bkash",
      event: "payment_failed",
      status: "error",
      message: `bKash payment failed for PaymentID: ${paymentID}`,
      metadata: { paymentID, status },
    });
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=bKash payment failed. Please check your wallet balance or try again.`
    );
  }

  if (status === "success") {
    try {
      // Step 3: Execute Payment with bKash API
      const execRes = await executeBkashPayment(paymentID);

      if (!execRes.success || !execRes.trxID) {
        await logIntegrationEvent({
          provider: "BKASH",
          moduleKey: "bkash",
          event: "execute_failed",
          status: "error",
          message: `bKash payment execution failed for PaymentID: ${paymentID}: ${execRes.error || execRes.statusMessage}`,
          metadata: { paymentID, error: execRes.error, raw: execRes.raw },
        });

        return NextResponse.redirect(
          `${baseUrl}/checkout?error=${encodeURIComponent(
            execRes.error || "Payment verification failed with bKash."
          )}`
        );
      }

      // Step 4: Locate Order & Update in Database
      const supabase = createAdminClient();
      const invoiceNumber = execRes.raw?.merchantInvoiceNumber;

      let order: any = null;

      if (invoiceNumber) {
        const { data: foundByInvoice } = await supabase
          .from("orders")
          .select("id, order_number, total, payment_status")
          .eq("order_number", invoiceNumber)
          .maybeSingle();
        order = foundByInvoice;
      }

      // Fallback: search by recent order history note containing paymentID
      if (!order) {
        const { data: history } = await supabase
          .from("order_status_history")
          .select("order_id")
          .ilike("note", `%${paymentID}%`)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (history?.order_id) {
          const { data: foundById } = await supabase
            .from("orders")
            .select("id, order_number, total, payment_status")
            .eq("id", history.order_id)
            .maybeSingle();
          order = foundById;
        }
      }

      if (order) {
        // Update order status to paid and processing
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "processing",
            public_note: `Paid via bKash Online. TrxID: ${execRes.trxID}, Customer Wallet: ${execRes.customerMsisdn || "N/A"}`,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        // Record successful execution in order status history
        await supabase.from("order_status_history").insert({
          order_id: order.id,
          status: "processing",
          note: `bKash Payment Verified & Completed. TrxID: ${execRes.trxID}, Amount: BDT ${execRes.amount}, Wallet: ${execRes.customerMsisdn || "N/A"}`,
        });

        await logIntegrationEvent({
          provider: "BKASH",
          moduleKey: "bkash",
          event: "payment_completed",
          status: "success",
          message: `bKash Payment Completed for Order ${order.order_number}. TrxID: ${execRes.trxID}, Amount: BDT ${execRes.amount}`,
          metadata: { orderId: order.id, trxID: execRes.trxID, paymentID, raw: execRes.raw },
        });

        return NextResponse.redirect(
          `${baseUrl}/orders/${order.id}/confirmation?payment=success&trxID=${execRes.trxID}`
        );
      }

      // If order couldn't be matched directly, redirect to orders confirmation with payment info
      return NextResponse.redirect(
        `${baseUrl}/orders?payment=success&trxID=${execRes.trxID}&paymentID=${paymentID}`
      );
    } catch (err: any) {
      console.error("Error in bKash callback:", err);
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=${encodeURIComponent(err.message || "Payment execution failed")}`
      );
    }
  }

  return NextResponse.redirect(`${baseUrl}/checkout?error=Unknown payment status from bKash`);
}

/**
 * Server-to-server IPN / Webhook Handler (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { paymentID, trxID, status, amount } = body;

    await logIntegrationEvent({
      provider: "BKASH",
      moduleKey: "bkash",
      event: "webhook_received",
      status: status === "Completed" ? "success" : "error",
      message: `bKash Webhook IPN Notification: PaymentID: ${paymentID || "N/A"}, TrxID: ${trxID || "N/A"}, Status: ${status || "PENDING"}`,
      metadata: body,
    });

    if (paymentID && status === "Completed") {
      const supabase = createAdminClient();
      const queryRes = await queryBkashPayment(paymentID);

      if (queryRes?.payment?.merchantInvoiceNumber) {
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "processing",
            updated_at: new Date().toISOString(),
          })
          .eq("order_number", queryRes.payment.merchantInvoiceNumber);
      }
    }

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
