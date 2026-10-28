"use client";

import Link from "next/link";
import { ArrowRight, Heart, Sparkles, ShoppingBag } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { Product } from "@/data/types";
import { ProductCard } from "./Storefront";

let wishlistRaw = "";
let wishlistItems: Product[] = [];

function getWishlist() {
  if (typeof window === "undefined") return wishlistItems;
  const raw = window.localStorage.getItem("mrittika-wishlist") ?? "[]";
  if (raw !== wishlistRaw) {
    wishlistRaw = raw;
    try {
      wishlistItems = JSON.parse(raw) as Product[];
    } catch {
      wishlistItems = [];
    }
  }
  return wishlistItems;
}

export default function WishlistView() {
  const products = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("mrittika-wishlist-updated", onChange);
      window.addEventListener("storage", onChange);
      return () => {
        window.removeEventListener("mrittika-wishlist-updated", onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    getWishlist,
    () => wishlistItems,
  );

  return (
    <main className="wishlist-page">
      <div className="wishlist-hero-block">
        <div className="wishlist-icon-badge" aria-hidden="true">
          <Heart size={26} className="wishlist-heart-pulse" />
        </div>
        <p className="eyebrow">
          <Sparkles size={13} /> your saved treasures
        </p>
        <h1>
          Your wishlist is{" "}
          <i>{products.length ? "full of magic." : "ready for magic."}</i>
        </h1>
        {products.length > 0 && (
          <p className="wishlist-count-badge">
            {products.length} {products.length === 1 ? "piece" : "pieces"} saved
          </p>
        )}
      </div>

      {products.length ? (
        <div className="wishlist-products-container">
          <div className="shop-grid wishlist-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
          <div className="wishlist-footer-action">
            <Link href="/shop" className="outline-button">
              Explore More Pieces <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      ) : (
        <section className="wishlist-empty-card">
          <div className="empty-heart-ring">
            <Heart size={44} />
          </div>
          <h2>Nothing saved just yet.</h2>
          <p>
            Tap the heart icon on any handmade earrings, necklace, or clay curiosity
            to save it here while you decide.
          </p>
          <Link href="/shop" className="solid-button">
            Start Exploring <ArrowRight size={15} />
          </Link>
        </section>
      )}
    </main>
  );
}
