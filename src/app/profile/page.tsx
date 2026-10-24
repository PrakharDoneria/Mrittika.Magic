import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight, Flower2 } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/ProfileForm";
import styles from "./profile.module.css";

export default async function ProfilePage() {
  const supabase = await createClient();
  if (!supabase) redirect("/account");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account");
  const { data: profile } = await supabase.from("profiles").select("name,avatar_url").eq("id", user.id).maybeSingle();
  return <SiteChrome><main className={styles.page}><header className={styles.intro}><div><p className={styles.eyebrow}>your little corner</p><h1 className={styles.title}>Hello, <i>{profile?.name || "friend"}.</i></h1></div><p className={styles.introText}>A place for your details, your orders, and all the lovely things you have saved for later.</p></header><div className={styles.layout}><aside className={styles.sideCard}><div><Flower2 className={styles.sideIcon} size={30} /><h2>Make life<br />a little lovely.</h2><p>Keep your profile fresh so every future order feels made just for you.</p></div><nav className={styles.sideLinks}><Link href="/profile">Profile <ArrowRight size={12} /></Link><Link href="/orders">My Orders <ArrowRight size={12} /></Link><Link href="/shop">Shop magic <ArrowRight size={12} /></Link><Link href="/cart">Your bag <ArrowRight size={12} /></Link></nav></aside><section className={styles.card}><div className={styles.cardHeader}><h2>Profile details</h2><span className={styles.status}>● Account active</span></div><div className={styles.avatarColumn}><div className={styles.avatar}>{profile?.avatar_url ? <Image src={profile.avatar_url} alt="" width={150} height={150} unoptimized /> : (profile?.name?.[0] ?? user.email?.[0] ?? "M").toUpperCase()}</div><p className={styles.avatarHint}>Add a photo to make your account feel more like you.</p></div><ProfileForm userId={user.id} email={user.email ?? ""} initialName={profile?.name ?? ""} initialAvatar={profile?.avatar_url ?? null} /></section></div></main></SiteChrome>;
}
