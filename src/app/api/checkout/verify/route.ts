import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!appId || !secretKey) {
      return NextResponse.json({ error: "Cashfree is not configured." }, { status: 503 });
    }

    const isProd = !appId.toLowerCase().includes("test") && !appId.toLowerCase().includes("sandbox");
    const cashfreeBaseUrl = isProd
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const cfRes = await fetch(cashfreeBaseUrl, {
      method: "GET",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
      },
    });

    const cfData = await cfRes.json();
    if (!cfRes.ok) {
      return NextResponse.json({ error: cfData.message || "Failed to fetch order status from Cashfree" }, { status: 400 });
    }

    const isPaid = cfData.order_status === "PAID";
    const supabase = await createClient();

    if (supabase && isPaid) {
      await supabase
        .from("orders")
        .update({
          payment_status: "Paid",
          fulfillment_status: "Order Placed",
        })
        .eq("order_id", orderId);
    }

    return NextResponse.json({
      orderId,
      orderStatus: cfData.order_status,
      isPaid,
      amount: cfData.order_amount,
    });
  } catch (err) {
    console.error("Order verification error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
