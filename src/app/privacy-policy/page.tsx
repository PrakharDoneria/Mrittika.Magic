import Link from "next/link";
import { ArrowLeft, ShieldCheck, Heart, Sparkles, Mail } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import { STORE_SETTINGS } from "@/data/store-settings";

export const metadata = {
  title: "Privacy Policy | Mrittika Magic",
  description: "How we collect, protect, and respect your personal information at Mrittika Magic.",
};

export default function PrivacyPolicyPage() {
  const { policies, brandName } = STORE_SETTINGS;

  return (
    <SiteChrome>
      <main className="policy-page">
        <Link href="/" className="text-link">
          <ArrowLeft size={15} /> Back to Home
        </Link>
        <ShieldCheck size={36} style={{ color: "var(--navy, #080786)", marginTop: 12 }} />
        <p className="eyebrow">privacy & trust</p>
        <h1>Privacy <i>Policy.</i></h1>
        <p className="policy-last-updated" style={{ fontSize: 13, opacity: 0.7, marginBottom: 24 }}>
          Last updated: {policies.privacyPolicyLastUpdated}
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
          {policies.privacyPolicySummary}
        </p>

        <div className="policy-sections-list" style={{ display: "grid", gap: 28 }}>
          {policies.privacySections.map((sec) => (
            <div key={sec.title} className="policy-block">
              <h2 style={{ fontSize: 20, marginBottom: 8, color: "var(--navy, #080786)" }}>
                {sec.title}
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.85 }}>
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: 24, border: "2px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--yellow, #FFD633)" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--navy, #080786)" }}>Have questions about your data?</h3>
          <p style={{ margin: 0, fontSize: 14 }}>
            Write to us at <a href={`mailto:${policies.returnEmail}`} style={{ fontWeight: 700, color: "var(--navy, #080786)" }}>{policies.returnEmail}</a> and we will be delighted to help you.
          </p>
        </div>
      </main>
    </SiteChrome>
  );
}
