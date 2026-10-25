import Link from "next/link";
import { ArrowRight, BadgeCheck, Flower2, Gem, Gift, HandHeart, Sparkles } from "lucide-react";
import { getCategories, getProducts } from "@/data/store";
import { ProductCard, SiteChrome } from "@/components/Storefront";
import InstagramFeed from "@/components/InstagramFeed";
import { productPath } from "@/data/product-path";

const VIBES = [
  {
    title: "The Dreamer",
    desc: "Pastel florals, romantic clay textures, and soft nostalgia.",
    colorClass: "pink",
    image: "/background/flower.jpeg",
    tag: "floral & soft",
  },
  {
    title: "The Bold One",
    desc: "Vibrant wearable statements made for main character energy.",
    colorClass: "yellow",
    image: "/media/necklace.jpeg",
    tag: "vibrant pop",
  },
  {
    title: "The Quiet Artist",
    desc: "Organic beads, earthy clay drops, and subtle understated pieces.",
    colorClass: "blue",
    image: "/media/ring.jpeg",
    tag: "minimal textures",
  },
  {
    title: "The Gift Giver",
    desc: "Curated sets and tiny handcrafted tokens to brighten days.",
    colorClass: "purple",
    image: "/media/buttons.jpeg",
    tag: "thoughtful sets",
  },
];

export default async function Home() {
  const [{ data: products }, { data: categories }] = await Promise.all([getProducts({ limit: 8 }), getCategories()]);

  return (
    <SiteChrome categories={categories} showLadybug>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-home">
        <div className="hero-copy">
          <div className="hero-pants-bg" aria-hidden="true" />
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

          {/* Mobile-only text overlay rendered over the video */}
          <div className="hero-mobile-overlay">
            <span className="hero-mobile-eyebrow">tiny joys, thoughtfully made</span>
            <h1>Welcome<br />to <em>Mrittika</em></h1>
            <p>Handcrafted wearable art, made in small batches with love.</p>
            <div className="hero-mobile-ctas">
              <Link href="/shop">Shop new drops <ArrowRight size={13} /></Link>
              <Link href="/about">Our story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE 1 ─────────────────────────────────────── */}
      <div className="checker marquee">
        <span>✦ good things for good days &nbsp;&nbsp;&nbsp; ✦ tiny joys, thoughtfully made &nbsp;&nbsp;&nbsp; ✦ handpicked with love &nbsp;&nbsp;&nbsp; ✦ good things for good days &nbsp;&nbsp;&nbsp; ✦ tiny joys, thoughtfully made &nbsp;&nbsp;&nbsp; ✦ handpicked with love &nbsp;&nbsp;&nbsp;</span>
      </div>

      {/* ── SHOP BY VIBE / FOR EVERY PERSONALITY ──────────── */}
      <section id="vibe-section" className="vibe-section reveal">
        <div className="vibe-header">
          <p className="eyebrow" style={{ color: "var(--ink)", opacity: 0.8 }}>curated for you</p>
          <h2>For Every <i>Personality</i></h2>
          <p style={{ fontSize: "14px", opacity: 0.8, maxWidth: "440px", margin: "6px auto 0" }}>
            Whether you lean playful, quiet, or unapologetically bold — find pieces that mirror your magic.
          </p>
        </div>

        <div className="vibe-grid">
          {VIBES.map((vibe) => (
            <Link
              key={vibe.title}
              href="/shop"
              className={`vibe-card ${vibe.colorClass}`}
            >
              <div className="vibe-image-wrap">
                <img src={vibe.image} alt={vibe.title} />
              </div>
              <h3>{vibe.title}</h3>
              <p>{vibe.desc}</p>
            </Link>
          ))}
        </div>
      </section>

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

        <div className="collections-explore-wrap">
          <Link href="/collections" className="text-link">
            Explore collections <ArrowRight size={15} />
          </Link>
          <div className="collections-quick-strip" aria-label="Browse categories">
            {[
              { name: "Clay", image: "/media/buttons.jpeg" },
              { name: "Necklaces", image: "/media/necklace.jpeg" },
              { name: "Earrings", image: "/media/ear-ring.jpeg" },
              { name: "Rings", image: "/media/ring.jpeg" },
              { name: "Ear Cuffs", image: "/background/flower.jpeg" },
            ].map((cat) => (
              <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.name)}`} className="collection-chip">
                <div className="collection-chip-avatar">
                  <img src={cat.image} alt={cat.name} />
                </div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS (FRESH DROPS SCROLLER ON MOBILE) ── */}
      <section className="featured-section">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">fresh curations</p>
            <h2>Checkout the <i>latest drops!</i></h2>
          </div>
          <Link href="/shop" className="text-link">Shop More <ArrowRight size={15} /></Link>
        </div>

        {products.length ? (
          <div className="drops-scroll">
            {products.slice(0, 6).map((product) => (
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

      {/* ── SPOTLIGHT (STUDIO PICKS - KALA CURRY INSPIRED) ─ */}
      {products.length >= 3 && (
        <section className="spotlight-section reveal">
          <div className="spotlight-header">
            <p className="eyebrow" style={{ color: "var(--ink)", opacity: 0.8 }}>editorial curation</p>
            <h2>Studio <i>Picks</i></h2>
            <p style={{ fontSize: "14px", opacity: 0.8, margin: "4px auto 0" }}>
              A handpicked spotlight of our studio favorites.
            </p>
          </div>

          <div className="spotlight-grid">
            {products.slice(0, 6).map((p) => (
              <Link href={productPath(p)} key={p.id} className="spotlight-item">
                <div className="spotlight-thumb">
                  <img src={p.images[0] || "/logo/logo.jpeg"} alt={p.title} />
                </div>
                <span>{p.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── SHOP BY CRAFT (CIRCLES) ───────────────────────── */}
      <section className="craft-section reveal">
        <div className="craft-header">
          <p className="eyebrow" style={{ justifyContent: "center" }}>artisan techniques</p>
          <h2>Shop By <i>Craft</i></h2>
        </div>

        <div className="craft-circles">
          <Link href="/shop?category=Clay" className="craft-circle-item">
            <div className="craft-circle">
              <img src="/media/buttons.jpeg" alt="Clay" />
            </div>
            <span>Clay</span>
          </Link>
          <Link href="/shop?category=Earrings" className="craft-circle-item">
            <div className="craft-circle">
              <img src="/media/ear-ring.jpeg" alt="Beads & Pearls" />
            </div>
            <span>Beads & Pearls</span>
          </Link>
          <Link href="/shop?category=Necklaces" className="craft-circle-item">
            <div className="craft-circle">
              <img src="/media/necklace.jpeg" alt="Wearable Art" />
            </div>
            <span>Wearable Art</span>
          </Link>
        </div>
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

      {/* ── CATEGORY STRIP ────────────────────────────────── */}
      {/* Desktop grid */}
      <section className="home-categories-desktop" style={{ maxWidth: 1320, margin: "0 auto 80px", padding: "0 40px" }}>
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
    </SiteChrome>
  );
}
