"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BadgeCheck, Flower2, HandHeart, MessageSquareHeart, Star } from "lucide-react";
import { ProductCard, SiteChrome } from "@/components/Storefront";
import InstagramFeed from "@/components/InstagramFeed";
import FeedbackSection from "@/components/FeedbackSection";
import AutoScrollCarousel from "@/components/AutoScrollCarousel";
import HeroBackgroundSlider from "@/components/HeroBackgroundSlider";
import type { Category, Product } from "@/data/types";

interface DisplayReview {
  id: string;
  name: string;
  rating: number;
  text: string;
}

interface HomePageClientProps {
  categories: Category[];
  products: Product[];
  displayReviews: DisplayReview[];
}

export default function HomePageClient({
  categories,
  products,
  displayReviews,
}: HomePageClientProps) {
  const [activeHeroImage, setActiveHeroImage] = useState<string>("/background/banner.png");
  const isBanner = activeHeroImage === "/background/banner.png";

  return (
    <SiteChrome categories={categories}>
      {/* ── 1. TAGLINE SCROLLER + HERO BANNER ────────────────────── */}
      <div className="checker marquee marquee-top">
        <span>
          ✦ handpicked with love &nbsp;&nbsp;&nbsp; ✦ good things for good days &nbsp;&nbsp;&nbsp; ✦ tiny joys, thoughtfully made &nbsp;&nbsp;&nbsp; ✦ handpicked with love &nbsp;&nbsp;&nbsp; ✦ good things for good days &nbsp;&nbsp;&nbsp; ✦ tiny joys, thoughtfully made &nbsp;&nbsp;&nbsp;
        </span>
      </div>

      <section className="hero-home hero-single-jeans">
        <div className="hero-jeans-banner full-jeans-banner">
          <HeroBackgroundSlider onImageChange={setActiveHeroImage} />

          {/* Animated wandering ladybugs moving inside hero section */}
          <div className="hero-wandering-bug bug-wander-1" aria-hidden="true">
            <img src="/brand/ladybug.png" alt="" />
          </div>
          <div className="hero-wandering-bug bug-wander-2" aria-hidden="true">
            <img src="/brand/ladybug.png" alt="" />
          </div>

          <div className="hero-jeans-overlay" />

          {/* Foreground Action Buttons - visible on banner */}
          {isBanner && (
            <div className="hero-jeans-foreground">
              <div className="hero-direct-actions">
                <Link href="/shop" className="hero-direct-btn yellow-btn">
                  <span>SHOP NEW DROPS</span>
                  <span className="direct-btn-arrow">»</span>
                </Link>
                <Link href="/about" className="hero-direct-btn white-btn">
                  <span>OUR STORY</span>
                  <Flower2 size={16} className="direct-btn-icon" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. FRESH CURATION / CHECKOUT LATEST COLLECTION ───────── */}
      <section className="featured-section">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">fresh curations</p>
            <h2>
              Checkout the <i>latest drops!</i>
            </h2>
          </div>
          <Link href="/shop" className="text-link">
            Shop More <ArrowRight size={15} />
          </Link>
        </div>
        <AutoScrollCarousel className="drops-scroll auto-scroll-strip" speed={0.8}>
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </AutoScrollCarousel>
      </section>

      {/* ── 3. HANDCRAFTED CURIOSITIES ───────────────────────────── */}
      <section className="showcase-strip reveal">
        <div className="showcase-header">
          <p className="eyebrow">curated for curious souls</p>
          <h2>
            Handcrafted <i>curiosities.</i>
          </h2>
          <p style={{ opacity: 0.75, fontSize: 14 }}>
            Real pieces from our collections, crafted with clay, pearls, and curiosity.
          </p>
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
        <h2>
          Each item is handcrafted
          <br />
          <i>in small batches.</i>
        </h2>
        <p>
          Celebrating the beautiful textures and joyful imperfections of artisan making. Every piece carries a little bit of the hands that made it.
        </p>

        {/* Why us cards */}
        <div className="why-us-grid">
          <div className="why-card">
            <span className="why-card-icon">
              <Flower2 />
            </span>
            <h3>Small Batches</h3>
            <p>Every piece is made in limited runs — no mass production, no two quite the same.</p>
          </div>
          <div className="why-card">
            <span className="why-card-icon">
              <BadgeCheck />
            </span>
            <h3>Joyful Imperfections</h3>
            <p>The little variations are features, not flaws. They&apos;re proof it was made by human hands.</p>
          </div>
          <div className="why-card">
            <span className="why-card-icon">
              <HandHeart />
            </span>
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
            <p className="eyebrow">
              <MessageSquareHeart size={14} /> love notes from our collectors
            </p>
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
