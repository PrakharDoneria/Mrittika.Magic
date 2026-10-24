"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { SiteChrome } from "./Storefront";

type Section = "analytics" | "products" | "orders" | "categories" | "customers";
type Row = Record<string, unknown>;
type CategoryOption = { id: string; name: string };
const labels: Record<Section, string> = { analytics: "Analytics", products: "Products", orders: "Orders", categories: "Categories", customers: "Customers" };

export default function AdminWorkspace({ section, rows, categories }: { section: Section; rows: Row[]; categories: CategoryOption[] }) {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const [editing, setEditing] = useState<Row | null>(null); const supabase = createClient();
  const isProducts = section === "products"; const isCategories = section === "categories";
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
          : { title: String(form.get("title")).trim(), description: String(form.get("description") || ""), price: Number(form.get("price")), stock: Number(form.get("stock")), category_id: String(form.get("category_id") || "") || null, category: categories.find((category) => category.id === form.get("category_id"))?.name ?? null, is_published: form.get("published") === "on", ...(productImages.length ? { images: [...(Array.isArray(editing.images) ? editing.images as string[] : []), ...productImages] } : {}) };
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
        const result = await supabase.from("products").insert({ title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), description: String(form.get("description") || ""), price: Number(form.get("price")), stock: Number(form.get("stock")), category_id: categoryId, category: categories.find((category) => category.id === categoryId)?.name ?? null, images, is_published: form.get("published") === "on" });
        if (result.error) throw new Error(result.error.message);
      }
      setMessage("Saved successfully."); formElement.reset(); window.location.reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save this record."); } finally { setBusy(false); }
  }
  async function removeRecord(id: unknown) {
    setBusy(true); setMessage("");
    const result = await supabase.from(isCategories ? "categories" : "products").delete().eq("id", id);
    if (result.error) setMessage(result.error.message); else window.location.reload();
    setBusy(false);
  }
  const formDefaults = editing ?? {};
  const selectedCategoryId = String(formDefaults.category_id ?? (formDefaults.category ? categories.find((category) => category.name === formDefaults.category)?.id : "") ?? "");
  const currentPrice = String(formDefaults.price ?? "");
  const currentStock = String(formDefaults.stock ?? "");
  return <SiteChrome><section className="admin-page-shell"><div className="admin-heading-shell"><div><p className="admin-eyebrow">admin workspace</p><h1 className="admin-title">{labels[section]} <i>studio.</i></h1></div><Link className="outline-button" href="/admin">Dashboard →</Link></div><nav className="admin-nav">{Object.keys(labels).map((item) => <Link className={item === section ? "active" : ""} href={`/admin/${item}`} key={item}>{labels[item as Section]}</Link>)}</nav><div className="admin-workspace-grid"><div className="admin-panel"><h2>{section === "analytics" ? "Store activity" : `Live ${labels[section].toLowerCase()}`}</h2>{rows.length ? <div className="admin-record-list">{rows.map((row, index) => <div className="admin-record" key={String(row.id ?? index)}><div><strong>{String(row.title ?? row.name ?? row.order_id ?? row.email ?? `Record ${index + 1}`)}</strong><small>{String(row.category ?? row.role ?? row.payment_status ?? row.description ?? "Database record")}</small></div><div className="admin-record-actions">{row.price ? <small>{`₹${String(row.price)}`}</small> : row.created_at ? <small>{new Date(String(row.created_at)).toLocaleDateString()}</small> : null}{section === "orders" && <Link href={`/admin/orders/${row.id}`}>Open</Link>}{(isProducts || isCategories) && <><button type="button" onClick={() => setEditing(row)}>Edit</button><button type="button" onClick={() => removeRecord(row.id)}>Delete</button></>}</div></div>)}</div> : <div className="admin-empty"><strong>Nothing here yet.</strong><span>New database records will appear here automatically.</span></div>}</div>{(isProducts || isCategories) && <div className="admin-panel"><h2>{editing ? "Edit" : "Add"} {isProducts ? "product" : "category"}</h2>  <form key={String(editing?.id ?? "new")} className="admin-form" onSubmit={createRecord}>{isProducts ? <><label>Title<input name="title" defaultValue={String(formDefaults.title ?? "")} required /></label><label>Category<select name="category_id" defaultValue={selectedCategoryId}><option value="">Uncategorized</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label>Price<input name="price" type="number" min="0" defaultValue={currentPrice} required /></label><label>Stock<input name="stock" type="number" min="0" defaultValue={currentStock} required /></label><label>Description<textarea name="description" defaultValue={String(formDefaults.description ?? "")} /></label><label className="admin-dropzone">Product media (add or replace with more images)<input name="images" type="file" accept="image/*" multiple /></label><label><input name="published" type="checkbox" defaultChecked={Boolean(formDefaults.is_published)} /> <strong>Check this box to publish the product to the storefront.</strong></label></> : <><label>Name<input name="name" defaultValue={String(formDefaults.name ?? "")} required /></label><label>Description<textarea name="description" defaultValue={String(formDefaults.description ?? "")} /></label><label className="admin-dropzone">Category image (optional)<input name="image" type="file" accept="image/*" /></label></>}{message && <p className="admin-message">{message}</p>}<div className="admin-form-actions"><button className="admin-submit" disabled={busy}>{busy ? "Saving..." : editing ? "Update record" : "Save to Supabase"}</button>{editing && <button type="button" className="admin-cancel" onClick={() => setEditing(null)}>Cancel</button>}</div></form></div>}</div></section></SiteChrome>;
}
