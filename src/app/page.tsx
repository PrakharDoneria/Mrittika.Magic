import Link from "next/link";
import { ArrowRight, BadgeCheck, Flower2, HandHeart } from "lucide-react";
import { getCategories, getProducts } from "@/data/store";
import { ProductCard, SiteChrome } from "@/components/Storefront";
import InstagramFeed from "@/components/InstagramFeed";
import FeedbackSection from "@/components/FeedbackSection";

export default async function Home() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    getProducts({ limit: 12 }),
    getCategories(),
  ]);

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

          {/* Ladybug charms over jeans background */}
          <div className="hero-ladybug-cluster" aria-hidden="true">
            <span className="hero-cluster-bug bug-1" />
            <span className="hero-cluster-bug bug-2" />
            <span className="hero-cluster-bug bug-3" />
            <span className="hero-cluster-bug bug-4" />
          </div>

          <div className="hero-jeans-foreground">
            <h1 className="hero-jeans-script-title">
              Welcome<br />
              <span>to Mrittika</span>
            </h1>
            <p className="hero-jeans-tagline">where magic happens</p>
            <div className="hero-jeans-actions">
              <Link href="/shop" className="hero-jeans-btn primary">
                Shop new drops <ArrowRight size={14} />
              </Link>
              <Link href="/about" className="hero-jeans-btn secondary">
                Our story <Flower2 size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FRESH CURATION / CHECKOUT LATEST COLLECTION ───────── */}
      <section className="featured-section">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">fresh curations</p>
            <h2>Checkout the <i>latest drops!</i></h2>
          </div>
          <Link href="/shop" className="text-link">Shop More <ArrowRight size={15} /></Link>
        </div>

        {products.length > 0 ? (
          <div className="drops-scroll">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
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
          <div className="showcase-grid">
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
          </div>
        ) : (
          <div className="showcase-grid">
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
          </div>
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

      {/* ── 5. FOLLOW ALONG / INSTAGRAM ───────────────────────────── */}
      <InstagramFeed />

      {/* ── 6. FEEDBACK SECTION IN THE HOME PAGE ─────────────────── */}
      <FeedbackSection />
    </SiteChrome>
  );
}

