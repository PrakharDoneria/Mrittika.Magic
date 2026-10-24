"use client";

import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useSyncExternalStore, useState } from "react";
import type { Product, CartItem } from "@/data/types";

let wishlistSnapshotRaw = "";
let wishlistSnapshot: Product[] = [];
function getWishlistSnapshot() {
  if (typeof window === "undefined") return wishlistSnapshot;
  const raw = localStorage.getItem("mrittika-wishlist") ?? "[]";
  if (raw !== wishlistSnapshotRaw) {
    wishlistSnapshotRaw = raw;
    try { wishlistSnapshot = JSON.parse(raw) as Product[]; } catch { wishlistSnapshot = []; }
  }
  return wishlistSnapshot;
}

export default function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const wishlist = useSyncExternalStore(
    (onChange) => { window.addEventListener("mrittika-wishlist-updated", onChange); window.addEventListener("storage", onChange); return () => { window.removeEventListener("mrittika-wishlist-updated", onChange); window.removeEventListener("storage", onChange); }; },
    getWishlistSnapshot,
    () => wishlistSnapshot
  );
  const saved = wishlist.some((item) => item.id === product.id);

  function addToCart() {
    const stored = JSON.parse(localStorage.getItem("mrittika-cart") ?? "[]") as CartItem[];
    const next = stored.some((item) => item.id === product.id)
      ? stored.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      : [...stored, { ...product, quantity }];
    localStorage.setItem("mrittika-cart", JSON.stringify(next));
    localStorage.setItem("mrittika-cart-count", String(next.reduce((sum, item) => sum + item.quantity, 0)));
    window.dispatchEvent(new Event("mrittika-cart-updated"));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  function toggleWishlist() {
    const wishlist = JSON.parse(localStorage.getItem("mrittika-wishlist") ?? "[]") as Product[];
    const next = saved ? wishlist.filter((item) => item.id !== product.id) : [...wishlist, product];
    localStorage.setItem("mrittika-wishlist", JSON.stringify(next));
    window.dispatchEvent(new Event("mrittika-wishlist-updated"));
  }

  return <div className="product-actions">
    <div className="product-quantity" aria-label="Quantity">
      <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={15} /></button>
      <span>{quantity}</span>
      <button type="button" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} disabled={quantity >= product.stock} aria-label="Increase quantity"><Plus size={15} /></button>
    </div>
    <button type="button" className={`solid-button product-add-button${added ? " is-added" : ""}`} onClick={addToCart} disabled={product.stock < 1}>
      <ShoppingBag size={16} /> {added ? "Added to bag" : `Add ${quantity} to bag`}
    </button>
    <button type="button" className={`wishlist-button${saved ? " saved" : ""}`} onClick={toggleWishlist} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}>
      <Heart size={19} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
    </button>
  </div>;
}
