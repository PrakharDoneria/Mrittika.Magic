import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, ExternalLink, MapPin, Package, ShieldCheck, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteChrome } from "@/components/Storefront";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Track Order ${id} | Mrittika Magic`,
    description: `Real-time delivery and packaging tracking for Mrittika Magic order ${id}.`,
  };
}

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).trim();

  const supabase = await createClient();
  let order: any = null;

  if (supabase) {
    // Look up by order_id (e.g. MRIT-...) or by uuid id
    const { data } = await supabase
      .from("orders")
      .select("*")
      .or(`order_id.eq.${decodedId},id.eq.${decodedId}`)
      .maybeSingle();
    order = data;
  }

  if (!order) {
    notFound();
  }

  const customer = (order.customer ?? {}) as Record<string, string>;
  const items = (order.items ?? []) as Array<{ title: string; quantity: number; price: number }>;

  const steps = [
    { label: "Order Placed", desc: "Studio confirmed & preparing batch" },
    { label: "Packed", desc: "Hand-wrapped with wax seal and protection" },
    { label: "Shipped", desc: "Handed over to courier partner" },
    { label: "Out for Delivery", desc: "With your local delivery agent" },
    { label: "Delivered", desc: "Delivered safely into your hands" },
  ];

  const currentIdx = steps.findIndex(
    (s) => s.label.toLowerCase() === (order.fulfillment_status ?? "").toLowerCase()
  );
  const activeStep = currentIdx >= 0 ? currentIdx : 0;

  return (
    <SiteChrome>
      <main className="order-detail-page">
        <Link href="/shop" className="text-link">
          <ArrowLeft size={15} /> Back to shop
        </Link>

        <div className="order-detail-heading">
          <div>
            <p className="eyebrow" style={{ color: "var(--navy, #080786)" }}>
              <Truck size={14} style={{ display: "inline" }} /> live tracking
            </p>
            <h1>{order.order_id}</h1>
            <span>Placed on {new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}</span>
          </div>

          <div style={{ textAlign: "right" }}>
            <span
              style={{
                display: "inline-block",
                padding: "8px 16px",
                borderRadius: "var(--radius-pill)",
                fontSize: 13,
                fontWeight: 800,
                background: order.payment_status === "Paid" ? "rgba(10, 140, 60, 0.12)" : "rgba(230, 80, 0, 0.12)",
                color: order.payment_status === "Paid" ? "#0A8C3C" : "#E65000",
              }}
            >
              Payment: {order.payment_status}
            </span>
          </div>
        </div>

        {/* ── STEPPER PROGRESS BAR ── */}
        <section
          className="order-detail-card"
          style={{
            marginBottom: 32,
            padding: "32px 24px",
            background: "linear-gradient(180deg, #ffffff 0%, rgba(255, 214, 51, 0.08) 100%)",
            border: "2px solid var(--ink)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 12, position: "relative" }}>
            {steps.map((st, i) => {
              const isDone = i <= activeStep;
              const isCurrent = i === activeStep;
              return (
                <div key={st.label} style={{ textAlign: "center", position: "relative" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      margin: "0 auto 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                      background: isDone ? "var(--navy, #080786)" : "#e2e4ea",
                      color: isDone ? "#ffffff" : "#666",
                      boxShadow: isCurrent ? "0 0 0 4px rgba(8, 7, 134, 0.2)" : "none",
                    }}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <strong style={{ display: "block", fontSize: 13, color: isDone ? "var(--navy, #080786)" : "var(--muted, #666)" }}>
                    {st.label}
                  </strong>
                  <span style={{ fontSize: 11, color: "var(--muted, #666)", lineHeight: 1.3, display: "block", marginTop: 4 }}>
                    {st.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── TRACKING DETAILS GRID ── */}
        <div className="order-detail-grid">
          {/* Shipping / Courier Details */}
          <section className="order-detail-card">
            <h2>
              <Truck size={20} /> Courier & Dispatch
            </h2>
            <p>
              Current Status:{" "}
              <strong style={{ color: "var(--navy, #080786)", fontSize: 16 }}>
                {order.fulfillment_status}
              </strong>
            </p>
            <p>
              Courier Partner: <strong>{order.courier_name || "Delhivery"}</strong>
            </p>

            {order.tracking_number ? (
              <div style={{ marginTop: 16, padding: "16px", background: "rgba(8, 7, 134, 0.05)", borderRadius: "var(--radius-sm)" }}>
                <span style={{ fontSize: 12, opacity: 0.75, display: "block", marginBottom: 4 }}>
                  AWB / Tracking Number:
                </span>
                <strong style={{ fontSize: 16, display: "block", marginBottom: 12, letterSpacing: ".05em" }}>
                  {order.tracking_number}
                </strong>
                <a
                  className="solid-button"
                  href={`https://www.delhivery.com/track/package/${order.tracking_number}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-flex", fontSize: 12, padding: "8px 16px" }}
                >
                  Track on Delhivery Official <ExternalLink size={13} />
                </a>
              </div>
            ) : (
              <div style={{ marginTop: 16, padding: "14px", background: "rgba(0, 0, 0, 0.03)", borderRadius: "var(--radius-sm)" }}>
                <Clock size={16} style={{ display: "inline", marginRight: 6 }} />
                <span style={{ fontSize: 13, color: "var(--muted, #666)" }}>
                  AWB tracking number will appear here once the studio hand-packs and dispatches your order.
                </span>
              </div>
            )}
          </section>

          {/* Delivery Address */}
          <section className="order-detail-card">
            <h2>
              <MapPin size={20} /> Shipping Destination
            </h2>
            <p>
              <strong>{customer.name}</strong>
              <br />
              {customer.phone}
              <br />
              {customer.email}
            </p>
            <p>
              {customer.address}
              <br />
              {customer.city}, {customer.state} {customer.postalCode}
            </p>
            {customer.notes && <p style={{ fontStyle: "italic", fontSize: 13 }}>Note: &quot;{customer.notes}&quot;</p>}
          </section>

          {/* Items In Order */}
          <section className="order-detail-card">
            <h2>
              <Package size={20} /> Order Items
            </h2>
            {items.map((item, index) => (
              <div className="order-item" key={`${item.title}-${index}`}>
                <span>
                  {item.title} × {item.quantity}
                </span>
                <strong>₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</strong>
              </div>
            ))}
            <div className="order-total">
              <span>Total Paid / Due</span>
              <strong>₹{Number(order.total_amount).toLocaleString("en-IN")}</strong>
            </div>
          </section>
        </div>
      </main>
    </SiteChrome>
  );
}
