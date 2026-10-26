import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ success: true, localOnly: true });
    }

    const { data: { user } } = await supabase.auth.getUser();
    const body = await request.json();
    const { productId, productTitle, action } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    if (!user) {
      // User is a guest - guest wishlists stored in localStorage
      return NextResponse.json({ success: true, guest: true });
    }

    if (action === "remove") {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      if (error) console.error("Wishlist remove error:", error);
      return NextResponse.json({ success: true });
    }

    // Insert or update
    const userMeta = user.user_metadata || {};
    const { error } = await supabase
      .from("wishlists")
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
          product_title: productTitle || null,
          user_email: user.email || null,
          user_name: userMeta.name || userMeta.full_name || null,
        },
        { onConflict: "user_id,product_id" }
      );

    if (error) {
      console.error("Wishlist upsert error:", error);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Wishlist API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
