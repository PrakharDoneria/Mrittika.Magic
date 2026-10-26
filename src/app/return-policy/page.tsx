import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import { STORE_SETTINGS } from "@/data/store-settings";

export const metadata = {
  title: "Return & Exchange Policy | Mrittika Magic",
  description: "Information about returns, replacements, and our small-batch care guidelines.",
};

export default function ReturnPolicyPage() {
  const { policies } = STORE_SETTINGS;

  return (
    <SiteChrome>
      <main className="policy-page">
        <Link href="/" className="text-link">
          <ArrowLeft size={15} /> Back to Home
        </Link>
        <RotateCcw size={34} style={{ marginTop: 12, color: "var(--navy, #080786)" }} />
        <p className="eyebrow">care, always</p>
        <h1>Return <i>policy.</i></h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          {policies.returnPolicySummary}
        </p>

        <h2>What we can help with</h2>
        <ul>
          <li>Damaged or incorrect items reported within {policies.returnDaysLimit} days of delivery with clear photos.</li>
          <li>Unused items in their original packaging, subject to studio review.</li>
          <li>Prompt replacement or store credit once inspected.</li>
        </ul>

        <h2>What is not covered</h2>
        <p>Customised pieces, worn jewellery, change-of-mind returns, and damage caused after delivery are not eligible. Return shipping may apply unless the mistake was ours.</p>
        <p>Write to us at <a href={`mailto:${policies.returnEmail}`} style={{ fontWeight: 700, color: "var(--navy, #080786)" }}>{policies.returnEmail}</a> with your order number handy.</p>
      </main>
    </SiteChrome>
  );
}

