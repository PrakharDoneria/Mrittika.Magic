import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await requireAdmin();
    const body = await request.json();
    const { key, value } = body;

    if (!key || !value) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    const { error } = await supabase.from("store_settings").upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update settings" }, { status: 500 });
  }
}
