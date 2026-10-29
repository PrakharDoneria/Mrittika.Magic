"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, ShieldCheck, Sparkles } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { CartItem } from "@/data/types";
import { SiteChrome } from "@/components/Storefront";

let cartSnapshotRaw = "";
let cartSnapshot: CartItem[] = [];
function getCartSnapshot() {
  if (typeof window === "undefined") return cartSnapshot;
  const raw = localStorage.getItem("mrittika-cart") ?? "[]";
  if (raw !== cartSnapshotRaw) {
    cartSnapshotRaw = raw;
    try {
      cartSnapshot = JSON.parse(raw) as CartItem[];
    } catch {
      cartSnapshot = [];
    }
  }
  return cartSnapshot;
}

export default function CartPage() {
  const items = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("mrittika-cart-updated", onChange);
      window.addEventListener("storage", onChange);
      return () => {
        window.removeEventListener("mrittika-cart-updated", onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    getCartSnapshot,
    () => cartSnapshot
  );

  function update(id: string, amount: number) {
    const next = items
      .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item))
      .filter((item) => item.quantity > 0);
    localStorage.setItem("mrittika-cart", JSON.stringify(next));
    localStorage.setItem("mrittika-cart-count", String(next.reduce((sum, item) => sum + item.quantity, 0)));
    window.dispatchEvent(new Event("mrittika-cart-updated"));
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal >= 999 ? 0 : 79) : 0;
  const total = subtotal + shipping;

  return (
    <SiteChrome showLadybug={true}>
      <main className="cart-page">
        <p className="eyebrow">your little collection</p>
        <h1>
          Your bag is <i>{items.length ? "full." : "waiting."}</i>
        </h1>
        {items.length ? (
          <div className="cart-content">
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.images[0] ?? "/media/buttons.jpeg"} alt={item.title} />
                  <div>
                    <h2>{item.title}</h2>
                    <p>₹{item.price.toLocaleString("en-IN")}</p>
                    <div className="cart-quantity">
                      <button onClick={() => update(item.id, -1)} aria-label="Decrease quantity">
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => update(item.id, 1)} aria-label="Increase quantity">
                        <Plus size={14} />
                      </button>
                      <button onClick={() => update(item.id, -item.quantity)} aria-label="Remove item">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Complete Price Breakdown in Subtotal */}
            <aside className="cart-summary">
              <div className="cart-summary-header">
                <ShoppingBag size={24} />
                <h2>Order Summary</h2>
              </div>

              <div className="cart-breakdown-table">
                <div className="cart-breakdown-row">
                  <span>Items Subtotal ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})</span>
                  <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                </div>

                <div className="cart-breakdown-row">
                  <span>Standard Studio Shipping</span>
                  {shipping === 0 ? (
                    <span className="cart-free-tag">FREE</span>
                  ) : (
                    <strong>₹{shipping.toLocaleString("en-IN")}</strong>
                  )}
                </div>

                {shipping === 0 && (
                  <p className="cart-shipping-note">
                    <Sparkles size={12} /> Free shipping unlocked on your order!
                  </p>
                )}

                <div className="cart-breakdown-divider" />

                <div className="cart-breakdown-row total-row">
                  <div>
                    <strong>Total Amount</strong>
                    <small>Including all studio packing & taxes</small>
                  </div>
                  <strong className="cart-grand-total">₹{total.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <Link href="/checkout" className="solid-button cart-checkout-btn">
                Continue to checkout <ArrowRight size={15} />
              </Link>

              <div className="cart-guarantee">
                <ShieldCheck size={16} />
                <span>Handmade with care • Safe & verified checkout</span>
              </div>
            </aside>
          </div>
        ) : (
          <section className="cart-empty">
            <ShoppingBag size={42} />
            <p>Add something joyful and it will appear right here.</p>
            <Link href="/shop" className="solid-button">
              Explore the shop <ArrowRight size={15} />
            </Link>
          </section>
        )}
      </main>
    </SiteChrome>
  );
}
