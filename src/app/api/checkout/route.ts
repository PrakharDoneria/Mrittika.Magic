import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customer?: Record<string, string>;
      items?: unknown[];
      totalAmount?: number;
      paymentMode?: string;
    };

    if (
      !body.customer?.name ||
      !body.customer.email ||
      !body.customer.phone ||
      !body.customer.address ||
      !body.items?.length ||
      !body.totalAmount
    ) {
      return NextResponse.json(
        { error: "Please complete your delivery details and ensure your bag has items." },
        { status: 400 }
      );
    }

    if (body.paymentMode !== "cashfree") {
      return NextResponse.json({ error: "Only secure online payment with Cashfree is supported." }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Checkout database is not configured. Please try again later." }, { status: 503 });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!appId || !secretKey) {
      return NextResponse.json({ error: "Online payments are not configured. Please contact support." }, { status: 503 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const orderId = `MRIT-${Date.now().toString(36).toUpperCase()}`;
    const paymentGateway = "Cashfree";
    const paymentStatus = "Pending";

    // Call Cashfree Create Order API to initiate payment session
    const isProd = !appId.toLowerCase().includes("test") && !appId.toLowerCase().includes("sandbox");
    const cashfreeBaseUrl = isProd
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

    // Format phone to 10 digits required by Cashfree
    const cleanPhone = body.customer.phone.replace(/[^0-9]/g, "").slice(-10) || "9999999999";

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const cfRes = await fetch(cashfreeBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: Number(body.totalAmount),
        order_currency: "INR",
        customer_details: {
          customer_id: user?.id ?? `cust_${Date.now().toString(36)}`,
          customer_name: body.customer.name.trim(),
          customer_email: body.customer.email.trim(),
          customer_phone: cleanPhone,
        },
        order_note: `Mrittika Magic Order ${orderId}`,
        order_meta: {
          return_url: `${origin}/checkout?order_id=${orderId}&cf_id={order_id}`,
        },
      }),
    });

    const cfData = await cfRes.json();
    if (!cfRes.ok || !cfData.payment_session_id) {
      console.error("Cashfree order creation error:", cfData);
      return NextResponse.json(
        { error: cfData.message || "Failed to initiate Cashfree payment session. Please try again." },
        { status: 400 }
      );
    }

    // Insert order in database with status 'Pending'
    // Use privileged admin client if available to ensure unauthenticated guest orders succeed
    const dbClient = createAdminClient() || supabase;
    const { error: dbError } = await dbClient.from("orders").insert({
      order_id: orderId,
      user_id: user?.id ?? null,
      customer: body.customer,
      items: body.items,
      total_amount: body.totalAmount,
      payment_gateway: paymentGateway,
      payment_status: paymentStatus,
      fulfillment_status: "Order Placed",
    });

    if (dbError) {
      console.error("Database order insertion error:", dbError);
      return NextResponse.json({ 
        error: dbError.message,
        hint: "Please run the SQL migration in supabase/schema.sql in your Supabase SQL editor to allow unauthenticated order placement."
      }, { status: 500 });
    }

    return NextResponse.json({
      orderId,
      paymentSessionId: cfData.payment_session_id,
      amount: body.totalAmount,
      isProd,
    });
  } catch (err) {
    console.error("Checkout POST handler error:", err);
    return NextResponse.json({ error: "Something went wrong while initiating checkout." }, { status: 500 });
  }
}

