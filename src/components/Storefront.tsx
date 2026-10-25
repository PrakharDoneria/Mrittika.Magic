"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Camera, ChevronDown, Flower2, Heart, Menu, Search, ShoppingBag, Star, UserRound, X } from "lucide-react";
import type { CartItem, Category } from "@/data/types";
import { productPath } from "@/data/product-path";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/* ─── Scroll-reveal hook ──────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── SiteChrome ──────────────────────────────────────── */
export function SiteChrome({ children, categories = [], showLadybug = false }: { children: React.ReactNode; categories?: Category[]; showLadybug?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useReveal();

  useEffect(() => {
    const updateCount = () => setCartCount(Number(localStorage.getItem("mrittika-cart-count") ?? 0));
    updateCount();
    window.addEventListener("mrittika-cart-updated", updateCount);
    return () => window.removeEventListener("mrittika-cart-updated", updateCount);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site-shell">
      {/* Header */}
      <header className="site-header" style={scrolled ? { boxShadow: "0 3px 0 var(--pink), 0 6px 24px #2b1d2214" } : undefined}>
        <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="brand"><img src="/logo/logo.jpeg" alt="Mrittika Magic" /></Link>

        <nav className={menuOpen ? "main-nav open" : "main-nav"}>
          <button className="drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={20} /></button>
          <Link href="/shop"        onClick={() => setMenuOpen(false)}>Shop all</Link>
          <Link href="/collections" onClick={() => setMenuOpen(false)}>Collections</Link>
          {categories.length > 0 && (
            <div className="nav-dropdown">
              <button type="button" className="nav-dropdown-trigger">
                <span>Categories</span>
                <ChevronDown size={13} className="nav-chevron" />
              </button>
              <div className="nav-dropdown-menu">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${encodeURIComponent(category.name)}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <Link href="/about"       onClick={() => setMenuOpen(false)}>Our story</Link>
          <Link href="/journal"     onClick={() => setMenuOpen(false)}>Journal</Link>
        </nav>

        <div className="header-actions">
          <Link href="/shop"               className="icon-button" aria-label="Search"><Search size={18} /></Link>
          <Link href="/account"            className="icon-button" aria-label="Account"><UserRound size={18} /></Link>
          <Link href="/account?tab=wishlist" className="icon-button" aria-label="Wishlist"><Heart size={18} /></Link>
          <Link href="/cart"               className="icon-button cart-icon" aria-label="Shopping bag">
            <ShoppingBag size={19} />
            {cartCount > 0 && <b>{cartCount}</b>}
          </Link>
        </div>
      </header>

      {showLadybug && <div className="ladybug" aria-hidden="true"><span>●</span><i>••</i></div>}
      {children}

      {/* Footer */}
      <footer className="site-footer">
        <div>
          <Link href="/" className="brand"><img src="/logo/logo.jpeg" alt="Mrittika Magic" /></Link>
          <p>Thoughtful things, happy colors, and a little bit of everyday magic.</p>
          <div style={{ display: "flex", gap: "14px", marginTop: "16px" }}>
            <a href="https://www.instagram.com/mrittika.magic/" target="_blank" rel="noreferrer" aria-label="Mrittika Magic on Instagram"><Camera size={18} /></a>
          </div>
        </div>
        <div>
          <strong>Explore</strong>
          <Link href="/shop">Shop all</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/about">Our story</Link>
          <Link href="/return-policy">Return policy</Link>
        </div>
        <div>
          <strong>Stay in the loop</strong>
          <p>Get first dibs on new drops and thoughtful notes from the studio.</p>
          <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="Your email address" />
            <button aria-label="Subscribe"><ArrowRight size={18} /></button>
          </form>
          <p style={{ marginTop: "20px", fontSize: "11px", opacity: .5, letterSpacing: ".08em" }}>
            © {new Date().getFullYear()} Mrittika Magic. Thoughtfully made.
          </p>
        </div>
      </footer>
      <span className="sr-only">{cartCount}</span>
    </div>
  );
}

/* ─── ProductCard ─────────────────────────────────────── */
export function ProductCard({ product, onAdd }: { product: import("@/data/types").Product; onAdd?: () => void }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function addProduct(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (onAdd) { onAdd(); }
    else {
      const stored = JSON.parse(localStorage.getItem("mrittika-cart") ?? "[]") as CartItem[];
      const existing = stored.find((item) => item.id === product.id);
      const currentQty = existing?.quantity ?? 0;
      if (currentQty >= product.stock) {
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
        return;
      }
      const addQty = Math.min(qty, product.stock - currentQty);
      const nextItems = existing
        ? stored.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + addQty } : item)
        : [...stored, { ...product, quantity: addQty }];
      const nextCount = nextItems.reduce((total, item) => total + item.quantity, 0);
      localStorage.setItem("mrittika-cart", JSON.stringify(nextItems));
      localStorage.setItem("mrittika-cart-count", String(nextCount));
      window.dispatchEvent(new Event("mrittika-cart-updated"));
    }
    setAdded(true);
    setQty(1);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="product-card reveal">
      <div className="product-visual">
        <Link href={productPath(product)} aria-label={`View ${product.title}`} className="product-image-link">
          <div className="product-image" style={{ backgroundImage: `url('${product.images[0] ?? ""}')` }} />
        </Link>
        {product.stock === 0 && <span className="product-tag">sold out</span>}

        {/* Quick-add row: qty stepper + add button */}
        <div className="quick-add-row">
          <div className="quick-add-qty" aria-label="Quantity">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setQty((v) => Math.max(1, v - 1)); }}
              aria-label="Decrease"
              disabled={qty <= 1}
            >−</button>
            <span>{qty}</span>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setQty((v) => Math.min(product.stock, v + 1)); }}
              aria-label="Increase"
              disabled={qty >= product.stock}
            >+</button>
          </div>
          <button
            onClick={addProduct}
            className={`quick-add${added ? " is-added" : ""}`}
            disabled={product.stock === 0}
            style={added ? { background: "var(--green)", color: "#fff", borderColor: "var(--green)" } : undefined}
          >
            {added ? "✓ Added!" : "Add to bag"}
          </button>
        </div>
      </div>
      <Link href={productPath(product)} className="product-name">{product.title}</Link>
      <span className="product-meta">{product.category ?? "Mrittika Magic"}</span>
      {product.review_count ? (
        <span
          className="product-rating"
          aria-label={`${product.rating?.toFixed(1)} out of 5 from ${product.review_count} reviews`}
        >
          <span>{Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={13} fill={i < Math.round(product.rating ?? 0) ? "currentColor" : "none"} />
          ))}</span>
          {product.rating?.toFixed(1)} ({product.review_count})
        </span>
      ) : null}
      <strong>{money.format(product.price)}</strong>
    </article>
  );
}
