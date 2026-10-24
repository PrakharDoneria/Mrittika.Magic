import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";

export default function ReturnPolicyPage() {
  return <SiteChrome><main className="policy-page"><Link href="/checkout" className="text-link"><ArrowLeft size={15} /> Back to checkout</Link><RotateCcw size={34} /><p className="eyebrow">care, always</p><h1>Return <i>policy.</i></h1><p>Because Mrittika pieces are handmade and often made in small batches, please contact us within 7 days of delivery if your item arrives damaged or has a quality issue.</p><h2>What we can help with</h2><ul><li>Damaged or incorrect items reported with clear photos.</li><li>Unused items in their original packaging, subject to approval.</li><li>Replacement or store credit after our team reviews the request.</li></ul><h2>What is not covered</h2><p>Customised pieces, worn jewellery, change-of-mind returns, and damage caused after delivery are not eligible. Return shipping may apply unless the mistake was ours.</p><p>Write to us through the contact details shared with your order and keep your order number handy.</p></main></SiteChrome>;
}
