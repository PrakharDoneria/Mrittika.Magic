"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

type Review = { id: string; name: string; rating: number; body: string; created_at: string };

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    createClient().from("reviews").select("id,name,rating,body,created_at").eq("product_id", productId).eq("is_published", true).order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) setStatus("Reviews are temporarily unavailable.");
      else setReviews((data ?? []) as Review[]);
    });
  }, [productId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const { error } = await createClient().from("reviews").insert({ product_id: productId, name: String(form.get("name")), rating: Number(form.get("rating")), body: String(form.get("body")) });
    if (error) {
      console.error("Review submission error:", error);
      setStatus(`Could not submit: ${error.message || "Please check inputs."}`);
    } else {
      setStatus("Thank you! Your review has been submitted and is in moderation.");
      formElement.reset();
    }
  }

  return <section className="reviews-section">
    <div><p className="eyebrow">kind words</p><h2>Made for <i>happy days.</i></h2><p className="reviews-summary">Your experience helps another customer find their next favorite.</p></div>
    <div className="reviews-list">{reviews.length ? reviews.map((review) => <article className="review-card" key={review.id}><div className="review-stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < review.rating ? "currentColor" : "none"} />)}</div><p>&quot;{review.body}&quot;</p><strong>{review.name}</strong></article>) : <p className="reviews-empty">Be the first to share a little love.</p>}</div>
    <form className="review-form" onSubmit={submit}><h3>Share your experience</h3><div className="review-form-grid"><label>Name<input name="name" required /></label><label>Rating<select name="rating" defaultValue="5"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label></div><label>Review<textarea name="body" required minLength={10} rows={3} /></label><button className="solid-button">Submit review</button>{status && <p className="checkout-hint">{status}</p>}</form>
  </section>;
}
