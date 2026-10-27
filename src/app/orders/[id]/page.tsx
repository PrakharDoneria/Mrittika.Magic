import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, MapPin, Package } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteChrome } from "@/components/Storefront";
import ReceiptButton from "@/components/ReceiptButton";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient(); if (!supabase) redirect("/account");
  const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/account");
  const { data: order } = await supabase.from("orders").select("*").eq("id", (await params).id).eq("user_id", user.id).maybeSingle();
  if (!order) notFound();
  const customer = order.customer as Record<string, string>;
  const items = order.items as Array<{ title: string; quantity: number; price: number }>;
  return <SiteChrome><main className="order-detail-page"><Link href="/orders" className="text-link"><ArrowLeft size={15} /> My orders</Link><div className="order-detail-heading"><div><p className="eyebrow">order details</p><h1>{order.order_id}</h1><span>{new Date(order.created_at).toLocaleString()}</span></div><ReceiptButton /></div><div className="order-detail-grid"><section className="order-detail-card"><h2><Package size={20} /> Items</h2>{items.map((item, index) => <div className="order-item" key={`${item.title}-${index}`}><span>{item.title} × {item.quantity}</span><strong>₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</strong></div>)}<div className="order-total"><span>Total paid / due</span><strong>₹{Number(order.total_amount).toLocaleString("en-IN")}</strong></div></section><section className="order-detail-card"><h2><CheckCircle2 size={20} /> Status</h2><p className="order-status">{order.fulfillment_status}</p><p>Payment: <strong>{order.payment_gateway} · {order.payment_status}</strong></p><p style={{ marginTop: 12 }}><Link className="text-link" href={`/trk/${order.order_id}`}>Live studio tracking page →</Link></p>{order.tracking_number ? <a className="text-link" href={`https://www.delhivery.com/track/package/${order.tracking_number}`} target="_blank" rel="noreferrer" style={{ marginTop: 8, display: "inline-block" }}>Track on Delhivery <ExternalLink size={14} /></a> : <p className="order-muted">Tracking link will appear after dispatch.</p>}</section><section className="order-detail-card"><h2><MapPin size={20} /> Delivery</h2><p>{customer.name}<br />{customer.email}<br />{customer.phone}</p><p>{customer.address}<br />{customer.city}, {customer.state} {customer.postalCode}</p><p>{customer.notes}</p></section></div></main></SiteChrome>;
}
