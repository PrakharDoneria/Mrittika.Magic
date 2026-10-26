"use client";

import { useState } from "react";
import { CheckCircle2, Heart, Mail, Package, Send, Sparkles } from "lucide-react";

import { STORE_SETTINGS } from "@/data/store-settings";

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/mail-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          city,
          state,
          postalCode,
          plan,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");
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

      {/* Input fields */}
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
        <span>Email Address *</span>
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
          <span>City</span>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>

        <label className="mail-field">
          <span>State</span>
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>

        <label className="mail-field">
          <span>PIN Code / Postal Code</span>
          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </label>
      </div>

      {errorMsg && <p className="feedback-error">{errorMsg}</p>}

      <button
        type="submit"
        className="solid-button mail-submit-btn"
        disabled={submitting}
      >
        <Mail size={16} />
        {submitting ? "Joining Club..." : `Join ${plan} Mail Club`}
      </button>
    </form>
  );
}
