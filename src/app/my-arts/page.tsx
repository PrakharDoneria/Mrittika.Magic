import Link from "next/link";
import { ArrowRight, Flower2, Heart, Sparkles, Palette } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import { getProducts } from "@/data/store";
import { productPath } from "@/data/product-path";

export const metadata = {
  title: "My Arts — Handcrafted Wearable Sculptures & Studio Pieces",
  description: "Explore the studio art of Mrittika Magic: hand-sculpted clay pieces, whimsical curiosities, and textured wearable crafts.",
};

const ART_GALLERY = [
  {
    title: "Hand-Molded Clay Botanicals",
    category: "Clay & Flora",
    year: "2024",
    image: "/media/buttons.jpeg",
    description: "Each floral motif is pinched, carved, and baked slowly in miniature batches.",
    badge: "Limited Edition",
  },
  {
    title: "Curious Beaded Statements",
    category: "Wearable Art",
    year: "2024",
    image: "/media/necklace.jpeg",
    description: "A playful dance between freshwater pearls, raw polymer forms, and vintage beads.",
    badge: "Studio Signature",
  },
  {
    title: "Pastel Drop Sculptures",
    category: "Earring Form",
    year: "2024",
    image: "/media/ear-ring.jpeg",
    description: "Featherlight earrings created to bring movement, color, and gentle optimism.",
    badge: "Artisan Favorite",
  },
  {
    title: "Organic Minimal Rings",
    category: "Ring Art",
    year: "2024",
    image: "/media/ring.jpeg",
    description: "Sculpted by hand to fit effortlessly, celebrating tactile textures and wonky charm.",
    badge: "Hand-molded",
  },
  {
    title: "Botanical Color Clashes",
    category: "Experimentations",
    year: "2024",
    image: "/background/flower.jpeg",
    description: "Studies in saturated yellows, lilac washes, and sky blues straight from studio tables.",
    badge: "Palette Drop",
  },
  {
    title: "Ladybug Charm Explorations",
    category: "Whimsical Series",
    year: "2024",
    image: "/background/pants.jpeg",
    description: "Playful everyday curiosities that turn garments into happy, interactive canvases.",
    badge: "Iconic Whimsy",
  },
];

export default async function MyArtsPage() {
  const { data: products } = await getProducts({ limit: 6 });

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

        <div className="my-arts-grid">
          {ART_GALLERY.map((item, idx) => (
            <div key={item.title} className={`my-arts-card card-color-${idx % 4}`}>
              <div className="my-arts-image-wrapper">
                <img src={item.image} alt={item.title} />
                <span className="my-arts-badge">{item.badge}</span>
              </div>
              <div className="my-arts-card-content">
                <div className="my-arts-card-meta">
                  <span>{item.category}</span>
                  <small>{item.year}</small>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
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

          <div className="drops-scroll">
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
          </div>
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
