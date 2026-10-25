import Link from "next/link";
import { ArrowRight, BadgeCheck, Flower2, Gem, Gift, HandHeart } from "lucide-react";
import { getCategories, getProducts } from "@/data/store";
import { ProductCard, SiteChrome } from "@/components/Storefront";
import InstagramFeed from "@/components/InstagramFeed";

export default async function Home() {
  const [{ data: products }, { data: categories }] = await Promise.all([getProducts({ limit: 4 }), getCategories()]);

  return (
    <SiteChrome categories={categories} showLadybug>
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
            { label: "Necklaces & Beads", icon: Gem, color: "var(--lavender)", href: "/shop?category=Necklaces" },
            { label: "Rings & Charms", icon: Gem, color: "var(--pink)", href: "/shop?category=Rings" },
            { label: "Drop Earrings", icon: Flower2, color: "var(--yellow)", href: "/shop?category=Earrings" },
            { label: "Ear Cuffs", icon: Gift, color: "var(--green)", href: "/shop?category=Ear Cuffs" },
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

      {/* ── INSTAGRAM ─────────────────────────────────────── */}
      <InstagramFeed />

      {/* ── SIGN-UP BANNER ────────────────────────────────── */}
      <section className="home-banner reveal" style={{ margin: "0 40px 110px" }}>
        <div>
          <p className="eyebrow">studio notes</p>
          <h2>Good things come<br /><i>to those who take their time.</i></h2>
          <p>Join our little club for new drops, maker stories, and thoughtful notes from the studio.</p>
          <Link href="/account?mode=signup" className="solid-button">
            Join the studio list <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
