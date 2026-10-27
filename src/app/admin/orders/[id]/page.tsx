import Link from "next/link";
import { ArrowLeft, ExternalLink, Package } from "lucide-react";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import AdminOrderForm from "@/components/AdminOrderForm";
import { SiteChrome } from "@/components/Storefront";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await requireAdmin(); const { data: order } = await supabase.from("orders").select("*").eq("id", (await params).id).maybeSingle(); if (!order) notFound();
  const customer = order.customer as Record<string, string>; const items = order.items as Array<{ title: string; quantity: number; price: number }>;
  const trackingUrl = `/trk/${order.order_id}`;
  return (
    <SiteChrome>
      <main className="admin-page-shell">
        <Link href="/admin/orders" className="text-link">
          <ArrowLeft size={15} /> All orders
        </Link>
        <div className="admin-heading-shell">
          <div>
            <p className="admin-eyebrow">fulfillment desk</p>
            <h1 className="admin-title">{order.order_id} <i>manage.</i></h1>
          </div>
        </div>
        <div className="admin-order-layout">
          <section className="admin-panel">
            <h2><Package size={20} /> Customer & items</h2>
            <p><strong>{customer.name}</strong><br />{customer.email}<br />{customer.phone}</p>
            <p>{customer.address}<br />{customer.city}, {customer.state} {customer.postalCode}</p>
            <div className="admin-order-items">
              {items.map((item, index) => (
                <div className="admin-order-item" key={`${item.title}-${index}`}>
                  <span>{item.title} × {item.quantity}</span>
                  <strong>₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</strong>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Total</span>
              <strong>₹{Number(order.total_amount).toLocaleString("en-IN")}</strong>
            </div>

            {/* Direct Order Tracking Link generated for customer sharing */}
            <div style={{ marginTop: 24, padding: "16px", background: "rgba(8, 7, 134, 0.05)", borderRadius: "var(--radius-md)", border: "1px dashed rgba(8, 7, 134, 0.25)" }}>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--navy, #080786)", display: "block", marginBottom: 6 }}>
                Customer Live Tracking URL
              </span>
              <a
                href={trackingUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 14, fontWeight: 700, color: "var(--navy, #080786)", textDecoration: "underline", wordBreak: "break-all" }}
              >
                {typeof window !== "undefined" ? window.location.origin : ""}{trackingUrl} <ExternalLink size={13} style={{ display: "inline" }} />
              </a>
            </div>
          </section>

          <section className="admin-panel">
            <h2>Manual Delivery & Fulfillment</h2>
            <p style={{ fontSize: 13, color: "var(--muted, #666)", marginBottom: 16 }}>
              No automated pickup is scheduled. Enter courier details and AWB tracking manually once packed.
            </p>
            <AdminOrderForm order={order} />
            {order.tracking_number && (
              <div style={{ marginTop: 16 }}>
                <a className="text-link" href={`https://www.delhivery.com/track/package/${order.tracking_number}`} target="_blank" rel="noreferrer">
                  Open Delhivery courier tracking <ExternalLink size={14} />
                </a>
              </div>
            )}
          </section>
        </div>
      </main>
    </SiteChrome>
  );
}
