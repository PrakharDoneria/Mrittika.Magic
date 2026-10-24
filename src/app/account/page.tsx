import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SiteChrome } from "@/components/Storefront";
import AccountView from "@/components/AccountView";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const supabase = await createClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const params = await searchParams;
      redirect(params.tab === "wishlist" ? "/wishlist" : params.tab === "orders" ? "/orders" : "/profile");
    }
  }
  return <SiteChrome><Suspense fallback={<section className="empty-page">Loading your account...</section>}><AccountView /></Suspense></SiteChrome>;
}
