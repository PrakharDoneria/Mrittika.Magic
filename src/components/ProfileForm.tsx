"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import styles from "@/app/profile/profile.module.css";

export default function ProfileForm({ userId, email, initialName, initialAvatar }: { userId: string; email: string; initialName: string; initialAvatar: string | null }) {
  const [name, setName] = useState(initialName); const [avatar, setAvatar] = useState(initialAvatar); const [preview, setPreview] = useState(initialAvatar); const [previewOpen, setPreviewOpen] = useState(false); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false); const router = useRouter();
  function previewAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) { setPreview(URL.createObjectURL(file)); setPreviewOpen(true); }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage("");
    const supabase = createClient(); const file = (event.currentTarget.elements.namedItem("avatar") as HTMLInputElement).files?.[0]; let avatarUrl = avatar;
    if (file) {
      const path = `profiles/${userId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`; const upload = await supabase.storage.from("media").upload(path, file, { upsert: true, contentType: file.type });
      if (upload.error) { setMessage(upload.error.message); setSaving(false); return; }
      avatarUrl = supabase.storage.from("media").getPublicUrl(path).data.publicUrl; setAvatar(avatarUrl); setPreview(avatarUrl);
    }
    const { error } = await supabase.from("profiles").upsert({ id: userId, name: name.trim(), avatar_url: avatarUrl }, { onConflict: "id" });
    setMessage(error ? error.message : "Profile saved successfully."); setSaving(false); router.refresh();
  }
  async function signOut() { const supabase = createClient(); await supabase.auth.signOut(); router.replace("/account"); router.refresh(); }
  return <><form className={styles.form} onSubmit={save}><label className={styles.field}>Email<input className={styles.input} value={email} readOnly /></label><label className={styles.field}>Name<input className={styles.input} value={name} onChange={(event) => setName(event.target.value)} required /></label><label className={styles.uploadField}><span>Profile photo</span><span className={styles.photoButton}>Choose a photo</span><input className={styles.hiddenFile} name="avatar" type="file" accept="image/*" onChange={previewAvatar} /><small>Choose an image to preview it in a popup.</small></label><div className={styles.actions}><button className={styles.saveButton} disabled={saving}>{saving ? "Saving..." : "Save changes"}</button><button type="button" className={styles.signOut} onClick={signOut}>Sign out</button></div>{message && <p className={`${styles.message} ${message.includes("successfully") ? styles.success : styles.error}`}>{message}</p>}</form>{previewOpen && preview && <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-label="Profile photo preview" onClick={() => setPreviewOpen(false)}><div className={styles.previewModal} onClick={(event) => event.stopPropagation()}><img src={preview} alt="Profile preview" /><p>Preview photo</p><div><button type="button" className={styles.saveButton} onClick={() => setPreviewOpen(false)}>Use this photo</button><button type="button" className={styles.signOut} onClick={() => setPreviewOpen(false)}>Close</button></div></div></div>}</>;
}
