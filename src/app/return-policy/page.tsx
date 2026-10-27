import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import { getStoreSettings } from "@/data/server-settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Return & Exchange Policy | Mrittika Magic",
  description: "Information about returns, replacements, and our small-batch care guidelines.",
};

export default async function ReturnPolicyPage() {
  const settings = await getStoreSettings();
  const policies = settings?.policies;

  return (
    <SiteChrome>
      <main className="policy-page">
        <Link href="/" className="text-link">
          <ArrowLeft size={15} /> Back to Home
        </Link>
        <RotateCcw size={34} style={{ marginTop: 12, color: "var(--navy, #080786)" }} />
        <p className="eyebrow">care, always</p>
        <h1>Return <i>policy.</i></h1>

        {policies && policies.returnPolicySummary ? (
          <>
            <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
              {policies.returnPolicySummary}
            </p>

            <h2>What we can help with</h2>
            <ul>
              <li>Damaged or incorrect items reported within {policies.returnDaysLimit ?? 7} days of delivery with clear photos.</li>
              <li>Unused items in their original packaging, subject to studio review.</li>
              <li>Prompt replacement or store credit once inspected.</li>
            </ul>

            <h2>What is not covered</h2>
            <p>Customised pieces, worn jewellery, change-of-mind returns, and damage caused after delivery are not eligible. Return shipping may apply unless the mistake was ours.</p>
            {policies.returnEmail && (
              <p>Write to us at <a href={`mailto:${policies.returnEmail}`} style={{ fontWeight: 700, color: "var(--navy, #080786)" }}>{policies.returnEmail}</a> with your order number handy.</p>
            )}
          </>
        ) : (
          <div style={{ marginTop: 32, padding: 32, border: "2px dashed var(--line, #ccc)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <p style={{ margin: "0 0 12px", fontSize: 16, color: "var(--navy, #080786)", fontWeight: 700 }}>
              No Return Policy published in database yet.
            </p>
            <p style={{ margin: "0 0 18px", fontSize: 14, color: "var(--muted, #666)" }}>
              The store administrator can configure and publish the return and refund guidelines from the Admin Panel.
            </p>
            <Link href="/admin/settings" className="solid-button" style={{ fontSize: 13, display: "inline-flex" }}>
              Configure Return Policy in Admin →
            </Link>
          </div>
        )}
      </main>
    </SiteChrome>
  );
}

