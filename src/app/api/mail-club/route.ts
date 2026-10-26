import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { name, phone, email, address, city, state, postalCode, plan } = body;

    if (!name || !email || !phone || !address) {
      return NextResponse.json({ error: "Name, phone, email, and address are required." }, { status: 400 });
    }

    if (!supabase) {
      // Mock success if Supabase not configured
      return NextResponse.json({ success: true });
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("mail_club").insert({
      user_id: user?.id ?? null,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city?.trim() || null,
      state: state?.trim() || null,
      postal_code: postalCode?.trim() || null,
      plan: plan || "Monthly",
    });

    if (error) {
      console.error("Mail Club insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mail Club API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
