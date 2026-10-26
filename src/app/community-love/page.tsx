import Link from "next/link";
import { ArrowLeft, Flower2, Heart, MessageSquareHeart, Sparkles, Star } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import FeedbackSection from "@/components/FeedbackSection";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Community Love — Reviews & Letters from Friends | Mrittika Magic",
  description: "Read sweet notes, unboxing stories, and reviews from our lovely community of wearable art collectors.",
};

export default async function CommunityLovePage() {
  const supabase = await createClient();
  let feedbackList: any[] = [];

  if (supabase) {
    try {
      const { data } = await supabase
        .from("feedback")
        .select("id,name,rating,message,created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (data && data.length > 0) {
        feedbackList = data;
      }
    } catch {
      // Graceful fallback
    }
  }

  return (
    <SiteChrome>
      {/* Hero Banner */}
      <section className="page-hero" style={{ background: "var(--lavender, #E4C1F9)", borderBottom: "2px solid var(--ink)" }}>
        <p className="eyebrow" style={{ justifyContent: "center" }}>
          <Heart size={14} fill="currentColor" /> handwritten warmth & kind words
        </p>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 68px)" }}>
          Community <i>Love.</i>
        </h1>
        <p style={{ maxWidth: 580, margin: "14px auto 0", fontSize: 16 }}>
          Every piece we craft is a little love letter to the world. Here are the real dispatches, notes, and feedback received by our studio.
        </p>
      </section>

      {/* Real Feedback Grid */}
      <section className="community-love-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        {feedbackList.length > 0 ? (
          <div className="community-reviews-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {feedbackList.map((item, index) => {
              const rating = item.rating || 5;
              const dateStr = item.created_at
                ? new Date(item.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                : "Recent";
              const isFirst = index === 0;

              return (
                <div
                  key={item.id}
                  className={`community-card ${isFirst ? "featured-community-card" : ""}`}
                  style={{
                    border: "2px solid var(--ink)",
                    borderRadius: "var(--radius-lg, 18px)",
                    padding: "28px 24px",
                    background: isFirst ? "var(--yellow, #FFD633)" : "#ffffff",
                    boxShadow: isFirst ? "5px 5px 0 var(--navy, #080786)" : "4px 4px 0 var(--pink, #FF99C8)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  {isFirst && (
                    <span
                      style={{
                        position: "absolute",
                        top: -12,
                        right: 20,
                        background: "var(--navy, #080786)",
                        color: "#ffffff",
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "4px 12px",
                        borderRadius: 999,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                      }}
                    >
                      ★ Recent Note
                    </span>
                  )}

                  <div>
                    <div style={{ display: "flex", gap: 4, color: isFirst ? "var(--navy, #080786)" : "#FFB800", marginBottom: 14 }}>
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} size={18} fill="currentColor" />
                      ))}
                    </div>
                    <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink)", fontStyle: "italic", margin: "0 0 16px" }}>
                      &ldquo;{item.message}&rdquo;
                    </p>
                  </div>

                  <div style={{ borderTop: "1px dashed rgba(8, 7, 134, 0.2)", paddingTop: 14, marginTop: 8 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>{item.name || "A Mrittika Friend"}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                      Verified Community Feedback • {dateStr}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="empty-state reveal visible"
            style={{
              padding: "48px 24px",
              textAlign: "center",
              border: "2px solid var(--ink)",
              borderRadius: "var(--radius-lg)",
              background: "#ffffff",
              boxShadow: "4px 4px 0 var(--pink)",
            }}
          >
            <MessageSquareHeart size={36} style={{ color: "var(--navy, #080786)", marginBottom: 12 }} />
            <h2 style={{ fontSize: 24, margin: "0 0 8px" }}>Be the first to leave a love note!</h2>
            <p style={{ maxWidth: 460, margin: "0 auto", fontSize: 14, opacity: 0.75 }}>
              All customer notes and reviews submitted below appear live in our Community Love collection and admin panel.
            </p>
          </div>
        )}
      </section>

      {/* Feedback Form below */}
      <FeedbackSection />
    </SiteChrome>
  );
}

