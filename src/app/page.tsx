import Link from "next/link";
import { ArrowRight, BadgeCheck, Flower2, Gem, Gift, HandHeart } from "lucide-react";
import { getProducts } from "@/data/store";
import { ProductCard, SiteChrome } from "@/components/Storefront";

export default async function Home() {
  const { data: products } = await getProducts();

  return (
    <SiteChrome>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-home">
        <div className="hero-copy">
          <p className="eyebrow">tiny joys, thoughtfully made</p>
          <h1>Things to<br /><i>make you</i><br />smile.</h1>
          <p>Handcrafted clay, beads, colorful wearable art, and whimsical objects made to brighten up your every day.</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/shop" className="solid-button">
              Shop new drops <ArrowRight size={15} />
            </Link>
            <Link href="/about" className="outline-button">
              Our story <Flower2 size={14} style={{ color: "var(--coral)" }} />
            </Link>
          </div>
        </div>

        {/* Dynamic visual grid using real public media */}
        <div className="hero-visual-grid">
          <div className="hero-visual-card featured-span">
            <video
              src="/media/items.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <span className="hero-badge-pill">Handmade in studio ✿</span>
          </div>
          <div className="hero-visual-card">
            <img
              src="/media/ring.jpeg"
              alt="Handcrafted rings by Mrittika Magic"
            />
          </div>
          <div className="hero-visual-card">
            <img
              src="/background/flower.jpeg"
              alt="Floral inspiration and charms"
            />
          </div>
        </div>
      </section>

      {/* ── MARQUEE 1 ─────────────────────────────────────── */}
      <div className="checker marquee">
        <span>✦ good things for good days &nbsp;&nbsp;&nbsp; ✦ tiny joys, thoughtfully made &nbsp;&nbsp;&nbsp; ✦ handpicked with love &nbsp;&nbsp;&nbsp; ✦ good things for good days &nbsp;&nbsp;&nbsp; ✦ tiny joys, thoughtfully made &nbsp;&nbsp;&nbsp; ✦ handpicked with love &nbsp;&nbsp;&nbsp;</span>
      </div>

      {/* ── INTRO / WHY US ───────────────────────────────── */}
      <section className="intro-section reveal">
        <Flower2 size={26} />
        <p className="eyebrow">our edit for you</p>
        <h2>Curated essentials for <i>refined living.</i></h2>
        <p>Handpicked little treasures for a life that feels more like you. Find a new favorite, or a gift for someone who deserves one.</p>

        {/* Why us cards */}
        <div className="why-us-grid">
          <div className="why-card">
            <span className="why-card-icon"><Flower2 /></span>
            <h3>Holiday Vibes</h3>
            <p>Every piece is designed to bring color and joy into your everyday rituals.</p>
          </div>
          <div className="why-card">
            <span className="why-card-icon"><BadgeCheck /></span>
            <h3>Quality</h3>
            <p>We carefully craft and curate products where quality is our top priority.</p>
          </div>
          <div className="why-card">
            <span className="why-card-icon"><HandHeart /></span>
            <h3>No Mass Production</h3>
            <p>Thoughtfully made in small batches, so every piece feels uniquely special.</p>
          </div>
        </div>

        <Link href="/collections" className="text-link">
          Explore collections <ArrowRight size={15} />
        </Link>
      </section>

      {/* ── STUDIO SHOWCASE: REPOSITIONED REAL MEDIA ─────── */}
      <section className="showcase-strip reveal">
        <div className="showcase-header">
          <p className="eyebrow" style={{ justifyContent: "center" }}>from the studio</p>
          <h2>Handcrafted <i>curiosities.</i></h2>
          <p style={{ opacity: .75, fontSize: 14 }}>Real pieces from our recent collections, crafted with clay, pearls, and curiosity.</p>
        </div>

        <div className="showcase-grid">
          <div className="showcase-item">
            <img src="/media/necklace.jpeg" alt="Handmade statement necklace" />
            <div className="showcase-caption">
              <span>Necklaces</span>
              <small>01</small>
            </div>
          </div>
          <div className="showcase-item">
            <img src="/media/ear-ring.jpeg" alt="Pastel drop earrings" />
            <div className="showcase-caption">
              <span>Earrings</span>
              <small>02</small>
            </div>
          </div>
          <div className="showcase-item">
            <img src="/media/buttons.jpeg" alt="Artisan crafted details" />
            <div className="showcase-caption">
              <span>Artisan Details</span>
              <small>03</small>
            </div>
          </div>
          <div className="showcase-item">
            <img src="/background/pants.jpeg" alt="Playful everyday style" />
            <div className="showcase-caption">
              <span>Everyday Joy</span>
              <small>04</small>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE 2 ─────────────────────────────────────── */}
      <div className="checker marquee marquee-pink">
        <span>✿ shop by collection &nbsp;&nbsp;&nbsp; ✿ new arrivals every week &nbsp;&nbsp;&nbsp; ✿ thoughtfully packed &nbsp;&nbsp;&nbsp; ✿ shop by collection &nbsp;&nbsp;&nbsp; ✿ new arrivals every week &nbsp;&nbsp;&nbsp; ✿ thoughtfully packed &nbsp;&nbsp;&nbsp;</span>
      </div>

      {/* ── FEATURED PRODUCTS ─────────────────────────────── */}
      <section className="featured-section">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">the good stuff</p>
            <h2>Shop our <i>favorites.</i></h2>
          </div>
          <Link href="/shop" className="text-link">See all things <ArrowRight size={15} /></Link>
        </div>

        {products.length ? (
          <div className="shop-grid">
            {products.slice(0, 4).map((product) => (
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

      {/* ── CATEGORY STRIP ────────────────────────────────── */}
      <section style={{ maxWidth: 1320, margin: "0 auto 80px", padding: "0 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { label: "Necklaces & Beads", icon: Gem, color: "var(--lavender)", href: "/shop?category=necklaces" },
            { label: "Rings & Charms", icon: Gem, color: "var(--pink)", href: "/shop?category=rings" },
            { label: "Drop Earrings", icon: Flower2, color: "var(--yellow)", href: "/shop?category=earrings" },
            { label: "Gift Sets", icon: Gift, color: "var(--green)", href: "/shop?category=gifts" },
          ].map(({ label, icon: Icon, color, href }) => (
            <Link
              key={label}
              href={href}
              className="category-link-card"
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "20px 22px",
                border: "2px solid var(--ink)", borderRadius: "var(--radius-md)",
                background: color, color: "var(--ink)", textDecoration: "none",
                fontWeight: 800, fontSize: 13, letterSpacing: ".04em",
                boxShadow: "var(--shadow-pop)",
              }}
            >
              <Icon size={24} strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── SIGN-UP BANNER ────────────────────────────────── */}
      <section className="home-banner reveal" style={{ margin: "0 40px 110px" }}>
        <div>
          <p className="eyebrow">new account treat</p>
          <h2>Good things come<br /><i>to those who sign up.</i></h2>
          <p>Join our little club and get 5% off your first order. No spam, just lovely things and studio notes.</p>
          <Link href="/account?mode=signup" className="solid-button">
            Get my 5% code <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
