import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, path, search_query, product_id, product_title, metadata } = body;

    if (!event_type) {
      return NextResponse.json({ error: "event_type is required" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ success: true, mocked: true });
    }

    const { error } = await supabase.from("analytics_events").insert({
      event_type,
      path: path || null,
      search_query: search_query ? String(search_query).trim().toLowerCase() : null,
      product_id: product_id || null,
      product_title: product_title || null,
      metadata: metadata || null,
    });

    if (error) {
      // Don't fail the client on tracking errors
      return NextResponse.json({ success: false, error: error.message }, { status: 200 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
