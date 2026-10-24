"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Camera, Flower2, Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import type { CartItem } from "@/data/types";

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
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  useReveal();

  useEffect(() => {
    const updateCount = () => setCartCount(Number(localStorage.getItem("mrittika-cart-count") ?? 0));
    updateCount();
    window.addEventListener("mrittika-cart-updated", updateCount);
    return () => window.removeEventListener("mrittika-cart-updated", updateCount);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site-shell">
      {/* Promo bar */}
      {!signedIn && <div className="promo-bar">
        <span>New here? Create an account and get 5% off</span>
        <Link href="/account?mode=signup">Claim your welcome code <ArrowRight size={12} /></Link>
      </div>}

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

      {/* Cute sidebar */}
      <button className="cute-sidebar" onClick={() => setMenuOpen(true)}>
        <span>open the little menu</span>
        <Flower2 size={16} />
        <span>find your next favorite</span>
      </button>
      <nav className={`mobile-bottom-nav${scrolled ? " is-scrolled" : ""}`} aria-label="Quick navigation">
        <Link href="/"><Flower2 size={18} /><span>Home</span></Link>
        <Link href="/shop"><Search size={18} /><span>Shop</span></Link>
        <Link href="/wishlist"><Heart size={18} /><span>Saved</span></Link>
        <Link href="/cart" className="mobile-cart-link"><ShoppingBag size={19} />{cartCount > 0 && <b>{cartCount}</b>}<span>Cart</span></Link>
        <Link href="/account"><UserRound size={18} /><span>Account</span></Link>
      </nav>

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
          <p>Get 5% off your first order plus first dibs on new drops.</p>
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
  const [added, setAdded] = useState(false);

  function addProduct(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (onAdd) { onAdd(); }
    else {
      const stored = JSON.parse(localStorage.getItem("mrittika-cart") ?? "[]") as CartItem[];
      const existing = stored.find((item) => item.id === product.id);
      const nextItems = existing
        ? stored.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...stored, { ...product, quantity: 1 }];
      const nextCount = nextItems.reduce((total, item) => total + item.quantity, 0);
      localStorage.setItem("mrittika-cart", JSON.stringify(nextItems));
      localStorage.setItem("mrittika-cart-count", String(nextCount));
      window.dispatchEvent(new Event("mrittika-cart-updated"));
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="product-card reveal">
      <Link href={`/shop/${product.id}`} className="product-visual">
        <div className="product-image" style={{ backgroundImage: `url('${product.images[0] ?? ""}')` }} />
        {product.stock === 0 && <span className="product-tag">sold out</span>}
        <button
          onClick={addProduct}
          className={`quick-add${added ? " is-added" : ""}`}
          disabled={product.stock === 0}
          style={added ? { background: "var(--green)", color: "#fff", borderColor: "var(--green)" } : undefined}
        >
          {added ? "✓ Added!" : "Add to bag"}
        </button>
      </Link>
      <Link href={`/shop/${product.id}`} className="product-name">{product.title}</Link>
      <span className="product-meta">{product.category ?? "Mrittika Magic"}</span>
      <strong>{money.format(product.price)}</strong>
    </article>
  );
}
