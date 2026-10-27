"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, MapPin, ShieldCheck, ShoppingBag } from "lucide-react";
import { useEffect, useSyncExternalStore, useState } from "react";
import type { CartItem } from "@/data/types";
import { SiteChrome } from "@/components/Storefront";
import { createClient } from "@/lib/supabase/browser";

declare global {
  interface Window {
    Cashfree?: (config: { mode: "sandbox" | "production" }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: "_self" | "_blank" | "_modal";
      }) => Promise<{ error?: { message: string }; redirect?: boolean }>;
    };
  }
}

let checkoutCartRaw = "";
let checkoutCart: CartItem[] = [];
function getCheckoutCart() {
  if (typeof window === "undefined") return checkoutCart;
  const raw = localStorage.getItem("mrittika-cart") ?? "[]";
  if (raw !== checkoutCartRaw) {
    checkoutCartRaw = raw;
    try {
      checkoutCart = JSON.parse(raw) as CartItem[];
    } catch {
      checkoutCart = [];
    }
  }
  return checkoutCart;
}

export default function CheckoutPage() {
  const items = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("mrittika-cart-updated", onChange);
      window.addEventListener("storage", onChange);
      return () => {
        window.removeEventListener("mrittika-cart-updated", onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    getCheckoutCart,
    () => checkoutCart
  );

  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [profile, setProfile] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }>({});
  const [locationMessage, setLocationMessage] = useState("");

  // Load Cashfree JS SDK
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("cashfree-sdk-script")) {
      const script = document.createElement("script");
      script.id = "cashfree-sdk-script";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Fetch saved profile
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(async ({ data }) => {
        if (data.user) {
          const client = createClient();
          const { data: row } = await client
            .from("profiles")
            .select("name,phone,address,city,state,postal_code")
            .eq("id", data.user.id)
            .maybeSingle();
          setProfile({
            name: row?.name ?? "",
            email: data.user.email ?? "",
            phone: row?.phone ?? "",
            address: row?.address ?? "",
            city: row?.city ?? "",
            state: row?.state ?? "",
            postalCode: row?.postal_code ?? "",
          });
        }
      });
  }, []);

  // Verify return from redirect (if any)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const returnOrderId = params.get("order_id");
    if (returnOrderId) {
      setVerifying(true);
      fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: returnOrderId }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.isPaid) {
            localStorage.removeItem("mrittika-cart");
            localStorage.setItem("mrittika-cart-count", "0");
            window.dispatchEvent(new Event("mrittika-cart-updated"));
            setSuccess(returnOrderId);
          } else {
            setMessage("Payment was not completed. Your order remains pending until payment is received.");
          }
        })
        .catch(() => {
          setMessage("Could not verify payment status. If debited, your order will update shortly.");
        })
        .finally(() => setVerifying(false));
    }
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function checkPaymentStatus(orderId: string): Promise<boolean> {
    try {
      const res = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      return Boolean(data.isPaid);
    } catch {
      return false;
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: Object.fromEntries(form),
          items,
          totalAmount: total,
          paymentMode: form.get("paymentMode"),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "We could not initialize checkout.");
      }

      const { orderId, paymentSessionId } = result;

      if (!paymentSessionId) {
        throw new Error("Payment gateway could not generate a payment session. Please try again.");
      }

      // Launch Cashfree Checkout
      if (typeof window !== "undefined" && window.Cashfree) {
        const cashfree = window.Cashfree({ mode: "sandbox" });
        await cashfree.checkout({
          paymentSessionId,
          redirectTarget: "_modal",
        });

        // After modal closes, verify if payment actually completed
        setVerifying(true);
        // Wait 1.5s for gateway status update
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const paid = await checkPaymentStatus(orderId);
        setVerifying(false);

        if (paid) {
          localStorage.removeItem("mrittika-cart");
          localStorage.setItem("mrittika-cart-count", "0");
          window.dispatchEvent(new Event("mrittika-cart-updated"));
          setSuccess(orderId);
        } else {
          setMessage(
            "Payment was not completed or is currently processing. Your order was NOT confirmed without payment. Please try again or complete payment."
          );
        }
      } else {
        setMessage("Cashfree payment gateway is still loading. Please click 'Pay Now' again in a moment.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "We could not place your order.");
    } finally {
      setBusy(false);
    }
  }

  function useLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location permission is not available in this browser.");
      return;
    }
    setLocationMessage("Requesting your location…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setLocationMessage(
          `Location detected (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}). Please confirm the address manually.`
        ),
      () => setLocationMessage("Location permission was declined. You can enter your address manually.")
    );
  }

  if (verifying) {
    return (
      <SiteChrome>
        <main className="checkout-page checkout-success" style={{ textAlign: "center", padding: "80px 24px" }}>
          <Loader2 size={48} className="spin-animation" style={{ color: "var(--navy, #080786)", margin: "0 auto 20px" }} />
          <h1>Verifying your payment with <i>Cashfree...</i></h1>
          <p>Please wait a moment while we confirm your payment receipt.</p>
        </main>
      </SiteChrome>
    );
  }

  if (success) {
    return (
      <SiteChrome>
        <main className="checkout-page checkout-success">
          <CheckCircle2 size={56} />
          <p className="eyebrow">order received</p>
          <h1>Thank you for choosing <i>tiny joy.</i></h1>
          <p>
            Payment confirmed! Your order <strong>{success}</strong> is safely recorded and our studio will prepare your handcrafted pieces.
          </p>
          <div style={{ display: "inline-flex", gap: 12, marginTop: 16 }}>
            <Link href={`/trk/${success}`} className="solid-button">
              Track Order Status →
            </Link>
            <Link href="/orders" className="outline-button">
              View all orders
            </Link>
          </div>
        </main>
      </SiteChrome>
    );
  }

  return (
    <SiteChrome>
      <main className="checkout-page">
        <Link href="/cart" className="text-link">
          <ArrowLeft size={15} /> Back to bag
        </Link>
        <div className="checkout-heading">
          <p className="eyebrow">a thoughtful checkout</p>
          <h1>Almost <i>yours.</i></h1>
        </div>
        {items.length ? (
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={submit}>
              <fieldset>
                <legend>
                  <MapPin size={18} /> Delivery details
                </legend>
                <button type="button" className="location-button" onClick={useLocation}>
                  <MapPin size={15} /> Use my current location
                </button>
                {locationMessage && <p className="checkout-hint">{locationMessage}</p>}
                <div className="checkout-grid">
                  <label>
                    Full name
                    <input name="name" defaultValue={profile.name} required />
                  </label>
                  <label>
                    Email
                    <input name="email" type="email" defaultValue={profile.email} required />
                  </label>
                  <label>
                    Phone number
                    <input name="phone" defaultValue={profile.phone} type="tel" pattern="[0-9+ ()-]{8,}" required />
                  </label>
                  <label>
                    Postal code
                    <input name="postalCode" defaultValue={profile.postalCode} required />
                  </label>
                </div>
                <label>
                  Exact address
                  <textarea name="address" defaultValue={profile.address} required rows={3} placeholder="House / flat, street, area" />
                </label>
                <div className="checkout-grid">
                  <label>
                    City
                    <input name="city" defaultValue={profile.city} required />
                  </label>
                  <label>
                    State
                    <input name="state" defaultValue={profile.state} required />
                  </label>
                </div>
                <label>
                  Delivery notes <span>(optional)</span>
                  <textarea name="notes" rows={2} placeholder="Landmark, gift note, or special instruction" />
                </label>
              </fieldset>

              <fieldset>
                <legend>
                  <CreditCard size={18} /> Secure payment
                </legend>
                <label className="payment-choice">
                  <input type="radio" name="paymentMode" value="cashfree" defaultChecked />
                  <CreditCard size={18} /> Pay securely online with Cashfree
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 13, color: "var(--navy, #080786)" }}>
                  <ShieldCheck size={16} />
                  <span>Your order is placed ONLY after online payment completes successfully.</span>
                </div>
              </fieldset>

              {message && <p className="checkout-error">{message}</p>}

              <button className="solid-button checkout-submit" disabled={busy}>
                {busy ? "Opening Cashfree Checkout..." : `Pay ₹${total.toLocaleString("en-IN")} via Cashfree`} <ArrowLeft size={15} />
              </button>
            </form>

            <aside className="checkout-summary">
              <ShoppingBag size={24} />
              <h2>Your order</h2>
              {items.map((item) => (
                <div className="checkout-line" key={item.id}>
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                </div>
              ))}
              <div className="checkout-total">
                <span>Total</span>
                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>
              <Link href="/return-policy" className="checkout-policy">
                Read our return policy
              </Link>
            </aside>
          </div>
        ) : (
          <section className="cart-empty">
            <ShoppingBag size={42} />
            <p>Your bag is empty. Choose something lovely before checking out.</p>
            <Link href="/shop" className="solid-button">
              Explore the shop
            </Link>
          </section>
        )}
      </main>
    </SiteChrome>
  );
}
