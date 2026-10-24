import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json() as { customer?: Record<string, string>; items?: unknown[]; totalAmount?: number; paymentMode?: string };
  if (!body.customer?.name || !body.customer.email || !body.customer.phone || !body.customer.address || !body.items?.length || !body.totalAmount) return NextResponse.json({ error: "Please complete your delivery details and add an item to your bag." }, { status: 400 });
  if (!["cod", "cashfree"].includes(body.paymentMode ?? "")) return NextResponse.json({ error: "Choose a valid payment mode." }, { status: 400 });
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Checkout is not configured. Please try again later." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (body.paymentMode === "cashfree" && (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY)) return NextResponse.json({ error: "Online payments are not configured yet. Please choose Cash on Delivery." }, { status: 503 });
  const orderId = `MRIT-${Date.now().toString(36).toUpperCase()}`;
  const paymentGateway = body.paymentMode === "cod" ? "COD" : "Cashfree";
  const paymentStatus = body.paymentMode === "cod" ? "Pending" : "Pending";
  const { error } = await supabase.from("orders").insert({ order_id: orderId, user_id: user?.id ?? null, customer: body.customer, items: body.items, total_amount: body.totalAmount, payment_gateway: paymentGateway, payment_status: paymentStatus });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orderId, paymentMode: body.paymentMode });
}
