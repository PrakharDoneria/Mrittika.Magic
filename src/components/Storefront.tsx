"use client";

import { InstagramIcon } from "@/components/InstagramIcon";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Camera, ChevronDown, Flower2, Heart, Home, Mail, Menu, Palette, Search, ShieldCheck, ShoppingBag, Sparkles, Star, UserRound, X } from "lucide-react";
import type { CartItem, Category, Product } from "@/data/types";
import { productPath } from "@/data/product-path";
import { trackEvent } from "@/lib/analytics";

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
export function SiteChrome({
  children,
  categories = [],
  showLadybug = false,
}: {
  children: React.ReactNode;
  categories?: Category[];
  showLadybug?: boolean;
}) {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  useReveal();

  useEffect(() => {
    trackEvent("page_view", { path: window.location.pathname });
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.isAdmin) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

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

  const closeDrawer = () => {
    setBottomSheetOpen(false);
    setCategoriesOpen(false);
  };

  return (
    <div className="site-shell">
      {/* Edge wall ladybugs for specific pages - left and right sides only */}
      {showLadybug && (
        <aside className="page-wall-ladybugs" aria-hidden="true">
          {/* Left Edge Ladybugs */}
          <div className="wall-ladybug card-bug-left-top"><img src="/brand/ladybug.png" alt="" /></div>
          <div className="wall-ladybug card-bug-left-bottom"><img src="/brand/ladybug.png" alt="" /></div>
          {/* Right Edge Ladybugs */}
          <div className="wall-ladybug card-bug-right-top"><img src="/brand/ladybug.png" alt="" /></div>
          <div className="wall-ladybug card-bug-right-bottom"><img src="/brand/ladybug.png" alt="" /></div>
        </aside>
      )}

      {/* Header */}
      <header className="site-header" style={scrolled ? { boxShadow: "0 3px 0 var(--pink), 0 6px 24px #2b1d2214" } : undefined}>
        {/* Left header actions on mobile / Brand + Home on desktop */}
        <div className="header-left">
          <Link href="/" className="icon-button header-home-button" aria-label="Home">
            <Home size={20} />
          </Link>
          <button
            className="icon-button mobile-menu"
            onClick={() => setBottomSheetOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          {/* Desktop Brand Logo */}
          <Link href="/" className="brand desktop-brand" aria-label="Mrittika Magic Home">
            <img src="/logo/logo.jpeg" alt="Mrittika Magic" />
          </Link>
        </div>

        {/* Mobile-only Centered Brand Logo */}
        <Link href="/" className="brand mobile-brand" aria-label="Mrittika Magic Home">
          <img src="/logo/logo.jpeg" alt="Mrittika Magic" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="main-nav desktop-nav">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop all</Link>
          <Link href="/my-arts">The Sketchbook</Link>
          <Link href="/mail-club">Mail Club</Link>
          {categories.length > 0 && (
            <div className={`nav-dropdown ${categoriesOpen ? "is-expanded" : ""}`}>
              <button
                type="button"
                className="nav-dropdown-trigger"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                aria-expanded={categoriesOpen}
              >
                <span>Categories</span>
                <ChevronDown size={14} className={`nav-chevron ${categoriesOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`nav-dropdown-menu ${categoriesOpen ? "is-visible" : ""}`}>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${encodeURIComponent(category.name)}`}
                    onClick={closeDrawer}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <Link href="/community-love">Reviews</Link>
          <Link href="/about">Our story</Link>
          {isAdmin && (
            <Link href="/admin" className="desktop-admin-badge" title="Open Studio Admin Panel">
              <ShieldCheck size={14} />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Right header actions */}
        <div className="header-actions">
          {isAdmin && (
            <Link href="/admin" className="icon-button header-admin-mobile-icon" aria-label="Admin Panel" title="Admin Panel">
              <ShieldCheck size={19} />
            </Link>
          )}
          <Link href="/shop" className="icon-button header-search" aria-label="Search"><Search size={18} /></Link>
          <Link href="/account" className="icon-button header-account" aria-label="Account"><UserRound size={18} /></Link>
          <Link href="/wishlist" className="icon-button" aria-label="Wishlist"><Heart size={18} /></Link>
          <Link href="/cart" className="icon-button cart-icon" aria-label="Shopping bag">
            <ShoppingBag size={19} />
            {cartCount > 0 && <b>{cartCount}</b>}
          </Link>
        </div>
      </header>

      {/* Mobile Navigation: Bottom Sheet Modal */}
      {bottomSheetOpen && (
        <div
          className="bottom-sheet-backdrop"
          onClick={closeDrawer}
          aria-modal="true"
          role="dialog"
          aria-label="Navigation drawer"
        >
          <div
            className="bottom-sheet-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bottom-sheet-drag-handle" aria-hidden="true" />
            <div className="bottom-sheet-header">
              <span className="bottom-sheet-title">Explore Mrittika</span>
              <button
                className="bottom-sheet-close"
                onClick={closeDrawer}
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bottom-sheet-links">
              {isAdmin && (
                <Link href="/admin" onClick={closeDrawer} className="sheet-link highlight-admin">
                  <ShieldCheck size={18} />
                  <span>Admin Studio Workspace</span>
                </Link>
              )}
              <Link href="/" onClick={closeDrawer} className="sheet-link">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link href="/shop" onClick={closeDrawer} className="sheet-link">
                <ShoppingBag size={18} />
                <span>Shop All Drops</span>
              </Link>
              <Link href="/my-arts" onClick={closeDrawer} className="sheet-link highlight-pink">
                <Palette size={18} />
                <span>The Sketchbook</span>
              </Link>
              <Link href="/mail-club" onClick={closeDrawer} className="sheet-link highlight-yellow">
                <Mail size={18} />
                <span>Snail Mail Club</span>
              </Link>

              {/* Categories Collapsible */}
              {categories.length > 0 && (
                <div className="sheet-categories-group">
                  <button
                    type="button"
                    className="sheet-categories-trigger"
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                  >
                    <span>Categories</span>
                    <ChevronDown size={16} className={categoriesOpen ? "rotate-180" : ""} />
                  </button>
                  {categoriesOpen && (
                    <div className="sheet-categories-list">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/shop?category=${encodeURIComponent(category.name)}`}
                          onClick={closeDrawer}
                          className="sheet-sublink"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Link href="/about" onClick={closeDrawer} className="sheet-link">
                <Flower2 size={18} />
                <span>Our Story</span>
              </Link>
              <Link href="/wishlist" onClick={closeDrawer} className="sheet-link">
                <Heart size={18} />
                <span>Saved Wishlist</span>
              </Link>
              <Link href="/account" onClick={closeDrawer} className="sheet-link">
                <UserRound size={18} />
                <span>My Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="mobile-bottom-bar" aria-label="Mobile quick bar">
        <Link href="/" className={`mobile-bar-btn ${pathname === "/" ? "is-active" : ""}`} aria-label="Home">
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link href="/shop" className={`mobile-bar-btn ${pathname.startsWith("/shop") ? "is-active" : ""}`} aria-label="Shop">
          <ShoppingBag size={20} />
          <span>Shop</span>
        </Link>
        <button
          type="button"
          className="mobile-bar-btn mobile-bar-menu-trigger"
          onClick={() => setBottomSheetOpen(true)}
          aria-label="Menu"
        >
          <div className="mobile-bar-menu-icon">
            <Menu size={22} />
          </div>
          <span>Menu</span>
        </button>
        <Link href="/wishlist" className={`mobile-bar-btn ${pathname.startsWith("/wishlist") ? "is-active" : ""}`} aria-label="Wishlist">
          <Heart size={20} />
          <span>Wishlist</span>
        </Link>
        <Link href="/cart" className={`mobile-bar-btn cart-bar-btn ${pathname.startsWith("/cart") ? "is-active" : ""}`} aria-label="Cart">
          <div style={{ position: "relative" }}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
          </div>
          <span>Cart</span>
        </Link>
      </nav>

      {children}

      {/* Footer */}
      <footer className="site-footer">
        <div>
          <Link href="/" className="brand"><img src="/logo/logo.jpeg" alt="Mrittika Magic" /></Link>
          <p>Thoughtful things, happy colors, and a little bit of everyday magic.</p>
          <div style={{ display: "flex", gap: "14px", marginTop: "16px" }}>
            <a href="https://www.instagram.com/mrittika.magic/" target="_blank" rel="noreferrer" aria-label="Mrittika Magic on Instagram" className="footer-insta-link"><InstagramIcon size={20} /></a>
          </div>
        </div>
        <div>
          <strong>Explore</strong>
          <Link href="/">Home</Link>
          <Link href="/shop">Shop all</Link>
          <Link href="/my-arts">The Sketchbook</Link>
          <Link href="/mail-club">Mail Club</Link>
          <Link href="/community-love">Community Love</Link>
          <Link href="/about">Our story</Link>
          <Link href="/privacy-policy">Privacy policy</Link>
          <Link href="/return-policy">Return policy</Link>
        </div>
        <div>
          <p style={{ marginTop: "4px", fontSize: "12px", opacity: .65, letterSpacing: ".04em" }}>
            Handcrafted wearable art, made in small batches with love.
          </p>
          <p style={{ marginTop: "16px", fontSize: "11px", opacity: .5, letterSpacing: ".08em" }}>
            © {new Date().getFullYear()} Mrittika Magic. Thoughtfully made.
          </p>
        </div>
      </footer>
      <span className="sr-only">{cartCount}</span>
    </div>
  );
}

/* ─── ProductCard ─────────────────────────────────────── */
export function ProductCard({ product, onAdd }: { product: Product; onAdd?: () => void }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    function checkSaved() {
      try {
        const stored = JSON.parse(localStorage.getItem("mrittika-wishlist") ?? "[]") as Product[];
        setIsSaved(stored.some((item) => item.id === product.id));
      } catch {
        setIsSaved(false);
      }
    }
    checkSaved();
    window.addEventListener("mrittika-wishlist-updated", checkSaved);
    window.addEventListener("storage", checkSaved);
    return () => {
      window.removeEventListener("mrittika-wishlist-updated", checkSaved);
      window.removeEventListener("storage", checkSaved);
    };
  }, [product.id]);

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = JSON.parse(localStorage.getItem("mrittika-wishlist") ?? "[]") as Product[];
      const nextSaved = !isSaved;
      const nextItems = nextSaved
        ? [...stored.filter((item) => item.id !== product.id), product]
        : stored.filter((item) => item.id !== product.id);

      localStorage.setItem("mrittika-wishlist", JSON.stringify(nextItems));
      window.dispatchEvent(new Event("mrittika-wishlist-updated"));
      setIsSaved(nextSaved);

      fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          action: nextSaved ? "add" : "remove",
        }),
      }).catch((err) => console.error("Wishlist sync error:", err));
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
    }
  }

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
    <article className="product-card reveal visible">
      <div className="product-visual">
        <Link href={productPath(product)} aria-label={`View ${product.title}`} className="product-image-link">
          <div className="product-image" style={{ backgroundImage: `url('${product.images[0] ?? ""}')` }} />
        </Link>
        <button
          type="button"
          onClick={toggleWishlist}
          className={`product-card-wishlist-btn${isSaved ? " is-saved" : ""}`}
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart size={16} fill={isSaved ? "var(--coral, #e0533c)" : "none"} color={isSaved ? "var(--coral, #e0533c)" : "var(--ink, #1a1a1a)"} />
        </button>
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
      <span
        className="product-rating"
        aria-label={product.review_count ? `${product.rating?.toFixed(1)} out of 5 from ${product.review_count} reviews` : undefined}
      >
        {product.review_count ? (
          <>
            <span>{Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={13} fill={i < Math.round(product.rating ?? 0) ? "currentColor" : "none"} />
            ))}</span>
            {product.rating?.toFixed(1)} ({product.review_count})
          </>
        ) : (
          <span className="product-rating-placeholder" aria-hidden="true" />
        )}
      </span>
      <strong>{money.format(product.price)}</strong>
    </article>
  );
}
