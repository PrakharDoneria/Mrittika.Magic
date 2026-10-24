import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SiteChrome } from "@/components/Storefront";

export default async function OrdersPage() {
  const supabase = await createClient(); if (!supabase) redirect("/account"); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/account");
  const { data: orders } = await supabase.from("orders").select("id,order_id,total_amount,payment_status,payment_gateway,fulfillment_status,tracking_number,courier_name,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  return <SiteChrome><main className="orders-page"><div className="orders-heading"><div><p className="eyebrow">your little history</p><h1>My <i>orders.</i></h1></div><Link href="/shop" className="solid-button">Shop again</Link></div>{orders?.length ? <div className="orders-list">{orders.map((order) => <Link href={`/orders/${order.id}`} className="order-row" key={order.id}><ClipboardList size={22} /><div><strong>{order.order_id}</strong><span>{new Date(order.created_at).toLocaleDateString()} · {order.fulfillment_status}</span></div><b>₹{Number(order.total_amount).toLocaleString("en-IN")}</b><small>{order.payment_gateway} · {order.payment_status}</small></Link>)}</div> : <section className="cart-empty"><ClipboardList size={42} /><p>Your order history will bloom here after your first order.</p><Link href="/shop" className="solid-button">Shop the collection</Link></section>}</main></SiteChrome>;
}
