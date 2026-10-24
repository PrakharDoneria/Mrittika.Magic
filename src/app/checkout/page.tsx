"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, CreditCard, MapPin, ShoppingBag, Truck } from "lucide-react";
import { useEffect, useSyncExternalStore, useState } from "react";
import type { CartItem } from "@/data/types";
import { SiteChrome } from "@/components/Storefront";
import { createClient } from "@/lib/supabase/browser";

let checkoutCartRaw = "";
let checkoutCart: CartItem[] = [];
function getCheckoutCart() {
  if (typeof window === "undefined") return checkoutCart;
  const raw = localStorage.getItem("mrittika-cart") ?? "[]";
  if (raw !== checkoutCartRaw) { checkoutCartRaw = raw; try { checkoutCart = JSON.parse(raw) as CartItem[]; } catch { checkoutCart = []; } }
  return checkoutCart;
}

export default function CheckoutPage() {
  const items = useSyncExternalStore((onChange) => { window.addEventListener("mrittika-cart-updated", onChange); window.addEventListener("storage", onChange); return () => { window.removeEventListener("mrittika-cart-updated", onChange); window.removeEventListener("storage", onChange); }; }, getCheckoutCart, () => checkoutCart);
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState<{ name?: string; email?: string; phone?: string; address?: string; city?: string; state?: string; postalCode?: string }>({});
  const [locationMessage, setLocationMessage] = useState("");
  useEffect(() => { createClient().auth.getUser().then(async ({ data }) => { if (data.user) { const client = createClient(); const { data: row } = await client.from("profiles").select("name,phone,address,city,state,postal_code").eq("id", data.user.id).maybeSingle(); setProfile({ name: row?.name ?? "", email: data.user.email ?? "", phone: row?.phone ?? "", address: row?.address ?? "", city: row?.city ?? "", state: row?.state ?? "", postalCode: row?.postal_code ?? "" }); } }); }, []);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer: Object.fromEntries(form), items, totalAmount: total, paymentMode: form.get("paymentMode") }) });
    const result = await response.json();
    if (!response.ok) setMessage(result.error ?? "We could not place your order.");
    else { localStorage.removeItem("mrittika-cart"); localStorage.setItem("mrittika-cart-count", "0"); window.dispatchEvent(new Event("mrittika-cart-updated")); setSuccess(result.orderId); }
    setBusy(false);
  }
  function useLocation() {
    if (!navigator.geolocation) { setLocationMessage("Location permission is not available in this browser."); return; }
    setLocationMessage("Requesting your location…");
    navigator.geolocation.getCurrentPosition(({ coords }) => setLocationMessage(`Location detected (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}). Please confirm the address manually.`), () => setLocationMessage("Location permission was declined. You can enter your address manually."));
  }
  if (success) return <SiteChrome><main className="checkout-page checkout-success"><CheckCircle2 size={56} /><p className="eyebrow">order received</p><h1>Thank you for choosing <i>tiny joy.</i></h1><p>Your order <strong>{success}</strong> is safely recorded. We&apos;ll keep you updated as it moves from our studio to you.</p><Link href="/orders" className="solid-button">View my orders <ArrowLeft size={15} /></Link></main></SiteChrome>;
  return <SiteChrome><main className="checkout-page"><Link href="/cart" className="text-link"><ArrowLeft size={15} /> Back to bag</Link><div className="checkout-heading"><p className="eyebrow">a thoughtful checkout</p><h1>Almost <i>yours.</i></h1></div>{items.length ? <div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><fieldset><legend><MapPin size={18} /> Delivery details</legend><button type="button" className="location-button" onClick={useLocation}><MapPin size={15} /> Use my current location</button>{locationMessage && <p className="checkout-hint">{locationMessage}</p>}<div className="checkout-grid"><label>Full name<input name="name" defaultValue={profile.name} required /></label><label>Email<input name="email" type="email" defaultValue={profile.email} required /></label><label>Phone number<input name="phone" defaultValue={profile.phone} type="tel" pattern="[0-9+ ()-]{8,}" required /></label><label>Postal code<input name="postalCode" defaultValue={profile.postalCode} required /></label></div><label>Exact address<textarea name="address" defaultValue={profile.address} required rows={3} placeholder="House / flat, street, area" /></label><div className="checkout-grid"><label>City<input name="city" defaultValue={profile.city} required /></label><label>State<input name="state" defaultValue={profile.state} required /></label></div><label>Delivery notes <span>(optional)</span><textarea name="notes" rows={2} placeholder="Landmark, gift note, or special instruction" /></label></fieldset><fieldset><legend><CreditCard size={18} /> Payment mode</legend><label className="payment-choice"><input type="radio" name="paymentMode" value="cod" defaultChecked /> <Truck size={18} /> Cash on Delivery</label><label className="payment-choice"><input type="radio" name="paymentMode" value="cashfree" /> <CreditCard size={18} /> Pay online with Cashfree</label><p className="checkout-hint">Cashfree online payments become available when the server credentials are configured. COD is available now.</p></fieldset>{message && <p className="checkout-error">{message}</p>}<button className="solid-button checkout-submit" disabled={busy}>{busy ? "Placing order..." : "Place order"} <ArrowLeft size={15} /></button></form><aside className="checkout-summary"><ShoppingBag size={24} /><h2>Your order</h2>{items.map((item) => <div className="checkout-line" key={item.id}><span>{item.title} × {item.quantity}</span><strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong></div>)}<div className="checkout-total"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div><Link href="/return-policy" className="checkout-policy">Read our return policy</Link></aside></div> : <section className="cart-empty"><ShoppingBag size={42} /><p>Your bag is empty. Choose something lovely before checking out.</p><Link href="/shop" className="solid-button">Explore the shop</Link></section>}</main></SiteChrome>;
}
