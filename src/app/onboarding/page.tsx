import Link from "next/link";
import { redirect } from "next/navigation";
import { Flower2 } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/account");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account?mode=signup");
  return <SiteChrome><section className="onboarding-page"><Flower2 size={34} /><p className="eyebrow">welcome to the little club</p><h1>Your account is<br /><i>ready to bloom.</i></h1><p>Here is your welcome gift: <strong>MAGIC5</strong> for 5% off your first order.</p><div className="onboarding-actions"><Link href="/shop" className="solid-button">Start shopping →</Link><Link href="/profile" className="outline-button">Complete my profile</Link></div></section></SiteChrome>;
}
