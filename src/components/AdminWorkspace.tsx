"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { SiteChrome } from "./Storefront";
import AnalyticsDashboard from "./AnalyticsDashboard";
import PrivacyPolicyEditor from "./PrivacyPolicyEditor";
import MyArtsManager from "./MyArtsManager";
import {
  BarChart3,
  Box,
  FolderKanban,
  Heart,
  Mail,
  MessageSquareHeart,
  Palette,
  Settings,
  ShoppingBag,
  Star,
  Users,
  CheckCircle,
  EyeOff,
  Trash2,
  ExternalLink,
  Edit,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

type Section =
  | "analytics"
  | "products"
  | "orders"
  | "categories"
  | "my-arts"
  | "settings"
  | "wishlists"
  | "mail-club"
  | "feedback"
  | "customers"
  | "reviews";

type Row = Record<string, unknown>;
type CategoryOption = { id: string; name: string };

const labels: Record<Section, { title: string; icon: any }> = {
  analytics: { title: "Analytics", icon: BarChart3 },
  products: { title: "Products", icon: Box },
  orders: { title: "Orders", icon: ShoppingBag },
  categories: { title: "Categories", icon: FolderKanban },
  "my-arts": { title: "My Arts", icon: Palette },
  settings: { title: "Store & Policies", icon: Settings },
  wishlists: { title: "Wishlists", icon: Heart },
  "mail-club": { title: "Mail Club", icon: Mail },
  feedback: { title: "Feedback", icon: MessageSquareHeart },
  customers: { title: "Customers", icon: Users },
  reviews: { title: "Reviews", icon: Star },
};

interface AdminWorkspaceProps {
  section: Section;
  rows: Row[];
  categories: CategoryOption[];
  ordersForAnalytics?: any[];
  wishlistsForAnalytics?: any[];
  storeSettings?: any;
}

export default function AdminWorkspace({
  section,
  rows,
  categories,
  ordersForAnalytics = [],
  wishlistsForAnalytics = [],
  storeSettings = {},
}: AdminWorkspaceProps) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const supabase = createClient();

  const isProducts = section === "products";
  const isCategories = section === "categories";
  const isReviews = section === "reviews";
  const isWishlists = section === "wishlists";
  const isMailClub = section === "mail-club";
  const isFeedback = section === "feedback";
  const isCustomers = section === "customers";
  const isOrders = section === "orders";

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
    setBusy(true);
    setMessage("");
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
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setMessage("");

    try {
      const form = new FormData(event.currentTarget);
      if (editing) {
        const table = isCategories ? "categories" : "products";
        const categoryImageInput = event.currentTarget.elements.namedItem("image") as HTMLInputElement | null;
        const categoryImages = isCategories ? await uploadFiles(categoryImageInput?.files ?? null) : [];
        const productImages = isProducts
          ? await uploadFiles((event.currentTarget.elements.namedItem("images") as HTMLInputElement | null)?.files ?? null)
          : [];

        const values = isCategories
          ? {
              name: String(form.get("name")).trim(),
              description: String(form.get("description") || ""),
              ...(categoryImages[0] ? { image_url: categoryImages[0] } : {}),
            }
          : {
              title: String(form.get("title")).trim(),
              description: String(form.get("description") || ""),
              price: Number(form.get("price")),
              stock: Number(form.get("stock")),
              sku: String(form.get("sku") || "") || null,
              material: String(form.get("material") || "") || null,
              dimensions: String(form.get("dimensions") || "") || null,
              weight: form.get("weight") ? Number(form.get("weight")) : null,
              care_instructions: String(form.get("careInstructions") || "") || null,
              is_featured: form.get("featured") === "on",
              category_id: String(form.get("category_id") || "") || null,
              category: categories.find((category) => category.id === form.get("category_id"))?.name ?? null,
              is_published: form.get("published") === "on",
              ...(productImages.length
                ? { images: [...(Array.isArray(editing.images) ? (editing.images as string[]) : []), ...productImages] }
                : {}),
            };

        const result = await supabase.from(table).update(values).eq("id", editing.id);
        if (result.error) throw new Error(result.error.message);
      } else if (isCategories) {
        const name = String(form.get("name")).trim();
        const input = event.currentTarget.elements.namedItem("image") as HTMLInputElement | null;
        const images = await uploadFiles(input?.files ?? null);
        const result = await supabase.from("categories").insert({
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          description: String(form.get("description") || ""),
          image_url: images[0] ?? null,
        });
        if (result.error) throw new Error(result.error.message);
      } else {
        const title = String(form.get("title")).trim();
        const input = event.currentTarget.elements.namedItem("images") as HTMLInputElement | null;
        const images = await uploadFiles(input?.files ?? null);
        const categoryId = String(form.get("category_id") || "") || null;
        const result = await supabase.from("products").insert({
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: String(form.get("description") || ""),
          price: Number(form.get("price")),
          stock: Number(form.get("stock")),
          sku: String(form.get("sku") || "") || null,
          material: String(form.get("material") || "") || null,
          dimensions: String(form.get("dimensions") || "") || null,
          weight: form.get("weight") ? Number(form.get("weight")) : null,
          care_instructions: String(form.get("careInstructions") || "") || null,
          is_featured: form.get("featured") === "on",
          category_id: categoryId,
          category: categories.find((category) => category.id === categoryId)?.name ?? null,
          images,
          is_published: form.get("published") === "on",
        });
        if (result.error) throw new Error(result.error.message);
      }

      setMessage("Saved successfully.");
      formElement.reset();
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save this record.");
    } finally {
      setBusy(false);
    }
  }

  async function removeRecord(id: unknown) {
    setBusy(true);
    setMessage("");
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
    if (result.error) setMessage(result.error.message);
    else window.location.reload();
    setBusy(false);
  }

  const formDefaults = editing ?? {};
  const selectedCategoryId = String(
    formDefaults.category_id ??
      (formDefaults.category ? categories.find((category) => category.name === formDefaults.category)?.id : "") ??
      ""
  );

  return (
    <SiteChrome>
      <section className="admin-page-shell">
        {/* Header Bar */}
        <div className="admin-heading-shell">
          <div>
            <p className="admin-eyebrow">studio control center</p>
            <h1 className="admin-title">
              {labels[section].title} <i>studio.</i>
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link className="outline-button" href="/shop">
              Storefront ↗
            </Link>
            <Link className="solid-button" href="/admin">
              Dashboard Overview →
            </Link>
          </div>
        </div>

        {/* Individual Section Nav Tabs */}
        <nav className="admin-nav">
          {(Object.keys(labels) as Section[]).map((item) => {
            const ItemIcon = labels[item].icon;
            return (
              <Link className={item === section ? "active" : ""} href={`/admin/${item}`} key={item}>
                <ItemIcon size={14} style={{ display: "inline-block", marginRight: 6, verticalAlign: "-2px" }} />
                {labels[item].title}
              </Link>
            );
          })}
        </nav>

        {/* ─── SPECIALIZED SECTION RENDERING ─────────────────── */}
        {section === "analytics" ? (
          <AnalyticsDashboard events={rows} orders={ordersForAnalytics} wishlists={wishlistsForAnalytics} />
        ) : section === "my-arts" ? (
          <MyArtsManager initialPieces={rows as any} />
        ) : section === "settings" ? (
          <div className="admin-panel" style={{ maxWidth: 860, margin: "0 auto" }}>
            <PrivacyPolicyEditor initialSettings={storeSettings} />
          </div>
        ) : (
          /* Standard Database Tables Grid */
          <div className="admin-workspace-grid">
            <div className="admin-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>
                  Live {labels[section].title} ({rows.length})
                </h2>
              </div>

              {rows.length ? (
                <div className="admin-record-list">
                  {rows.map((row, index) => (
                    <div className="admin-record" key={String(row.id ?? index)}>
                      <div>
                        <strong>
                          {isReviews
                            ? `★ ${row.rating ?? 5}/5 — ${String(row.name ?? "Guest")}`
                            : isWishlists
                            ? `❤️ ${String(row.product_title ?? "Saved Product")} (${String(
                                row.user_name ?? row.user_email ?? "Customer"
                              )})`
                            : isMailClub
                            ? `💌 ${String(row.name)} • ${String(row.plan ?? "Monthly")} Club`
                            : isFeedback
                            ? `💬 ${String(row.name ?? "Shopper")} (${row.rating ?? 5}★)`
                            : isCustomers
                            ? `👤 ${String(row.name || row.email || "Registered Customer")}`
                            : isOrders
                            ? `🛍️ Order #${String(row.order_id || row.id).slice(0, 8)} • ₹${Number(row.total_amount || 0).toLocaleString("en-IN")}`
                            : String(row.title ?? row.name ?? `Record #${index + 1}`)}
                        </strong>
                        <small>
                          {isReviews
                            ? `"${String(row.body ?? "")}" • ${row.is_published ? "🟢 Approved" : "🟡 Pending"}`
                            : isWishlists
                            ? `User: ${String(row.user_email ?? "Guest")} • Added: ${new Date(String(row.created_at)).toLocaleDateString()}`
                            : isMailClub
                            ? `🟢 Active Subscriber • Phone: ${String(row.phone)} • Email: ${String(row.email)} • Address: ${String(row.address ?? "")}, ${String(row.city ?? "")}, ${String(row.state ?? "")} - ${String(row.postal_code ?? "")}`
                            : isFeedback
                            ? `"${String(row.message ?? "")}" — Email: ${String(row.email ?? "None")}`
                            : isCustomers
                            ? `Role: ${String(row.role || "customer")} • Joined: ${new Date(String(row.created_at || Date.now())).toLocaleDateString()}`
                            : isOrders
                            ? `Status: ${String(row.fulfillment_status || "Placed")} • Payment: ${String(row.payment_status || "Pending")}`
                            : String(row.category ?? row.description ?? "Database record")}
                        </small>
                      </div>

                      <div className="admin-record-actions">
                        {isMailClub && (
                          <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 8px", background: "rgba(10, 140, 60, 0.1)", color: "#0A8C3C", borderRadius: "var(--radius-pill)" }}>
                            Active Plan
                          </span>
                        )}
                        {row.price ? (
                          <span style={{ fontWeight: 800, fontSize: 13, color: "var(--ink)" }}>
                            ₹{String(row.price)}
                          </span>
                        ) : null}

                        {isOrders && (
                          <Link href={`/admin/orders/${row.id}`} className="solid-button" style={{ fontSize: 11, padding: "6px 12px" }}>
                            Manage Order →
                          </Link>
                        )}

                        {isReviews && (
                          <>
                            <button
                              type="button"
                              onClick={() => toggleReviewPublished(row.id, Boolean(row.is_published))}
                            >
                              {row.is_published ? "Hide" : "Approve"}
                            </button>
                            <button type="button" onClick={() => removeRecord(row.id)}>
                              Delete
                            </button>
                          </>
                        )}

                        {(isProducts || isCategories) && (
                          <>
                            <button type="button" onClick={() => setEditing(row)}>
                              Edit
                            </button>
                            <button type="button" onClick={() => removeRecord(row.id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-empty">
                  <strong>No {labels[section].title.toLowerCase()} recorded yet.</strong>
                  <span>Records will appear here in real-time as users interact with the store.</span>
                </div>
              )}
            </div>

            {/* Creation Form for Products & Categories */}
            {(isProducts || isCategories) && (
              <div className="admin-panel">
                <h2>
                  {editing ? "Edit" : "Add"} {isProducts ? "Product" : "Category"}
                </h2>
                <form key={String(editing?.id ?? "new")} className="admin-form" onSubmit={createRecord}>
                  {isProducts ? (
                    <>
                      <label>
                        Title
                        <input name="title" defaultValue={String(formDefaults.title ?? "")} required />
                      </label>
                      <label>
                        Category
                        <select name="category_id" defaultValue={selectedCategoryId}>
                          <option value="">Uncategorized</option>
                          {categories.map((category) => (
                            <option value={category.id} key={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="admin-form-grid">
                        <label>
                          Price (₹)
                          <input name="price" type="number" min="0" defaultValue={String(formDefaults.price ?? "")} required />
                        </label>
                        <label>
                          Stock Count
                          <input name="stock" type="number" min="0" defaultValue={String(formDefaults.stock ?? "")} required />
                        </label>
                      </div>
                      <div className="admin-form-grid">
                        <label>
                          SKU
                          <input name="sku" defaultValue={String(formDefaults.sku ?? "")} />
                        </label>
                        <label>
                          Weight (g)
                          <input name="weight" type="number" min="0" step="0.01" defaultValue={String(formDefaults.weight ?? "")} />
                        </label>
                      </div>
                      <label>
                        Material
                        <input name="material" defaultValue={String(formDefaults.material ?? "")} placeholder="Clay, beads, brass..." />
                      </label>
                      <label>
                        Dimensions
                        <input name="dimensions" defaultValue={String(formDefaults.dimensions ?? "")} placeholder="Length, width, height" />
                      </label>
                      <label>
                        Care Instructions
                        <textarea name="careInstructions" defaultValue={String(formDefaults.care_instructions ?? "")} rows={2} />
                      </label>
                      <label>
                        Description
                        <textarea name="description" defaultValue={String(formDefaults.description ?? "")} rows={3} />
                      </label>
                      <label className="admin-dropzone">
                        Product media (upload more photos)
                        <input name="images" type="file" accept="image/*" multiple />
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input name="featured" type="checkbox" defaultChecked={Boolean(formDefaults.is_featured)} />
                        <strong>Feature this product on storefront home.</strong>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input name="published" type="checkbox" defaultChecked={formDefaults.is_published !== false} />
                        <strong>Publish item to customer catalog.</strong>
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        Category Name
                        <input name="name" defaultValue={String(formDefaults.name ?? "")} required />
                      </label>
                      <label>
                        Description
                        <textarea name="description" defaultValue={String(formDefaults.description ?? "")} rows={3} />
                      </label>
                      <label className="admin-dropzone">
                        Category Cover Photo
                        <input name="image" type="file" accept="image/*" />
                      </label>
                    </>
                  )}

                  {message && <p className="admin-message">{message}</p>}

                  <div className="admin-form-actions">
                    <button className="admin-submit" disabled={busy}>
                      {busy ? "Saving..." : editing ? "Update record" : "Save to Database"}
                    </button>
                    {editing && (
                      <button type="button" className="admin-cancel" onClick={() => setEditing(null)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </section>
    </SiteChrome>
  );
}
