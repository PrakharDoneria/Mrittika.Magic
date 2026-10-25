"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
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

  return <section className="wishlist-page">
    <Heart size={30} />
    <p className="eyebrow">your saved things</p>
    <h1>Your wishlist is <i>{products.length ? "full of magic." : "ready for magic."}</i></h1>
    {products.length ? <div className="shop-grid">{products.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <><p>Save products you love and they will appear here. Your next favorite might be one click away.</p><Link href="/shop" className="solid-button">Browse the shop →</Link></>}
  </section>;
}
