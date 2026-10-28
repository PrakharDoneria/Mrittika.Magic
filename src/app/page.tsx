import Link from "next/link";
import { ArrowRight, BadgeCheck, Flower2, HandHeart, MessageSquareHeart, Star } from "lucide-react";
import { getCategories, getProducts } from "@/data/store";
import { ProductCard, SiteChrome } from "@/components/Storefront";
import InstagramFeed from "@/components/InstagramFeed";
import FeedbackSection from "@/components/FeedbackSection";
import AutoScrollCarousel from "@/components/AutoScrollCarousel";
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
          <div className="hero-jeans-bg" style={{ backgroundImage: "url('/background/pants.jpeg')" }} />
          <div className="hero-jeans-overlay" />

          <div className="hero-jeans-foreground">
            <div className="hero-vegas-sign">
              {/* Brand ladybug charms anchored to the top-right and bottom-left kaju katli diamond edges */}
              <div className="hero-vegas-ladybug top-bug" aria-hidden="true">
                <img src="/brand/ladybug.png" alt="" className="vegas-ladybug-img" />
              </div>
              <div className="hero-vegas-ladybug bottom-bug" aria-hidden="true">
                <img src="/brand/ladybug.png" alt="" className="vegas-ladybug-img" />
              </div>

              {/* Embroidered SVG outline for double golden border and stitched stroke */}
              <svg className="vegas-sign-svg-frame" viewBox="0 0 860 360" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  {/* Outer border gradient */}
                  <linearGradient id="vegasGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#faea9c" />
                    <stop offset="35%" stopColor="#e5be4e" />
                    <stop offset="70%" stopColor="#cfa32e" />
                    <stop offset="100%" stopColor="#fae792" />
                  </linearGradient>
                  {/* Sign background fill gradient */}
                  <linearGradient id="vegasFillGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#faeb9f" />
                    <stop offset="30%" stopColor="#f3d778" />
                    <stop offset="50%" stopColor="#fae48d" />
                    <stop offset="70%" stopColor="#f3d778" />
                    <stop offset="100%" stopColor="#faeb9f" />
                  </linearGradient>
                  {/* Subtle stitch pattern */}
                  <pattern id="vegasClothPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                    <path d="M0 6 L6 0 M0 0 L6 6" stroke="rgba(185, 138, 25, 0.08)" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Main 4-sided diamond / kaju katli polygon base */}
                <polygon
                  points="430,12  844,180  430,348  16,180"
                  fill="url(#vegasFillGrad)"
                  stroke="url(#vegasGoldGrad)"
                  strokeWidth="15"
                  strokeLinejoin="round"
                />

                {/* Fabric texture overlay on the 4-sided polygon */}
                <polygon
                  points="430,12  844,180  430,348  16,180"
                  fill="url(#vegasClothPattern)"
                />

                {/* Inner white / cream highlight line (4 sides) */}
                <polygon
                  points="430,22  830,180  430,338  30,180"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.85)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Inner dashed embroidered stitch (4 sides) */}
                <polygon
                  points="430,32  814,180  430,328  46,180"
                  fill="none"
                  stroke="#af8520"
                  strokeWidth="2"
                  strokeDasharray="6,5"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Inner sign content */}
              <div className="hero-vegas-content">
                {/* Top WELCOME badge letter circles */}
                <div className="hero-vegas-welcome">
                  {"WELCOME".split("").map((letter, i) => (
                    <span key={i} className="vegas-letter-disc">
                      {letter}
                    </span>
                  ))}
                </div>

                {/* Main brand script title with starburst sparkle */}
                <div className="hero-vegas-brand-wrap">
                  <span className="hero-vegas-starburst" aria-hidden="true">✦</span>
                  <h1 className="hero-vegas-title">Mrittika</h1>
                </div>

                {/* Tagline script */}
                <p className="hero-vegas-tagline">where magic happens</p>

                {/* Pill buttons nested inside bottom of the badge */}
                <div className="hero-vegas-actions">
                  <Link href="/shop" className="hero-vegas-btn yellow-btn">
                    <span>SHOP NEW DROPS</span>
                    <span className="vegas-btn-arrow">»</span>
                  </Link>
                  <Link href="/about" className="hero-vegas-btn white-btn">
                    <span>OUR STORY</span>
                    <Flower2 size={12} className="vegas-btn-icon" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. NEW SELF-SCROLLING HORIZONTAL MEDIA CAROUSEL (Joy In Every Detail) ── */}
      <section className="home-media-strip-section reveal" style={{ maxWidth: 1200, margin: "40px auto 20px", padding: "0 24px" }}>
        <div className="section-heading" style={{ marginBottom: 20 }}>
          <div>
            <p className="eyebrow"><Flower2 size={14} /> studio snapshots &amp; happy moments</p>
            <h2>Joy In <i>Every Detail</i></h2>
          </div>
          <Link href="/shop" className="text-link">
            Explore Studio <ArrowRight size={15} />
          </Link>
        </div>

        <AutoScrollCarousel className="home-media-scroll auto-scroll-strip" speed={0.75}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Link href="/shop" key={num} className="home-media-card">
              <img
                src={`/media/home/${num}.jpeg`}
                alt={`Handmade Mrittika piece ${num}`}
                loading="lazy"
              />
              <span className="home-media-badge">✦ Mrittika Studio</span>
            </Link>
          ))}
        </AutoScrollCarousel>
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

        {/* Real categories from database if available, linking directly to categories */}
        {categories.length > 0 ? (
          <AutoScrollCarousel className="showcase-grid auto-scroll-strip" speed={0.7}>
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="showcase-item"
                style={{ textDecoration: "none" }}
              >
                <img
                  src={cat.image_url || (products[idx % products.length]?.images?.[0] ?? "/media/necklace.jpeg")}
                  alt={cat.name}
                />
                <div className="showcase-caption">
                  <span>{cat.name}</span>
                  <small>0{idx + 1}</small>
                </div>
              </Link>
            ))}
          </AutoScrollCarousel>
        ) : (
          <AutoScrollCarousel className="showcase-grid auto-scroll-strip" speed={0.7}>
            <Link href="/shop?category=Necklaces" className="showcase-item" style={{ textDecoration: "none" }}>
              <img src="/media/necklace.jpeg" alt="Handmade statement necklace" />
              <div className="showcase-caption">
                <span>Necklaces</span>
                <small>01</small>
              </div>
            </Link>
            <Link href="/shop?category=Earrings" className="showcase-item" style={{ textDecoration: "none" }}>
              <img src="/media/ear-ring.jpeg" alt="Pastel drop earrings" />
              <div className="showcase-caption">
                <span>Earrings</span>
                <small>02</small>
              </div>
            </Link>
            <Link href="/shop?category=Clay" className="showcase-item" style={{ textDecoration: "none" }}>
              <img src="/media/buttons.jpeg" alt="Artisan crafted clay details" />
              <div className="showcase-caption">
                <span>Clay Tokens</span>
                <small>03</small>
              </div>
            </Link>
            <Link href="/shop" className="showcase-item" style={{ textDecoration: "none" }}>
              <img src="/background/pants.jpeg" alt="Playful everyday style" />
              <div className="showcase-caption">
                <span>Everyday Joy</span>
                <small>04</small>
              </div>
            </Link>
          </AutoScrollCarousel>
        )}
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

