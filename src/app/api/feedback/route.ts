import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { name, email, rating, message } = body;

    if (!message || message.trim().length < 2) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (!supabase) {
      // Mock success if Supabase not configured
      return NextResponse.json({ success: true });
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("feedback").insert({
      user_id: user?.id ?? null,
      name: name?.trim() || (user?.user_metadata?.name ?? "Anonymous Friend"),
      email: email?.trim() || (user?.email ?? null),
      rating: rating ? Number(rating) : 5,
      message: message.trim(),
    });

    if (error) {
      console.error("Feedback insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
