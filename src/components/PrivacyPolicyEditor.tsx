"use client";

import { FormEvent, useState } from "react";
import { Plus, Trash2, Save, ShieldCheck } from "lucide-react";

interface PrivacySection {
  title: string;
  content: string;
}

export default function PrivacyPolicyEditor({ initialSettings }: { initialSettings: any }) {
  const [lastUpdated, setLastUpdated] = useState(initialSettings?.policies?.privacyPolicyLastUpdated || "October 2026");
  const [summary, setSummary] = useState(initialSettings?.policies?.privacyPolicySummary || "");
  const [sections, setSections] = useState<PrivacySection[]>(initialSettings?.policies?.privacySections || []);
  const [returnEmail, setReturnEmail] = useState(initialSettings?.policies?.returnEmail || "hello@mrittikamagic.com");
  const [returnDays, setReturnDays] = useState(initialSettings?.policies?.returnDaysLimit || 7);
  const [returnSummary, setReturnSummary] = useState(initialSettings?.policies?.returnPolicySummary || "");
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const addSection = () => {
    setSections([...sections, { title: `Section ${sections.length + 1}`, content: "" }]);
  };

  const removeSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const updateSection = (idx: number, field: "title" | "content", val: string) => {
    const updated = [...sections];
    updated[idx][field] = val;
    setSections(updated);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");

    try {
      const mergedPolicies = {
        ...initialSettings.policies,
        privacyPolicyLastUpdated: lastUpdated,
        privacyPolicySummary: summary,
        privacySections: sections,
        returnEmail,
        returnDaysLimit: Number(returnDays),
        returnPolicySummary: returnSummary,
      };

      const updatedSettings = {
        ...initialSettings,
        policies: mergedPolicies,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "main", value: updatedSettings }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      setStatusMsg("Privacy & Store Policies saved successfully!");
      setTimeout(() => setStatusMsg(""), 4000);
    } catch (err) {
      setStatusMsg(err instanceof Error ? err.message : "Error saving policy");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSave}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8, fontSize: 18 }}>
          <ShieldCheck size={20} color="var(--coral)" /> Edit Policy Content
        </h3>
        <button className="admin-submit" disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: 6, margin: 0 }}>
          <Save size={14} /> {saving ? "Saving..." : "Save Policies"}
        </button>
      </div>

      {statusMsg && (
        <div style={{ padding: "10px 14px", background: "var(--cream)", border: "1.5px solid var(--ink)", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
          {statusMsg}
        </div>
      )}

      <label>
        Last Updated Notice
        <input value={lastUpdated} onChange={(e) => setLastUpdated(e.target.value)} required />
      </label>

      <label>
        Privacy Policy Main Introduction Summary
        <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} required />
      </label>

      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <strong style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: ".1em" }}>Sections ({sections.length})</strong>
          <button type="button" onClick={addSection} className="outline-button" style={{ padding: "6px 12px", fontSize: 11 }}>
            <Plus size={13} /> Add Section
          </button>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {sections.map((sec, idx) => (
            <div key={idx} style={{ padding: 16, border: "1.5px solid var(--ink)", borderRadius: 12, background: "var(--cream)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800 }}>Section {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSection(idx)}
                  style={{ background: "none", border: "none", color: "var(--coral)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 800 }}
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
              <input
                value={sec.title}
                onChange={(e) => updateSection(idx, "title", e.target.value)}
                placeholder="Section heading (e.g. 1. Information We Collect)"
                style={{ marginBottom: 8, background: "#fff" }}
                required
              />
              <textarea
                rows={3}
                value={sec.content}
                onChange={(e) => updateSection(idx, "content", e.target.value)}
                placeholder="Section text..."
                style={{ background: "#fff" }}
                required
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24, paddingTop: 18, borderTop: "2px dashed rgba(29, 15, 48, 0.2)" }}>
        <h4 style={{ margin: "0 0 12px", fontSize: 15 }}>Return & Support Configuration</h4>
        <div className="admin-form-grid">
          <label>
            Support & Privacy Email
            <input type="email" value={returnEmail} onChange={(e) => setReturnEmail(e.target.value)} required />
          </label>
          <label>
            Return Days Window
            <input type="number" min={1} max={90} value={returnDays} onChange={(e) => setReturnDays(Number(e.target.value))} required />
          </label>
        </div>
        <label>
          Return Policy Summary
          <textarea rows={2} value={returnSummary} onChange={(e) => setReturnSummary(e.target.value)} required />
        </label>
      </div>
    </form>
  );
}
