import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import { createClient } from "@/lib/supabase/server";

export default async function WishlistPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/account");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account");
  return <SiteChrome><section className="empty-page wishlist-page"><Heart size={30} /><p className="eyebrow">your saved things</p><h1>Your wishlist is <i>ready for magic.</i></h1><p>Save products you love and they will appear here. Your next favorite might be one click away.</p><Link href="/shop" className="solid-button">Browse the shop →</Link></section></SiteChrome>;
}
