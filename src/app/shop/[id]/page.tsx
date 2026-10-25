import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { getProduct, getCategories } from "@/data/store";
import { SiteChrome } from "@/components/Storefront";
import ProductActions from "@/components/ProductActions";
import ProductGallery from "@/components/ProductGallery";
import ReviewSection from "@/components/ReviewSection";
import { productPath } from "@/data/product-path";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await getProduct(id);
  if (!product) return { title: "Product not found | Mrittika Magic" };
  return { title: product.title, description: product.description ?? `Shop ${product.title}, handcrafted by Mrittika Magic.`, alternates: { canonical: productPath(product) }, openGraph: { title: product.title, description: product.description ?? `Shop ${product.title} from Mrittika Magic.`, images: product.images[0] ? [product.images[0]] : ["/brand/og-image.jpg"] } };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: product } = await getProduct(id);
  if (!product) notFound();
  const { data: categories } = await getCategories();

  return (
    <SiteChrome categories={categories}>
      <main className="product-detail">
        <Link href="/shop" className="text-link">
          <ArrowLeft size={15} /> Back to shop
        </Link>
        <div className="product-detail-grid">
          <ProductGallery images={product.images} title={product.title} />
          <div className="product-detail-copy">
            <p className="eyebrow">{product.category ?? "Mrittika Magic"}</p>
            <h1>{product.title}</h1>
            <strong className="product-detail-price">₹{product.price.toLocaleString("en-IN")}</strong>
            <p>{product.description || "A small, joyful piece made to bring more magic into your everyday."}</p>
            <div className="product-detail-note">
              <Check size={16} /> {product.stock > 0 ? `${product.stock} pieces available` : "Currently sold out"}
            </div>
            {(product.sku || product.material || product.dimensions || product.weight || product.care_instructions) && (
              <div className="product-extra-details">
                {product.sku && <span>SKU <strong>{product.sku}</strong></span>}
                {product.material && <span>Material <strong>{product.material}</strong></span>}
                {product.dimensions && <span>Dimensions <strong>{product.dimensions}</strong></span>}
                {product.weight ? <span>Weight <strong>{product.weight} g</strong></span> : null}
                {product.care_instructions && <span>Care <strong>{product.care_instructions}</strong></span>}
              </div>
            )}
            <ProductActions product={product} />
          </div>
        </div>
        <ReviewSection productId={product.id} />
      </main>
    </SiteChrome>
  );
}
