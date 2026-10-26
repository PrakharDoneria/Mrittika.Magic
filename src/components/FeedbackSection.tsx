"use client";

import { useState } from "react";
import { CheckCircle2, Heart, MessageSquareHeart, Send, Star } from "lucide-react";

export default function FeedbackSection() {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, rating, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit feedback");
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="feedback-section reveal">
      <div className="feedback-container">
        <div className="feedback-header">
          <div className="feedback-badge">
            <MessageSquareHeart size={16} />
            <span>Community Love</span>
          </div>
          <h2>Leave a Little <i>Magic Note</i></h2>
          <p>
            Have a question, feedback on your recent pieces, or just want to send love to our makers? We read every single word.
          </p>
        </div>

        {submitted ? (
          <div className="feedback-success">
            <CheckCircle2 size={42} style={{ color: "var(--navy, #080786)" }} />
            <h3>Thank you for your warm words!</h3>
            <p>Your note has been received with so much love in our studio.</p>
            <button
              type="button"
              className="outline-button"
              onClick={() => setSubmitted(false)}
            >
              Send another note
            </button>
          </div>
        ) : (
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="feedback-rating-group">
              <label>How would you rate your Mrittika experience?</label>
              <div className="feedback-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    aria-label={`${star} star`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="feedback-star-btn"
                  >
                    <Star
                      size={26}
                      fill={(hoveredRating || rating) >= star ? "var(--yellow, #FFD633)" : "none"}
                      stroke={(hoveredRating || rating) >= star ? "var(--ink, #080786)" : "var(--ink, #080786)"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="feedback-inputs-row">
              <label className="feedback-field">
                <span>Your Name</span>
                <input
                  type="text"
                  placeholder="e.g. Maya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="feedback-field">
                <span>Email Address (optional)</span>
                <input
                  type="email"
                  placeholder="maya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>

            <label className="feedback-field">
              <span>Your Feedback / Message *</span>
              <textarea
                required
                rows={4}
                placeholder="Tell us what you love, what piece made your day, or ideas for future drops..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>

            {errorMsg && <p className="feedback-error">{errorMsg}</p>}

            <button
              type="submit"
              className="solid-button feedback-submit-btn"
              disabled={submitting}
            >
              <Send size={16} />
              {submitting ? "Sending note..." : "Send Feedback"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
