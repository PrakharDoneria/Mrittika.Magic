"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, MapPin, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useEffect, useSyncExternalStore, useState } from "react";
import type { CartItem } from "@/data/types";
import { SiteChrome } from "@/components/Storefront";
import { createClient } from "@/lib/supabase/browser";

interface PostOffice {
  name: string;
  district: string;
  state: string;
  deliveryStatus: string;
}

interface ShippingRate {
  id: string;
  mode: string;
  title: string;
  amount: number;
  estimatedDays?: string;
  zone?: string;
}

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

  // Delivery calculation states
  const [postalCode, setPostalCode] = useState<string>("");
  const [deliveryRates, setDeliveryRates] = useState<ShippingRate[]>([]);
  const [selectedRateId, setSelectedRateId] = useState<string>("dlv_SURFACE");
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState<string>("");
  const [calculatingRate, setCalculatingRate] = useState<boolean>(false);
  const [deliveryError, setDeliveryError] = useState<string>("");

  useEffect(() => {
    // Dynamically inject Cashfree JS SDK v3 if not already present
    if (typeof window !== "undefined" && !document.getElementById("cashfree-sdk-script")) {
      const script = document.createElement("script");
      script.id = "cashfree-sdk-script";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setProfile({
          name: user.user_metadata?.full_name ?? "",
          email: user.email ?? "",
          phone: user.user_metadata?.phone ?? "",
          address: user.user_metadata?.address ?? "",
          city: user.user_metadata?.city ?? "",
          state: user.user_metadata?.state ?? "",
          postalCode: user.user_metadata?.postal_code ?? "",
        });
      }
    });

    // Check saved pincode from cart
    try {
      const savedPin = localStorage.getItem("mrittika-pincode") || "";
      if (savedPin) {
        setPostalCode(savedPin);
        updateShippingForPin(savedPin);
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Check if returning from payment gateway
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

  async function updateShippingForPin(pin: string) {
    const cleanPin = pin.trim().replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      setDeliveryRates([]);
      setPostOffices([]);
      return;
    }
    setCalculatingRate(true);
    setDeliveryError("");
    try {
      const res = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationPin: cleanPin, weight: 0.5 }),
      });
      const data = await res.json();
      if (data.rates && data.rates.length > 0) {
        setDeliveryRates(data.rates);
        setPostOffices(data.postOffices || []);
        if (data.postOffices && data.postOffices.length > 0) {
          setSelectedPostOffice(data.postOffices[0].name);
        }
        if (data.district || data.state) {
          setProfile((prev) => ({
            ...prev,
            city: data.district || prev.city,
            state: data.state || prev.state,
          }));
        }
      } else {
        setDeliveryError("Could not estimate delivery for this pincode.");
      }
    } catch (err) {
      console.error(err);
      setDeliveryError("Delivery rate estimation unavailable.");
    } finally {
      setCalculatingRate(false);
    }
  }

  function handlePincodeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPostalCode(val);
    if (val.length === 6) {
      updateShippingForPin(val);
    } else {
      setDeliveryRates([]);
      setPostOffices([]);
    }
  }

  const selectedRate = deliveryRates.find((r) => r.id === selectedRateId) || deliveryRates[0];
  const deliveryFee = selectedRate ? selectedRate.amount : 0;
  const hasDeliveryCalculated = deliveryRates.length > 0;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  async function useLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by your browser.");
      return;
    }
    setLocationMessage("Locating you...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          );
          const data = await res.json();
          const addr = data.address || {};
          const detectedPin = (addr.postcode || "").replace(/\D/g, "").slice(0, 6);
          setProfile((prev) => ({
            ...prev,
            address: data.display_name?.split(",").slice(0, 3).join(",") ?? prev.address,
            city: addr.city || addr.town || addr.village || addr.county || prev.city,
            state: addr.state || prev.state,
            postalCode: detectedPin || prev.postalCode,
          }));
          if (detectedPin && detectedPin.length === 6) {
            setPostalCode(detectedPin);
            updateShippingForPin(detectedPin);
          }
          setLocationMessage("Location filled in!");
        } catch {
          setLocationMessage("Could not resolve address details. Please fill manually.");
        }
      },
      () => setLocationMessage("Location permission denied. Please fill address manually.")
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    try {
      const customerData = Object.fromEntries(form);
      if (selectedPostOffice) {
        customerData.postOffice = selectedPostOffice;
      }
      customerData.deliveryFee = String(deliveryFee);
      customerData.shippingMode = selectedRate?.title || "Standard Delivery";

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: customerData,
          items,
          totalAmount: total,
          paymentMode: form.get("paymentMode"),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "We could not initialize checkout.");
      }

      if (result.paymentSessionId) {
        if (!window.Cashfree) {
          for (let i = 0; i < 20; i++) {
            await new Promise((res) => setTimeout(res, 200));
            if (window.Cashfree) break;
          }
        }
        if (!window.Cashfree) {
          throw new Error("Cashfree payment gateway is loading. Please try again in a moment.");
        }
        const gatewayMode = result.isProd ? "production" : "sandbox";
        const cashfree = window.Cashfree({ mode: gatewayMode });
        await cashfree.checkout({
          paymentSessionId: result.paymentSessionId,
          redirectTarget: "_self",
        });
      } else {
        throw new Error("Payment session creation failed.");
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (success) {
    return (
      <SiteChrome>
        <main className="checkout-page checkout-success" style={{ textAlign: "center", padding: "80px 24px" }}>
          <CheckCircle2 size={56} style={{ color: "var(--green, #22c55e)", margin: "0 auto 20px" }} />
          <h1>Order <i>Confirmed!</i></h1>
          <p>Thank you for shopping at Mrittika Magic. Your payment has been received and order #{success} is placed.</p>
          <div style={{ marginTop: "28px" }}>
            <Link href="/" className="solid-button">Back to Home</Link>
          </div>
        </main>
      </SiteChrome>
    );
  }

  return (
    <SiteChrome>
      <main className="checkout-page">
        <div className="checkout-header">
          <p className="eyebrow">step 2 of 2</p>
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
                    <input
                      name="postalCode"
                      value={postalCode}
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="Enter 6-digit pincode"
                      onChange={handlePincodeInput}
                      required
                    />
                  </label>
                </div>

                {/* Delivery Options Selector */}
                {deliveryRates.length > 0 && (
                  <div className="checkout-shipping-selector">
                    <div className="checkout-shipping-title">
                      <Truck size={17} />
                      <span>Choose Delhivery Mode (Dispatched from 801503):</span>
                    </div>
                    <div className="checkout-shipping-radios">
                      {deliveryRates.map((r) => {
                        const isSelected = r.id === selectedRateId;
                        return (
                          <label key={r.id} className={`checkout-shipping-radio ${isSelected ? "is-selected" : ""}`}>
                            <div className="shipping-radio-left">
                              <input
                                type="radio"
                                name="selectedShippingRate"
                                checked={isSelected}
                                onChange={() => setSelectedRateId(r.id)}
                              />
                              <div className="shipping-radio-text">
                                <span className="shipping-mode-name">{r.title}</span>
                                <small className="shipping-mode-days">
                                  {r.estimatedDays || "Prompt delivery"} • Verified Delhivery
                                </small>
                              </div>
                            </div>
                            <strong className="shipping-radio-price">₹{r.amount}</strong>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {deliveryError && <p className="checkout-error" style={{ marginTop: 8 }}>{deliveryError}</p>}

                <label style={{ marginTop: 14 }}>
                  Exact address
                  <textarea name="address" defaultValue={profile.address} required rows={3} placeholder="House / flat, street, landmark" />
                </label>
                <div className="checkout-grid">
                  <label>
                    City / District
                    <input name="city" value={profile.city ?? ""} onChange={(e) => setProfile(p => ({ ...p, city: e.target.value }))} required />
                  </label>
                  <label>
                    State
                    <input name="state" value={profile.state ?? ""} onChange={(e) => setProfile(p => ({ ...p, state: e.target.value }))} required />
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

              <button className="solid-button checkout-submit" disabled={busy || calculatingRate}>
                {busy
                  ? "Opening Cashfree Checkout..."
                  : calculatingRate
                  ? "Calculating Delivery..."
                  : `Pay ₹${total.toLocaleString("en-IN")} via Cashfree`}
                <ArrowLeft size={15} />
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

              <div className="checkout-line" style={{ borderTop: "1px dashed rgba(26,26,26,0.18)", paddingTop: 12 }}>
                <span>Items Subtotal</span>
                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>

              {/* Delivery Charges Display in Checkout */}
              <div className="checkout-line checkout-shipping-line">
                <span>
                  {selectedRate ? selectedRate.title : "Delhivery Shipping (from 801503)"}
                </span>
                <strong>
                  {calculatingRate
                    ? "Calculating..."
                    : hasDeliveryCalculated
                    ? `₹${deliveryFee.toLocaleString("en-IN")}`
                    : "Enter pincode"}
                </strong>
              </div>

              <div className="checkout-total">
                <span>Total Amount</span>
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
