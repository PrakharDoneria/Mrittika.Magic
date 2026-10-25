"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import type { Category, Product } from "@/data/types";
import { ProductCard } from "./Storefront";

export default function ShopView({ products, categories: supabaseCategories, page, total, selectedCategory }: { products: Product[]; categories: Category[]; page: number; total: number; selectedCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(selectedCategory ?? "All");
  const router = useRouter();
  const activeCategory = selectedCategory ?? category;
  const categories = ["All", ...supabaseCategories.map((item) => item.name)];
  const filtered = useMemo(
    () => products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())),
    [products, query]
  );

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero lavender">
        <p className="eyebrow" style={{ justifyContent: "center" }}>take your time</p>
        <h1>Find your <i>new favorite.</i></h1>
        <p>A joyful little edit of objects, gifts, and everyday essentials.</p>
      </section>

      {/* Shop Layout */}
      <section className="shop-layout">
        {/* Toolbar */}
        <div className="shop-toolbar">
          <label className="search-field">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
            />
          </label>
          <button className="filter-button">
            <SlidersHorizontal size={15} /> Filters
          </button>
          <div className="category-tabs">
            {categories.map((item) => (
              <button
                key={item}
                className={activeCategory === item ? "active" : ""}
                onClick={() => {
                  setCategory(item);
                  router.push(item === "All" ? "/shop" : `/shop?category=${encodeURIComponent(item)}`);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        {filtered.length > 0 && (
          <p style={{ fontSize: 12, opacity: .55, marginBottom: 28, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </p>
        )}

        {/* Grid */}
        <div className="shop-grid">
          {filtered.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
        {total > 12 && <nav className="pagination" aria-label="Product pages">
          <a aria-disabled={page === 1} href={`/shop?page=${page - 1}${activeCategory !== "All" ? `&category=${encodeURIComponent(activeCategory)}` : ""}`}><ChevronLeft size={16} /></a>
          <span>Page {page} of {Math.ceil(total / 12)}</span>
          <a aria-disabled={page >= Math.ceil(total / 12)} href={`/shop?page=${page + 1}${activeCategory !== "All" ? `&category=${encodeURIComponent(activeCategory)}` : ""}`}><ChevronRight size={16} /></a>
        </nav>}

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="empty-state">
            <p className="quote-mark">&quot;</p>
            <h2>Your next favorite is still waiting to be found.</h2>
            <p>There are no published pieces here yet. Check back soon for something lovely.</p>
          </div>
        )}
      </section>
    </>
  );
}
