import Link from "next/link";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";
import { getProduct } from "@/data/store";
import { SiteChrome } from "@/components/Storefront";
import ProductActions from "@/components/ProductActions";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: product } = await getProduct(id);
  if (!product) notFound();
  return <SiteChrome><main className="product-detail">
    <Link href="/shop" className="text-link"><ArrowLeft size={15} /> Back to shop</Link>
    <div className="product-detail-grid">
      <div className="product-gallery">{product.images.length ? product.images.map((image) => <img src={image} alt={product.title} key={image} />) : <div className="product-gallery-empty"><ShoppingBag size={40} /></div>}</div>
      <div className="product-detail-copy"><p className="eyebrow">{product.category ?? "Mrittika Magic"}</p><h1>{product.title}</h1><strong className="product-detail-price">₹{product.price.toLocaleString("en-IN")}</strong><p>{product.description || "A small, joyful piece made to bring more magic into your everyday."}</p><div className="product-detail-note"><Check size={16} /> {product.stock > 0 ? `${product.stock} pieces available` : "Currently sold out"}</div><ProductActions product={product} /></div>
    </div>
  </main></SiteChrome>;
}
