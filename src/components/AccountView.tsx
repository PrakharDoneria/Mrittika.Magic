"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthForm from "./AuthForm";
import { BadgePercent, BookOpen, ClipboardList, Heart, Sparkles } from "lucide-react";

export default function AccountView() {
  const params = useSearchParams();
  const signUp = params.get("mode") === "signup";

  return (
    <section className="account-page">
      <div>
        <p className="eyebrow">welcome to the club</p>
        <h1>Make room for<br /><i>more magic.</i></h1>
        <p style={{ lineHeight: 1.8, opacity: .8, maxWidth: 340, marginTop: 16 }}>
          Sign up for early access, studio notes, and 5% off your first order. No spam, just lovely things.
        </p>
        {/* Decorative badges */}
        <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
          {[{ label: "5% welcome gift", Icon: BadgePercent }, { label: "Early access", Icon: Sparkles }, { label: "Studio notes", Icon: BookOpen }].map(({ label, Icon }) => (
            <span key={label} style={{
              padding: "7px 14px",
              border: "1.5px solid var(--ink)",
              borderRadius: "var(--radius-pill)",
              background: "var(--cream)",
              fontSize: 10, fontWeight: 800,
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}><Icon size={13} /> {label}</span>
          ))}
        </div>
      </div>

      <div className="auth-card">
        <h2>{signUp ? "Create your account" : "Welcome back"}</h2>
        <AuthForm initialMode={signUp ? "signup" : "signin"} />
      </div>
      <div className="account-quick-links"><Link href="/account?tab=orders"><ClipboardList size={16} /> My Orders</Link><Link href="/wishlist"><Heart size={16} /> Saved items</Link></div>
    </section>
  );
}
