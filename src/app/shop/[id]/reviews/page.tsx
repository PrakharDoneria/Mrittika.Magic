import Link from "next/link";
import { ArrowLeft, Star, MessageSquarePlus } from "lucide-react";
import { notFound } from "next/navigation";
import { getProduct, getCategories } from "@/data/store";
import { SiteChrome } from "@/components/Storefront";
import ReviewSection from "@/components/ReviewSection";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await getProduct(id);
  if (!product) return { title: "Reviews not found | Mrittika Magic" };
  return {
    title: `Reviews for ${product.title} | Mrittika Magic`,
    description: `Read customer feedback and reviews for ${product.title}.`,
  };
}

export default async function ProductReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: product } = await getProduct(id);
  if (!product) notFound();
  const { data: categories } = await getCategories();

  return (
    <SiteChrome categories={categories}>
      <main className="product-reviews-page" style={{ maxWidth: 1080, margin: "40px auto 100px", padding: "0 24px" }}>
        <Link href={`/shop/${product.slug}`} className="text-link" style={{ marginBottom: 20, display: "inline-flex" }}>
          <ArrowLeft size={16} /> Back to {product.title}
        </Link>

        {/* Product summary card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: 20,
            border: "2px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            background: "var(--yellow, #FFD633)",
            boxShadow: "4px 4px 0 var(--navy, #080786)",
            marginBottom: 40,
          }}
        >
          <img
            src={product.images[0] || "/logo/logo.jpeg"}
            alt={product.title}
            style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, border: "1.5px solid var(--ink)" }}
          />
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(20px, 3vw, 26px)", color: "var(--ink)" }}>{product.title}</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: "var(--navy, #080786)" }}>
              ₹{product.price.toLocaleString("en-IN")} • Customer Reviews & Feedback
            </p>
          </div>
        </div>

        {/* Full Interactive Review Section */}
        <ReviewSection productId={product.id} />
      </main>
    </SiteChrome>
  );
}
