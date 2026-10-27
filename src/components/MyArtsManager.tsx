"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Palette, Plus, Trash2, Edit2, Sparkles, ExternalLink } from "lucide-react";
import type { ArtPiece } from "@/data/types";

interface MyArtsManagerProps {
  initialPieces: ArtPiece[];
}

export default function MyArtsManager({ initialPieces = [] }: MyArtsManagerProps) {
  const [pieces, setPieces] = useState<ArtPiece[]>(initialPieces);
  const [editing, setEditing] = useState<ArtPiece | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  async function uploadImage(file: File | null) {
    if (!file) return null;
    const path = `arts/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const upload = await supabase.storage.from("media").upload(path, file, { upsert: false, contentType: file.type });
    if (upload.error) throw new Error(upload.error.message);
    return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const form = new FormData(e.currentTarget);
      const title = String(form.get("title") || "").trim();
      const category = String(form.get("category") || "").trim();
      const year = String(form.get("year") || "2024").trim();
      const badge = String(form.get("badge") || "").trim();
      const description = String(form.get("description") || "").trim();
      const imageUrlInput = String(form.get("imageUrl") || "").trim();

      const fileInput = e.currentTarget.elements.namedItem("imageFile") as HTMLInputElement | null;
      const uploadedUrl = await uploadImage(fileInput?.files?.[0] ?? null);

      const finalImage = uploadedUrl || imageUrlInput || editing?.image || "/media/necklace.jpeg";

      if (editing) {
        const { error } = await supabase.from("my_arts").update({
          title,
          category,
          year,
          badge,
          description,
          image: finalImage,
        }).eq("id", editing.id);

        if (error) throw new Error(error.message);
        setMessage("Art piece updated successfully!");
      } else {
        const { error } = await supabase.from("my_arts").insert({
          title,
          category,
          year,
          badge,
          description,
          image: finalImage,
        });

        if (error) throw new Error(error.message);
        setMessage("New art piece added to studio archive!");
      }

      setEditing(null);
      e.currentTarget.reset();
      window.location.reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error saving art piece");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this art piece?")) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("my_arts").delete().eq("id", id);
      if (error) throw new Error(error.message);
      setPieces(pieces.filter((p) => p.id !== id));
      setMessage("Art piece removed.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error deleting piece");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-workspace-grid">
      {/* Existing Art Gallery Items */}
      <div className="admin-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <Palette size={22} color="var(--coral)" /> Studio Art Pieces ({pieces.length})
          </h2>
          <a href="/my-arts" target="_blank" rel="noreferrer" className="outline-button" style={{ fontSize: 11, padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
            View live page <ExternalLink size={13} />
          </a>
        </div>

        {pieces.length ? (
          <div className="admin-record-list">
            {pieces.map((item) => (
              <div key={item.id} className="admin-record" style={{ gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", border: "1.5px solid var(--ink)" }}
                  />
                  <div>
                    <strong style={{ fontSize: 15 }}>{item.title}</strong>
                    <small>
                      {item.category} • {item.year} {item.badge ? `• [${item.badge}]` : ""}
                    </small>
                    <p style={{ margin: "4px 0 0", fontSize: 12, opacity: 0.8, maxHeight: 38, overflow: "hidden" }}>
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="admin-record-actions">
                  <button type="button" onClick={() => setEditing(item)}>
                    <Edit2 size={12} style={{ display: "inline", marginRight: 4 }} /> Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={12} style={{ display: "inline", marginRight: 4 }} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <strong>No pieces added yet.</strong>
            <span>Add your first piece using the form on the right.</span>
          </div>
        )}
      </div>

      {/* Add / Edit Form */}
      <div className="admin-panel">
        <h2>{editing ? "Edit Art Piece" : "Add New Art Piece"}</h2>
        <form key={editing?.id || "new-art"} className="admin-form" onSubmit={handleSubmit}>
          <label>
            Artwork Title
            <input name="title" defaultValue={editing?.title || ""} placeholder="e.g. Hand-Molded Clay Botanicals" required />
          </label>

          <div className="admin-form-grid">
            <label>
              Category
              <input name="category" defaultValue={editing?.category || ""} placeholder="Clay & Flora / Wearable Art" required />
            </label>
            <label>
              Creation Year
              <input name="year" defaultValue={editing?.year || "2024"} placeholder="2024" required />
            </label>
          </div>

          <label>
            Badge / Tag (Optional)
            <input name="badge" defaultValue={editing?.badge || ""} placeholder="Limited Edition / Studio Signature" />
          </label>

          <label>
            Short Description / Story
            <textarea
              name="description"
              defaultValue={editing?.description || ""}
              rows={3}
              placeholder="Tell shoppers the story or craftsmanship behind this piece..."
              required
            />
          </label>

          <label className="admin-dropzone">
            Upload Artwork Image
            <input name="imageFile" type="file" accept="image/*" />
          </label>

          <label>
            Or External Image URL / Public Path
            <input name="imageUrl" defaultValue={editing?.image || ""} placeholder="/media/necklace.jpeg or https://..." />
          </label>

          {message && <p className="admin-message">{message}</p>}

          <div className="admin-form-actions">
            <button className="admin-submit" disabled={busy}>
              {busy ? "Saving..." : editing ? "Update Art Piece" : "Add to My Arts Page"}
            </button>
            {editing && (
              <button type="button" className="admin-cancel" onClick={() => setEditing(null)}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
