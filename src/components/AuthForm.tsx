"use client";

import { FormEvent, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function AuthForm({ initialMode = "signin" }: { initialMode?: "signin" | "signup" }) {
  const [mode, setMode] = useState(initialMode);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const name = String(data.get("name") ?? "");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setMessage("Add Supabase keys to .env.local to enable authentication.");
      setLoading(false);
      return;
    }

    const supabase = createBrowserClient(url, key);
    const result = mode === "signup"
      ? await supabase.auth.signUp({ email, password, options: { data: { name } } })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setMessage(result.error.message.includes("Database error saving new user") ? "We could not create your profile yet. Run the latest Supabase schema migration, then try again." : result.error.message);
    } else if (result.data.session) {
      router.push(mode === "signup" ? "/onboarding" : "/profile");
      router.refresh();
    } else {
      setMessage("Account created. You can now sign in.");
    }

    setLoading(false);
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {mode === "signup" && <input name="name" required placeholder="Your name" />}
      <input name="email" type="email" required placeholder="Email address" />
      <input name="password" type="password" minLength={6} required placeholder="Password (6+ characters)" />
      <button className="solid-button" disabled={loading}>
        {loading ? "One moment..." : mode === "signup" ? "Create account" : "Sign in"}
      </button>
      {message && <p className="form-message">{message}</p>}
      <button type="button" className="text-button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
        {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
      </button>
    </form>
  );
}
