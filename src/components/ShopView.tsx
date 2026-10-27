"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import type { Category, Product } from "@/data/types";
import { ProductCard } from "./Storefront";
import { trackEvent } from "@/lib/analytics";

export default function ShopView({ products, categories: supabaseCategories, page, total, selectedCategory }: { products: Product[]; categories: Category[]; page: number; total: number; selectedCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(selectedCategory ?? "All");
  const router = useRouter();
  const activeCategory = selectedCategory ?? category;
  const categories = ["All", ...supabaseCategories.map((item) => item.name)];
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) return;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      trackEvent("product_search", { search_query: query.trim() });
    }, 800);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [query]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [products, query, sortBy]);

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
        {/* Scroll view bar for categories (above search & filters, below toolbar container top) */}
        <div className="shop-toolbar">
          <div className="category-tabs" aria-label="Filter by category">
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

          <div className="shop-search-row">
            <label className="search-field">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
              />
            </label>
            <button
              className={`filter-button ${showFilterPanel ? "active" : ""}`}
              type="button"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              aria-label="Toggle filter panel"
            >
              <SlidersHorizontal size={15} /> Filters {sortBy !== "featured" && "•"}
            </button>
          </div>

          {/* Interactive Filters Panel */}
          {showFilterPanel && (
            <div
              className="filters-dropdown-panel reveal visible"
              style={{
                marginTop: 14,
                padding: "16px 20px",
                border: "2px solid var(--ink)",
                borderRadius: "var(--radius-md)",
                background: "#ffffff",
                boxShadow: "3px 3px 0 var(--pink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink)" }}>
                  Sort By:
                </span>
                {[
                  { id: "featured", label: "Featured" },
                  { id: "newest", label: "Newest First" },
                  { id: "price-asc", label: "Price: Low to High" },
                  { id: "price-desc", label: "Price: High to Low" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSortBy(opt.id as any)}
                    style={{
                      padding: "6px 14px",
                      border: "1.5px solid var(--ink)",
                      borderRadius: 999,
                      background: sortBy === opt.id ? "var(--yellow, #FFD633)" : "#f6f3f8",
                      fontWeight: sortBy === opt.id ? 800 : 600,
                      fontSize: 12,
                      cursor: "pointer",
                      boxShadow: sortBy === opt.id ? "2px 2px 0 var(--ink)" : "none",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {(sortBy !== "featured" || query) && (
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("featured");
                    setQuery("");
                  }}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--coral)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>
          )}
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
