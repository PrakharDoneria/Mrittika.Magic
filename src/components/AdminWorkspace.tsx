"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { SiteChrome } from "./Storefront";

type Section = "analytics" | "products" | "orders" | "categories" | "wishlists" | "mail-club" | "feedback" | "customers" | "reviews";
type Row = Record<string, unknown>;
type CategoryOption = { id: string; name: string };
const labels: Record<Section, string> = {
  analytics: "Analytics",
  products: "Products",
  orders: "Orders",
  categories: "Categories",
  wishlists: "Wishlists",
  "mail-club": "Mail Club",
  feedback: "Feedback",
  customers: "Customers",
  reviews: "Reviews",
};

export default function AdminWorkspace({ section, rows, categories }: { section: Section; rows: Row[]; categories: CategoryOption[] }) {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const [editing, setEditing] = useState<Row | null>(null); const supabase = createClient();
  const isProducts = section === "products"; const isCategories = section === "categories"; const isReviews = section === "reviews";
  const isWishlists = section === "wishlists"; const isMailClub = section === "mail-club"; const isFeedback = section === "feedback";
  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return [];
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const path = `admin/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const upload = await supabase.storage.from("media").upload(path, file, { upsert: false, contentType: file.type });
      if (upload.error) throw new Error(upload.error.message);
      urls.push(supabase.storage.from("media").getPublicUrl(path).data.publicUrl);
    }
    return urls;
  }
  async function toggleReviewPublished(id: unknown, currentStatus: boolean) {
    setBusy(true); setMessage("");
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_published: !currentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update review status");
      window.location.reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error updating review");
    } finally {
      setBusy(false);
    }
  }
  async function createRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const formElement = event.currentTarget; setBusy(true); setMessage("");
    try {
      const form = new FormData(event.currentTarget);
      if (editing) {
        const table = isCategories ? "categories" : "products";
        const categoryImageInput = event.currentTarget.elements.namedItem("image") as HTMLInputElement | null;
        const categoryImages = isCategories ? await uploadFiles(categoryImageInput?.files ?? null) : [];
        const productImages = isProducts ? await uploadFiles((event.currentTarget.elements.namedItem("images") as HTMLInputElement | null)?.files ?? null) : [];
        const values = isCategories
          ? { name: String(form.get("name")).trim(), description: String(form.get("description") || ""), ...(categoryImages[0] ? { image_url: categoryImages[0] } : {}) }
          : { title: String(form.get("title")).trim(), description: String(form.get("description") || ""), price: Number(form.get("price")), stock: Number(form.get("stock")), sku: String(form.get("sku") || "") || null, material: String(form.get("material") || "") || null, dimensions: String(form.get("dimensions") || "") || null, weight: form.get("weight") ? Number(form.get("weight")) : null, care_instructions: String(form.get("careInstructions") || "") || null, is_featured: form.get("featured") === "on", category_id: String(form.get("category_id") || "") || null, category: categories.find((category) => category.id === form.get("category_id"))?.name ?? null, is_published: form.get("published") === "on", ...(productImages.length ? { images: [...(Array.isArray(editing.images) ? editing.images as string[] : []), ...productImages] } : {}) };
        const result = await supabase.from(table).update(values).eq("id", editing.id);
        if (result.error) throw new Error(result.error.message);
      } else if (isCategories) {
        const name = String(form.get("name")).trim();
        const input = event.currentTarget.elements.namedItem("image") as HTMLInputElement | null;
        const images = await uploadFiles(input?.files ?? null);
        const result = await supabase.from("categories").insert({ name, slug: name.toLowerCase().replace(/\s+/g, "-"), description: String(form.get("description") || ""), image_url: images[0] ?? null });
        if (result.error) throw new Error(result.error.message);
      } else {
        const title = String(form.get("title")).trim(); const input = event.currentTarget.elements.namedItem("images") as HTMLInputElement | null; const images = await uploadFiles(input?.files ?? null);
        const categoryId = String(form.get("category_id") || "") || null;
        const result = await supabase.from("products").insert({ title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), description: String(form.get("description") || ""), price: Number(form.get("price")), stock: Number(form.get("stock")), sku: String(form.get("sku") || "") || null, material: String(form.get("material") || "") || null, dimensions: String(form.get("dimensions") || "") || null, weight: form.get("weight") ? Number(form.get("weight")) : null, care_instructions: String(form.get("careInstructions") || "") || null, is_featured: form.get("featured") === "on", category_id: categoryId, category: categories.find((category) => category.id === categoryId)?.name ?? null, images, is_published: form.get("published") === "on" });
        if (result.error) throw new Error(result.error.message);
      }
      setMessage("Saved successfully."); formElement.reset(); window.location.reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save this record."); } finally { setBusy(false); }
  }
  async function removeRecord(id: unknown) {
    setBusy(true); setMessage("");
    if (isReviews) {
      try {
        const res = await fetch("/api/admin/reviews", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to delete review");
        window.location.reload();
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Error deleting review");
      } finally {
        setBusy(false);
      }
      return;
    }
    const targetTable = isCategories ? "categories" : "products";
    const result = await supabase.from(targetTable).delete().eq("id", id);
    if (result.error) setMessage(result.error.message); else window.location.reload();
    setBusy(false);
  }
  const formDefaults = editing ?? {};
  const selectedCategoryId = String(formDefaults.category_id ?? (formDefaults.category ? categories.find((category) => category.name === formDefaults.category)?.id : "") ?? "");
  const currentPrice = String(formDefaults.price ?? "");
  const currentStock = String(formDefaults.stock ?? "");
  const currentWeight = String(formDefaults.weight ?? "");
  return <SiteChrome><section className="admin-page-shell"><div className="admin-heading-shell"><div><p className="admin-eyebrow">admin workspace</p><h1 className="admin-title">{labels[section]} <i>studio.</i></h1></div><Link className="outline-button" href="/admin">Dashboard →</Link></div><nav className="admin-nav">{Object.keys(labels).map((item) => <Link className={item === section ? "active" : ""} href={`/admin/${item}`} key={item}>{labels[item as Section]}</Link>)}</nav><div className="admin-workspace-grid"><div className="admin-panel"><h2>{section === "analytics" ? "Store activity" : `Live ${labels[section].toLowerCase()}`}</h2>{rows.length ? <div className="admin-record-list">{rows.map((row, index) => <div className="admin-record" key={String(row.id ?? index)}><div><strong>{isReviews ? `${String(row.name ?? 'Guest')} — ${row.rating ?? 5}★` : isWishlists ? `❤️ ${String(row.product_title ?? 'Product')} (${String(row.user_name ?? row.user_email ?? 'Customer')})` : isMailClub ? `💌 ${String(row.name)} — ${String(row.plan ?? 'Monthly')} Mail Club` : isFeedback ? `💬 ${String(row.name ?? 'Guest')} (${row.rating ?? 5}★)` : String(row.title ?? row.name ?? row.order_id ?? row.email ?? `Record ${index + 1}`)}</strong><small>{isReviews ? `"${String(row.body ?? '')}" • Status: ${row.is_published ? "Published" : "Pending approval"}` : isWishlists ? `Saved by: ${String(row.user_email ?? 'Unknown')} • Product ID: ${String(row.product_id ?? '')}` : isMailClub ? `Email: ${String(row.email)} | Phone: ${String(row.phone)} | Address: ${String(row.address ?? '')}, ${String(row.city ?? '')} ${String(row.postal_code ?? '')}` : isFeedback ? `"${String(row.message ?? '')}" — From: ${String(row.email ?? 'No email')}` : String(row.category ?? row.role ?? row.payment_status ?? row.description ?? "Database record")}</small></div><div className="admin-record-actions">{row.price ? <small>{`₹${String(row.price)}`}</small> : row.created_at ? <small>{new Date(String(row.created_at)).toLocaleDateString()}</small> : null}{section === "orders" && <Link href={`/admin/orders/${row.id}`}>Open</Link>}{isReviews && <><button type="button" onClick={() => toggleReviewPublished(row.id, Boolean(row.is_published))}>{row.is_published ? "Hide" : "Approve"}</button><button type="button" onClick={() => removeRecord(row.id)}>Delete</button></>}{(isProducts || isCategories) && <><button type="button" onClick={() => setEditing(row)}>Edit</button><button type="button" onClick={() => removeRecord(row.id)}>Delete</button></>}</div></div>)}</div> : <div className="admin-empty"><strong>Nothing here yet.</strong><span>New database records will appear here automatically.</span></div>}</div>{(isProducts || isCategories) && <div className="admin-panel"><h2>{editing ? "Edit" : "Add"} {isProducts ? "product" : "category"}</h2>    <form key={String(editing?.id ?? "new")} className="admin-form" onSubmit={createRecord}>{isProducts ? <><label>Title<input name="title" defaultValue={String(formDefaults.title ?? "")} required /></label><label>Category<select name="category_id" defaultValue={selectedCategoryId}><option value="">Uncategorized</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label>Price<input name="price" type="number" min="0" defaultValue={currentPrice} required /></label><label>Stock<input name="stock" type="number" min="0" defaultValue={currentStock} required /></label><div className="admin-form-grid"><label>SKU<input name="sku" defaultValue={String(formDefaults.sku ?? "")} /></label><label>Weight (g)<input name="weight" type="number" min="0" step="0.01" defaultValue={currentWeight} /></label></div><label>Material<input name="material" defaultValue={String(formDefaults.material ?? "")} placeholder="Clay, brass, glass..." /></label><label>Dimensions<input name="dimensions" defaultValue={String(formDefaults.dimensions ?? "")} placeholder="Length, width, height" /></label><label>Care instructions<textarea name="careInstructions" defaultValue={String(formDefaults.care_instructions ?? "")} /></label><label>Description<textarea name="description" defaultValue={String(formDefaults.description ?? "")} /></label><label className="admin-dropzone">Product media (add or replace with more images)<input name="images" type="file" accept="image/*" multiple /></label><label><input name="featured" type="checkbox" defaultChecked={Boolean(formDefaults.is_featured)} /> <strong>Feature this product on the storefront.</strong></label><label><input name="published" type="checkbox" defaultChecked={Boolean(formDefaults.is_published)} /> <strong>Publish this product to the storefront.</strong></label></> : <><label>Name<input name="name" defaultValue={String(formDefaults.name ?? "")} required /></label><label>Description<textarea name="description" defaultValue={String(formDefaults.description ?? "")} /></label><label className="admin-dropzone">Category image (optional)<input name="image" type="file" accept="image/*" /></label></>}{message && <p className="admin-message">{message}</p>}<div className="admin-form-actions"><button className="admin-submit" disabled={busy}>{busy ? "Saving..." : editing ? "Update record" : "Save to Supabase"}</button>{editing && <button type="button" className="admin-cancel" onClick={() => setEditing(null)}>Cancel</button>}</div></form></div>}</div></section></SiteChrome>;
}
