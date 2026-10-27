"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Heart, Mail, Package, Send, ShieldCheck, Sparkles } from "lucide-react";

import { STORE_SETTINGS } from "@/data/store-settings";

declare global {
  interface Window {
    Cashfree?: (config: { mode: "sandbox" | "production" }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: "_self" | "_blank" | "_modal";
      }) => Promise<{ error?: { message: string }; redirect?: boolean }>;
    };
  }
}

export default function MailClubForm() {
  const { snailMail } = STORE_SETTINGS;
  const [plan, setPlan] = useState<"Monthly" | "Yearly">("Monthly");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load Cashfree JS SDK
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("cashfree-sdk-script")) {
      const script = document.createElement("script");
      script.id = "cashfree-sdk-script";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    // Validate all mandatory fields
    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !postalCode.trim()
    ) {
      setErrorMsg("Please fill out all fields. Every delivery and subscription field is mandatory.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/mail-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          plan,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");

      // If Cashfree returned a session id and SDK is ready, trigger checkout modal
      if (data.paymentSessionId && typeof window !== "undefined" && window.Cashfree) {
        try {
          const cashfree = window.Cashfree({ mode: "sandbox" });
          cashfree.checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_modal",
          });
        } catch (cfLaunchErr) {
          console.warn("Cashfree checkout launch notice:", cfLaunchErr);
        }
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mail-club-success reveal">
        <div className="mail-stamp-circle">💌</div>
        <CheckCircle2 size={44} style={{ color: "var(--navy, #080786)" }} />
        <h2>Welcome to the <i>Snail Mail Club!</i></h2>
        <p>
          We are so thrilled to write to you, <strong>{name}</strong>! Your <strong>{plan}</strong> subscription has been recorded.
          Our maker is already preparing handwritten wax-sealed envelopes, art prints, and seasonal tokens for your mailbox.
        </p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(8, 7, 134, 0.08)", borderRadius: "var(--radius-pill)", fontSize: 13, fontWeight: 700, color: "var(--navy, #080786)" }}>
          <CreditCard size={14} /> Cashfree Recurring Billing: Active
        </div>
        <div style={{ marginTop: 24 }}>
          <button
            type="button"
            className="solid-button"
            onClick={() => {
              setSubmitted(false);
              setName("");
              setPhone("");
              setEmail("");
              setAddress("");
              setCity("");
              setState("");
              setPostalCode("");
            }}
          >
            Add Another Mailbox
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="mail-club-form reveal" onSubmit={handleSubmit}>
      {/* Plan picker */}
      <div className="mail-plan-selector">
        <label>Select Your Subscription Type</label>
        <div className="mail-plans-grid">
          <button
            type="button"
            className={`mail-plan-card ${plan === "Monthly" ? "active" : ""}`}
            onClick={() => setPlan("Monthly")}
          >
            <div className="plan-tag">Flexible</div>
            <h3>Monthly Snail Mail</h3>
            <p className="plan-price">{snailMail.monthlyPriceLabel}</p>
            <ul>
              {snailMail.monthlyPerks.map((perk, i) => (
                <li key={i}>✦ {perk}</li>
              ))}
            </ul>
          </button>

          <button
            type="button"
            className={`mail-plan-card ${plan === "Yearly" ? "active" : ""}`}
            onClick={() => setPlan("Yearly")}
          >
            <div className="plan-tag best-value">Best Value ✨</div>
            <h3>Yearly Snail Mail Club</h3>
            <p className="plan-price">{snailMail.yearlyPriceLabel}</p>
            <ul>
              {snailMail.yearlyPerks.map((perk, i) => (
                <li key={i}>✦ {perk}</li>
              ))}
            </ul>
          </button>
        </div>
      </div>

      {/* Input fields — ALL MANDATORY */}
      <div className="mail-fields-grid">
        <label className="mail-field">
          <span>Full Name *</span>
          <input
            type="text"
            required
            placeholder="e.g. Diya Sen"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="mail-field">
          <span>Contact Number *</span>
          <input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
      </div>

      <label className="mail-field">
        <span>Email Address (For billing & dispatch updates) *</span>
        <input
          type="email"
          required
          placeholder="diya@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="mail-field">
        <span>Physical Street Address (For Snail Mail Delivery) *</span>
        <textarea
          required
          rows={3}
          placeholder="Flat / House No., Apartment Name, Street, Landmark"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>

      <div className="mail-fields-triplet">
        <label className="mail-field">
          <span>City *</span>
          <input
            type="text"
            required
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>

        <label className="mail-field">
          <span>State *</span>
          <input
            type="text"
            required
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>

        <label className="mail-field">
          <span>PIN Code / Postal Code *</span>
          <input
            type="text"
            required
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </label>
      </div>

      {/* Cashfree Recurring Payment note */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: "var(--radius-sm)", background: "rgba(8, 7, 134, 0.04)", border: "1px dashed rgba(8, 7, 134, 0.2)", fontSize: 13, color: "var(--navy, #080786)" }}>
        <ShieldCheck size={18} />
        <span>Secure Cashfree recurring subscription. You can cancel or pause anytime from your account.</span>
      </div>

      {errorMsg && <p className="feedback-error">{errorMsg}</p>}

      <button
        type="submit"
        className="solid-button mail-submit-btn"
        disabled={submitting}
      >
        <Mail size={16} />
        {submitting ? "Initiating Cashfree Payment..." : `Join ${plan} Club with Cashfree`}
      </button>
    </form>
  );
}
