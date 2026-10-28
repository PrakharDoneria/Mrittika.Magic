import Link from "next/link";
import { ArrowRight, BadgeCheck, Flower2, HandHeart, MessageSquareHeart, Star } from "lucide-react";
import { getCategories, getProducts } from "@/data/store";
import { ProductCard, SiteChrome } from "@/components/Storefront";
import InstagramFeed from "@/components/InstagramFeed";
import FeedbackSection from "@/components/FeedbackSection";
import AutoScrollCarousel from "@/components/AutoScrollCarousel";
import HeroBackgroundSlider from "@/components/HeroBackgroundSlider";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: products }, { data: categories }, reviewsRes, feedbackRes] = await Promise.all([
    getProducts({ limit: 12 }),
    getCategories(),
    supabase
      ? supabase.from("reviews").select("id,name,rating,body,created_at").gte("rating", 4).eq("is_published", true).limit(10)
      : Promise.resolve({ data: [] }),
    supabase
      ? supabase.from("feedback").select("id,name,rating,message,created_at").gte("rating", 4).limit(10)
      : Promise.resolve({ data: [] }),
  ]);

  // Combine positive reviews & community feedback notes
  const combinedReviews: { id: string; name: string; rating: number; text: string }[] = [];

  if (reviewsRes.data && reviewsRes.data.length > 0) {
    reviewsRes.data.forEach((r: any) => {
      combinedReviews.push({
        id: `rev-${r.id}`,
        name: r.name || "Happy Collector",
        rating: r.rating || 5,
        text: r.body,
      });
    });
  }

  if (feedbackRes.data && feedbackRes.data.length > 0) {
    feedbackRes.data.forEach((f: any) => {
      combinedReviews.push({
        id: `fb-${f.id}`,
        name: f.name || "A Mrittika Friend",
        rating: f.rating || 5,
        text: f.message,
      });
    });
  }

  // Fallback lovely customer reviews if DB has few
  const fallbackReviews = [
    {
      id: "f1",
      name: "Ananya S.",
      rating: 5,
      text: "The earrings are even more stunning in person! Lightweight, playful, and beautifully detailed. I get compliments everywhere I go.",
    },
    {
      id: "f2",
      name: "Sneha Mukherjee",
      rating: 5,
      text: "The packaging made me smile from ear to ear! The tiny handwritten note felt so intimate and magical. Thank you Mrittika!",
    },
    {
      id: "f3",
      name: "Pooja V.",
      rating: 5,
      text: "Obsessed with the clay texture and vibrant colors. It feels like wearing actual pieces of joyous art.",
    },
    {
      id: "f4",
      name: "Meera K.",
      rating: 5,
      text: "Every piece has so much personality. Truly unique handmade treasures made with so much thought and love.",
    },
    {
      id: "f5",
      name: "Rhea Sen",
      rating: 5,
      text: "I bought this for my best friend and ended up coming back to buy one for myself. Magical work!",
    },
  ];

  const displayReviews = combinedReviews.length > 0 ? combinedReviews : fallbackReviews;

  return (
    <SiteChrome categories={categories}>
      {/* ── 1. TAGLINE SCROLLER + HERO BANNER ────────────────────── */}
      <div className="checker marquee marquee-top">
        <span>✦ handpicked with love &nbsp;&nbsp;&nbsp; ✦ good things for good days &nbsp;&nbsp;&nbsp; ✦ tiny joys, thoughtfully made &nbsp;&nbsp;&nbsp; ✦ handpicked with love &nbsp;&nbsp;&nbsp; ✦ good things for good days &nbsp;&nbsp;&nbsp; ✦ tiny joys, thoughtfully made &nbsp;&nbsp;&nbsp;</span>
      </div>

      <section className="hero-home hero-single-jeans">
        <div className="hero-jeans-banner full-jeans-banner">
          <HeroBackgroundSlider />
          {/* Animated wandering ladybugs moving inside hero section */}
          <div className="hero-wandering-bug bug-wander-1" aria-hidden="true">
            <img src="/brand/ladybug.png" alt="" />
          </div>
          <div className="hero-wandering-bug bug-wander-2" aria-hidden="true">
            <img src="/brand/ladybug.png" alt="" />
          </div>
          <div className="hero-jeans-overlay" />

          <div className="hero-jeans-foreground">
            {/* Direct action buttons over background slider */}
            <div className="hero-direct-actions">
              <Link href="/shop" className="hero-direct-btn yellow-btn">
                <span>SHOP NEW DROPS</span>
                <span className="direct-btn-arrow">»</span>
              </Link>
              <Link href="/about" className="hero-direct-btn white-btn">
                <span>OUR STORY</span>
                <Flower2 size={15} className="direct-btn-icon" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FRESH CURATION / CHECKOUT LATEST COLLECTION ───────── */}
      <section className="featured-section">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">fresh curations</p>
            <h2>Checkout the <i>latest drops!</i></h2>
          </div>
          <Link href="/shop" className="text-link">Shop More <ArrowRight size={15} /></Link>
        </div>

        {products.length > 0 ? (
          <AutoScrollCarousel className="drops-scroll" speed={0.8}>
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </AutoScrollCarousel>
        ) : (
          <div className="empty-state reveal">
            <p className="quote-mark">&quot;</p>
            <h2>Beautiful things take a little time.</h2>
            <p>Our shelves are being filled by hand. Come back soon for the first collection.</p>
          </div>
        )}
      </section>

      {/* ── 3. EXPLORE COLLECTION / HANDCRAFTED CURIOSITIES ───────── */}
      <section className="showcase-strip reveal">
        <div className="showcase-header">
          <p className="eyebrow" style={{ justifyContent: "center" }}>explore collections</p>
          <h2>Handcrafted <i>curiosities.</i></h2>
          <p style={{ opacity: .75, fontSize: 14 }}>Real pieces from our collections, crafted with clay, pearls, and curiosity.</p>
        </div>

        <AutoScrollCarousel className="showcase-grid auto-scroll-strip" speed={0.7}>
          {/* 01 Brooch Pins */}
          <Link href="/shop?category=Brooch%20Pins" className="showcase-item" style={{ textDecoration: "none" }}>
            <img src="/media/home/4.jpeg" alt="Brooch Pins" />
            <div className="showcase-caption">
              <span>Brooch Pins</span>
              <small>01</small>
            </div>
          </Link>

          {/* 02 Ear Cuff */}
          <Link href="/shop?category=Ear%20Cuff" className="showcase-item" style={{ textDecoration: "none" }}>
            <img src="/media/home/2.jpeg" alt="Ear Cuff" />
            <div className="showcase-caption">
              <span>Ear Cuff</span>
              <small>02</small>
            </div>
          </Link>

          {/* 03 Earrings */}
          <Link href="/shop?category=Earrings" className="showcase-item" style={{ textDecoration: "none" }}>
            <img src="/media/ear-ring.jpeg" alt="Earrings" />
            <div className="showcase-caption">
              <span>Earrings</span>
              <small>03</small>
            </div>
          </Link>

          {/* 04 Necklace */}
          <Link href="/shop?category=Necklace" className="showcase-item" style={{ textDecoration: "none" }}>
            <img src="/media/necklace.jpeg" alt="Necklace" />
            <div className="showcase-caption">
              <span>Necklace</span>
              <small>04</small>
            </div>
          </Link>

          {/* 05 Ring */}
          <Link href="/shop?category=Ring" className="showcase-item" style={{ textDecoration: "none" }}>
            <img src="/media/ring.jpeg" alt="Ring" />
            <div className="showcase-caption">
              <span>Ring</span>
              <small>05</small>
            </div>
          </Link>

          {/* View All */}
          <Link href="/shop" className="showcase-item showcase-item-view-all" style={{ textDecoration: "none" }}>
            <div className="showcase-view-all-body">
              <span className="view-all-star">✦</span>
              <p>Explore All</p>
              <strong>Collections</strong>
              <span className="view-all-pill">View All »</span>
            </div>
          </Link>
        </AutoScrollCarousel>
      </section>

      {/* ── 4. EACH ITEM IS HANDCRAFTED IN SMALL BATCHES ─────────── */}
      <section className="intro-section reveal">
        <Flower2 size={26} />
        <p className="eyebrow">made slowly, loved deeply</p>
        <h2>Each item is handcrafted<br /><i>in small batches.</i></h2>
        <p>Celebrating the beautiful textures and joyful imperfections of artisan making. Every piece carries a little bit of the hands that made it.</p>

        {/* Why us cards */}
        <div className="why-us-grid">
          <div className="why-card">
            <span className="why-card-icon"><Flower2 /></span>
            <h3>Small Batches</h3>
            <p>Every piece is made in limited runs — no mass production, no two quite the same.</p>
          </div>
          <div className="why-card">
            <span className="why-card-icon"><BadgeCheck /></span>
            <h3>Joyful Imperfections</h3>
            <p>The little variations are features, not flaws. They&apos;re proof it was made by human hands.</p>
          </div>
          <div className="why-card">
            <span className="why-card-icon"><HandHeart /></span>
            <h3>Made With Love</h3>
            <p>Slow, thoughtful making — because things worth keeping deserve to be made carefully.</p>
          </div>
        </div>
      </section>

      {/* ── 5. FOLLOW ALONG / INSTAGRAM ── */}
      <InstagramFeed />

      {/* ── 7. POSITIVE REVIEWS SELF-SCROLLING HORIZONTAL GRID (Kind Words & Happy Mail) ── */}
      <section className="home-reviews-section reveal" style={{ maxWidth: 1200, margin: "60px auto 30px", padding: "0 24px" }}>
        <div className="section-heading" style={{ marginBottom: 24 }}>
          <div>
            <p className="eyebrow"><MessageSquareHeart size={14} /> love notes from our collectors</p>
            <h2>Kind Words &amp; <i>Happy Mail</i></h2>
          </div>
          <Link href="/community-love" className="text-link">
            See All Reviews <ArrowRight size={15} />
          </Link>
        </div>

        <AutoScrollCarousel className="home-reviews-scroll auto-scroll-strip" speed={0.75}>
          {displayReviews.map((rev) => (
            <div key={rev.id} className="home-review-card">
              <div className="home-review-stars">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="home-review-text">&ldquo;{rev.text}&rdquo;</p>
              <div className="home-review-author">
                <strong>{rev.name}</strong>
                <span className="home-review-badge">Verified Collector</span>
              </div>
            </div>
          ))}
        </AutoScrollCarousel>
      </section>

      {/* ── 8. FEEDBACK SECTION IN THE HOME PAGE ─────────────────── */}
      <FeedbackSection />
    </SiteChrome>
  );
}

