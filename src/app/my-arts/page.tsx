import Link from "next/link";
import { ArrowRight, Flower2, Heart, Sparkles, Palette } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import { getProducts, getMyArts } from "@/data/store";
import { productPath } from "@/data/product-path";
import AutoScrollCarousel from "@/components/AutoScrollCarousel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "My Arts — Handcrafted Wearable Sculptures & Studio Pieces",
  description: "Explore the studio art of Mrittika Magic: hand-sculpted clay pieces, whimsical curiosities, and textured wearable crafts.",
};

export default async function MyArtsPage() {
  const [{ data: products }, artPieces] = await Promise.all([
    getProducts({ limit: 6 }),
    getMyArts(),
  ]);

  return (
    <SiteChrome>
      {/* Page Hero */}
      <section className="page-hero my-arts-hero">
        <div className="hero-ladybug-cluster" aria-hidden="true">
          <span className="hero-cluster-bug bug-1" />
          <span className="hero-cluster-bug bug-2" />
          <span className="hero-cluster-bug bug-3" />
        </div>
        <p className="eyebrow" style={{ justifyContent: "center" }}>
          <Palette size={14} /> studio archive & wearable crafts
        </p>
        <h1>My <i>Arts.</i></h1>
        <p>
          A peek into hands-on sculptures, tiny experiments, and wearable delights made with intention.
        </p>
      </section>

      {/* Art Gallery Grid */}
      <section className="my-arts-gallery reveal">
        <div className="my-arts-intro">
          <h2>Sculpted by hand, <i>born from curiosity.</i></h2>
          <p>
            Every piece featured here was born from slow experiments at the craft desk. We celebrate
            the playful imperfections, vibrant hues, and unique tactile qualities that make handmade art so intimately human.
          </p>
        </div>

        {artPieces.length > 0 ? (
          <div className="my-arts-grid">
            {artPieces.map((item, idx) => (
              <div key={item.id || item.title} className={`my-arts-card card-color-${idx % 4}`}>
                <div className="my-arts-image-wrapper">
                  <img src={item.image} alt={item.title} />
                  {item.badge && <span className="my-arts-badge">{item.badge}</span>}
                </div>
                <div className="my-arts-card-content">
                  <div className="my-arts-card-meta">
                    <span>{item.category || "Studio Artwork"}</span>
                    <small>{item.year || "2024"}</small>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description || "A one-of-a-kind handcrafted studio piece."}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 24, padding: "48px 24px", border: "2px dashed var(--line, #ccc)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <p style={{ margin: "0 0 10px", fontSize: 18, color: "var(--navy, #080786)", fontWeight: 700 }}>
              No studio artworks in database yet.
            </p>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--muted, #666)" }}>
              Add and manage your one-of-a-kind handcrafted art pieces directly from the Admin Panel.
            </p>
            <Link href="/admin/my-arts" className="solid-button" style={{ display: "inline-flex", fontSize: 13 }}>
              Add Artwork in Admin →
            </Link>
          </div>
        )}
      </section>

      {/* Available Shop Art Drops */}
      {products.length > 0 && (
        <section className="my-arts-shop-section reveal">
          <div className="section-heading">
            <div>
              <p className="eyebrow">available in studio</p>
              <h2>Bring Home <i>Wearable Art</i></h2>
            </div>
            <Link href="/shop" className="text-link">
              Shop full catalog <ArrowRight size={15} />
            </Link>
          </div>

          <AutoScrollCarousel className="drops-scroll" speed={0.8}>
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="art-product-preview-card">
                <Link href={productPath(product)}>
                  <div
                    className="art-preview-image"
                    style={{ backgroundImage: `url('${product.images[0] ?? ""}')` }}
                  />
                </Link>
                <h4>{product.title}</h4>
                <p>₹{product.price}</p>
                <Link href={productPath(product)} className="text-link">
                  View piece <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </AutoScrollCarousel>
        </section>
      )}

      {/* Studio Banner */}
      <section className="my-arts-banner reveal">
        <div className="my-arts-banner-inner">
          <Sparkles size={28} />
          <h2>Want a custom or commissioned piece?</h2>
          <p>
            We occasionally take on bespoke creations, custom palettes, and commemorative bridal/gifting sets.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}>
            <Link href="/shop" className="solid-button">Explore Shop Drops</Link>
            <a href="https://www.instagram.com/mrittika.magic/" target="_blank" rel="noreferrer" className="outline-button">
              DM on Instagram
            </a>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
