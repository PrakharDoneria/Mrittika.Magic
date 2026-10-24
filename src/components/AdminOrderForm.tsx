"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function AdminOrderForm({ order }: { order: Record<string, unknown> }) {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const result = await createClient().from("orders").update({ fulfillment_status: form.get("fulfillmentStatus"), payment_status: form.get("paymentStatus"), tracking_number: String(form.get("trackingNumber") || "") || null, courier_name: String(form.get("courierName") || "") || null, shipment_id: String(form.get("shipmentId") || "") || null }).eq("id", order.id);
    setMessage(result.error ? result.error.message : "Order updated successfully."); setBusy(false);
  }
  return <form className="admin-form admin-order-form" onSubmit={save}><label>Fulfillment status<select name="fulfillmentStatus" defaultValue={String(order.fulfillment_status)}><option>Order Placed</option><option>Packed</option><option>Shipped</option><option>Out for Delivery</option><option>Delivered</option></select></label><label>Payment status<select name="paymentStatus" defaultValue={String(order.payment_status)}><option>Pending</option><option>Paid</option><option>Failed</option></select></label><label>Shipment ID<input name="shipmentId" defaultValue={String(order.shipment_id ?? "")} /></label><label>AWB / tracking number<input name="trackingNumber" defaultValue={String(order.tracking_number ?? "")} /></label><label>Courier name<input name="courierName" defaultValue={String(order.courier_name ?? "")} /></label>{message && <p className="admin-message">{message}</p>}<button className="admin-submit" disabled={busy}>{busy ? "Saving..." : "Save order changes"}</button></form>;
}
