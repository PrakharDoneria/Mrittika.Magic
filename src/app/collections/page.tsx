import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import { getCategories, getProducts } from "@/data/store";

const defaultCategoryImages = [
  "/media/necklace.jpeg",
  "/media/ring.jpeg",
  "/media/ear-ring.jpeg",
  "/background/flower.jpeg",
];

const fallbackCollections = [
  { id: "c1", name: "Wearable Clay", slug: "clay", image: "/media/buttons.jpeg", count: "Small Batch" },
  { id: "c2", name: "Chunky Beads & Pearls", slug: "beads", image: "/media/necklace.jpeg", count: "Hand Strung" },
  { id: "c3", name: "Everyday Whimsy", slug: "whimsy", image: "/media/ring.jpeg", count: "Studio Favorites" },
  { id: "c4", name: "Botanical Drops", slug: "botanical", image: "/background/flower.jpeg", count: "Limited Edition" },
];

export default async function CollectionsPage() {
  const [{ data: categories }, { count: productCount }] = await Promise.all([getCategories(), getProducts({ limit: 1 })]);

  return (
    <SiteChrome>
      {/* Page Hero */}
      <section className="page-hero coral">
        <p className="eyebrow" style={{ justifyContent: "center" }}>pick your mood</p>
        <h1>Shop by <i>collection.</i></h1>
        <p>Little worlds of color, carefully collected and made by hand.</p>
      </section>

      {/* Quick Category Chips */}
      <div className="collections-quick-bar" aria-label="Quick Category Filter">
        {(categories.length > 0 ? categories : fallbackCollections).map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${encodeURIComponent(cat.name)}`}
            className="collections-quick-chip"
          >
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* Collections Grid */}
      <section className="collection-grid">
        {(categories.length > 0 ? categories : fallbackCollections).map((category, index) => {
          const imgUrl = "image_url" in category && category.image_url
            ? category.image_url
            : ("image" in category ? category.image : defaultCategoryImages[index % defaultCategoryImages.length]);

          return (
            <Link
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              className={`collection-tile tile-${index} reveal`}
              key={category.id}
            >
              <div style={{ backgroundImage: `url('${imgUrl}')` }} />
              <div>
                <span style={{ fontFamily: "var(--font-hand)", fontSize: 22, opacity: .9, color: "var(--pink)" }}>
                  0{index + 1} ✦ {"count" in category ? category.count : "Collection"}
                </span>
                <h2>{category.name}</h2>
                <b style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--cream)" }}>
                  Explore collection <ArrowRight size={13} />
                </b>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Studio video banner */}
      {!productCount && <section style={{ maxWidth: 1200, margin: "0 auto 80px", padding: "0 30px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          border: "2.5px solid var(--ink)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-pop-lg)",
          background: "var(--lavender)",
        }}>
          <div style={{ position: "relative", minHeight: 320 }}>
            <video
              src="/media/items.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p className="eyebrow">process & craft</p>
            <h2 style={{ fontFamily: "var(--font-display), serif", fontSize: "clamp(32px, 4vw, 48px)", margin: "10px 0 16px", lineHeight: 1 }}>
              Made slowly, <i>loved deeply.</i>
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.75, opacity: .8, margin: 0 }}>
              Each item is handcrafted in small batches, celebrating the beautiful textures and joyful imperfections of artisan making.
            </p>
            <Link href="/about" className="solid-button" style={{ marginTop: 22 }}>
              Read our story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>}

      {/* Bottom CTA */}
      <section style={{ textAlign: "center", padding: "40px 24px 120px" }}>
        <p className="eyebrow" style={{ justifyContent: "center" }}>can&apos;t decide?</p>
        <h2 style={{ fontFamily: "var(--font-display), serif", fontSize: "clamp(36px,4.5vw,56px)", letterSpacing: "-.05em", margin: "16px 0 20px" }}>
          Browse <i style={{ color: "var(--coral)", fontWeight: 400 }}>everything.</i>
        </h2>
        <Link href="/shop" className="solid-button" style={{ margin: "0 auto" }}>
          Shop all products <ArrowRight size={15} />
        </Link>
      </section>
    </SiteChrome>
  );
}
