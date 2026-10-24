import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import JournalNewsletter from "@/components/JournalNewsletter";

const posts = [
  {
    slug: "morning-rituals",
    title: "5 tiny rituals for a better morning",
    date: "Oct 2024",
    excerpt: "The first hour sets the tone. Here's how handmade ceramics, delicate chains, and small objects can transform it.",
    color: "pink",
    image: "/media/desk.jpeg",
  },
  {
    slug: "gifting-guide",
    title: "The art of gifting something truly thoughtful",
    date: "Sep 2024",
    excerpt: "Why the best gifts are always personal, a little quirky, and full of handmade charm.",
    color: "lavender",
    image: "/media/necklace.jpeg",
  },
  {
    slug: "desk-joy",
    title: "Make your desk a place you actually want to be",
    date: "Aug 2024",
    excerpt: "Color, texture, whimsical beads, and a few well-chosen shapes go a very long way.",
    color: "yellow",
    image: "/background/flower.jpeg",
  },
];

export default function JournalPage() {
  return (
    <SiteChrome>
      {/* Hero */}
      <section className="page-hero pink">
        <p className="eyebrow" style={{ justifyContent: "center" }}>notes from the studio</p>
        <h1>The <i>journal.</i></h1>
        <p>Ideas, rituals, and small reasons to celebrate the ordinary.</p>
      </section>

      {/* Journal Grid */}
      <div className="journal-grid">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className={`journal-card ${post.color} reveal`}
            style={{ animationDelay: `${i * 0.1}s`, padding: 0, overflow: "hidden" }}
          >
            <div style={{
              height: 180,
              width: "100%",
              backgroundImage: `url('${post.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderBottom: "2px solid var(--ink)",
            }} />
            <div style={{ padding: "24px 28px 12px" }}>
              <span style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", opacity: .7, fontWeight: 800 }}>{post.date}</span>
              <h2 style={{ fontSize: "clamp(26px, 2.5vw, 34px)", margin: "8px 0 10px" }}>{post.title}</h2>
            </div>
            <div style={{ padding: "0 28px 24px" }}>
              <p style={{ margin: "0 0 16px", fontSize: 13, lineHeight: 1.7, opacity: .78 }}>
                {post.excerpt}
              </p>
              <b style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase" }}>
                Read journal note <ArrowRight size={12} />
              </b>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter strip */}
      <JournalNewsletter />
    </SiteChrome>
  );
}
