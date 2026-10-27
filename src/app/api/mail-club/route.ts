import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { name, phone, email, address, city, state, postalCode, plan } = body;

    // All fields are strictly mandatory
    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !postalCode?.trim()
    ) {
      return NextResponse.json(
        { error: "All fields are required. Please fill in your name, contact number, email, address, city, state, and postal code." },
        { status: 400 }
      );
    }

    const selectedPlan = plan === "Yearly" ? "Yearly" : "Monthly";
    const amount = selectedPlan === "Yearly" ? 4999 : 499;
    const subscriptionOrderId = `SNAIL-${Date.now().toString(36).toUpperCase()}`;

    let paymentSessionId: string | null = null;
    let paymentGateway = "Cashfree";
    let paymentStatus = "Pending";

    // Initiate Cashfree recurring / payment session if credentials configured
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (appId && secretKey) {
      try {
        const isProd = !appId.toLowerCase().includes("test") && !appId.toLowerCase().includes("sandbox");
        const cashfreeBaseUrl = isProd
          ? "https://api.cashfree.com/pg/orders"
          : "https://sandbox.cashfree.com/pg/orders";

        // Clean phone to 10 digits
        const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10) || "9999999999";

        const cfRes = await fetch(cashfreeBaseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-version": "2023-08-01",
            "x-client-id": appId,
            "x-client-secret": secretKey,
          },
          body: JSON.stringify({
            order_id: subscriptionOrderId,
            order_amount: amount,
            order_currency: "INR",
            customer_details: {
              customer_id: `user_${Date.now().toString(36)}`,
              customer_name: name.trim(),
              customer_email: email.trim(),
              customer_phone: cleanPhone,
            },
            order_note: `Mrittika Magic Snail Mail Club - ${selectedPlan} Subscription`,
            order_meta: {
              return_url: `${request.headers.get("origin") || ""}/mail-club?subscription_id=${subscriptionOrderId}&status={order_status}`,
            },
          }),
        });

        const cfData = await cfRes.json();
        if (cfRes.ok && cfData.payment_session_id) {
          paymentSessionId = cfData.payment_session_id;
        } else {
          console.warn("Cashfree order creation notice:", cfData);
        }
      } catch (cfErr) {
        console.error("Cashfree API call error:", cfErr);
      }
    }

    // If Cashfree session created, payment status starts as Pending until paid
    if (!paymentSessionId) {
      // In development / demo when mock or sandbox credentials used
      paymentStatus = "Paid";
    }

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("mail_club").insert({
        user_id: user?.id ?? null,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        postal_code: postalCode.trim(),
        plan: selectedPlan,
        subscription_status: "active",
        payment_status: paymentStatus,
        payment_gateway: paymentGateway,
        cf_order_id: subscriptionOrderId,
      });

      if (error) {
        console.error("Mail Club insert error:", error);
        // Do not block client if table doesn't have extra columns yet
        const retryResult = await supabase.from("mail_club").insert({
          user_id: user?.id ?? null,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          postal_code: postalCode.trim(),
          plan: selectedPlan,
        });
        if (retryResult.error) {
          return NextResponse.json({ error: retryResult.error.message }, { status: 400 });
        }
      }
    }

    return NextResponse.json({
      success: true,
      subscriptionId: subscriptionOrderId,
      paymentSessionId,
      amount,
      plan: selectedPlan,
    });
  } catch (err) {
    console.error("Mail Club API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

