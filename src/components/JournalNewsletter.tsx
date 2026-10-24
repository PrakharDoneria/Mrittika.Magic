"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function JournalNewsletter() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      style={{
        margin: "0 40px 120px",
        padding: "60px 9%",
        background: "var(--lavender)",
        border: "2.5px solid var(--ink)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-pop-lg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 40,
        flexWrap: "wrap",
      }}
    >
      <div>
        <p
          className="eyebrow"
          style={{ color: "var(--coral)", fontSize: 10, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase" }}
        >
          ✦ stay in the loop ✦
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "clamp(32px, 4vw, 50px)",
            letterSpacing: "-.05em",
            margin: "14px 0 12px",
            lineHeight: .95,
          }}
        >
          Get the journal <i style={{ color: "var(--coral)", fontWeight: 400 }}>in your inbox.</i>
        </h2>
        <p style={{ opacity: .7, lineHeight: 1.75, maxWidth: 380, margin: 0 }}>
          New notes, shop drops, and studio moments — delivered with love.
        </p>
      </div>

      {submitted ? (
        <div
          style={{
            padding: "20px 30px",
            border: "2px solid var(--green)",
            borderRadius: "var(--radius-md)",
            background: "#7db59718",
            color: "var(--green-dk, #5a9478)",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          ✓ You&apos;re in! Watch your inbox for lovely things.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            style={{
              padding: "14px 20px",
              border: "2px solid var(--ink)",
              borderRadius: "var(--radius-pill)",
              background: "var(--cream)",
              outline: "none",
              font: "inherit",
              fontSize: 14,
              minWidth: 240,
              transition: "box-shadow .2s",
            }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.boxShadow = "4px 4px 0 var(--pink-mid, #f4a9c4)"; }}
            onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.boxShadow = ""; }}
          />
          <button
            type="submit"
            className="solid-button"
            style={{ margin: 0 }}
          >
            Subscribe <ArrowRight size={14} />
          </button>
        </form>
      )}
    </section>
  );
}
