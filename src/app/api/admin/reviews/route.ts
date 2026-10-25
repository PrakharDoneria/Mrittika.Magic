import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  const supabase = await requireAdmin();
  const { id, is_published } = await request.json();
  const { error } = await supabase.from("reviews").update({ is_published }).eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await requireAdmin();
  const { id } = await request.json();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
