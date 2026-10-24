import Link from "next/link";
import { ArrowLeft, ExternalLink, Package } from "lucide-react";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import AdminOrderForm from "@/components/AdminOrderForm";
import { SiteChrome } from "@/components/Storefront";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await requireAdmin(); const { data: order } = await supabase.from("orders").select("*").eq("id", (await params).id).maybeSingle(); if (!order) notFound();
  const customer = order.customer as Record<string, string>; const items = order.items as Array<{ title: string; quantity: number; price: number }>;
  return <SiteChrome><main className="admin-page-shell"><Link href="/admin/orders" className="text-link"><ArrowLeft size={15} /> All orders</Link><div className="admin-heading-shell"><div><p className="admin-eyebrow">fulfillment desk</p><h1 className="admin-title">{order.order_id} <i>manage.</i></h1></div></div><div className="admin-order-layout"><section className="admin-panel"><h2><Package size={20} /> Customer & items</h2><p><strong>{customer.name}</strong><br />{customer.email}<br />{customer.phone}</p><p>{customer.address}<br />{customer.city}, {customer.state} {customer.postalCode}</p><div className="admin-order-items">{items.map((item, index) => <div className="admin-order-item" key={`${item.title}-${index}`}><span>{item.title} × {item.quantity}</span><strong>₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</strong></div>)}</div><div className="order-total"><span>Total</span><strong>₹{Number(order.total_amount).toLocaleString("en-IN")}</strong></div></section><section className="admin-panel"><h2>Update order</h2><AdminOrderForm order={order} />{order.tracking_number && <a className="text-link" href={`https://www.shiprocket.in/shipment-tracking/${order.tracking_number}`} target="_blank" rel="noreferrer">Open tracking link <ExternalLink size={14} /></a>}</section></div></main></SiteChrome>;
}
