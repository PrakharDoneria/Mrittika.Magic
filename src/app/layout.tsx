import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Caveat } from "next/font/google";
import "./global/index.css";

const body = DM_Sans({ variable: "--font-body", subsets: ["latin"] });
const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });
const handwritten = Caveat({ variable: "--font-hand", subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: { default: "Mrittika Magic — Handmade jewellery & tiny joys", template: "%s | Mrittika Magic" },
  description: "Handcrafted jewellery, colorful wearable art, and whimsical objects made in small batches.",
  keywords: ["handmade jewellery", "Mrittika Magic", "clay earrings", "artisan gifts"],
  icons: { icon: "/brand/logo.ico" },
  openGraph: { type: "website", siteName: "Mrittika Magic", title: "Mrittika Magic — Tiny joys, thoughtfully made", description: "Handcrafted jewellery and whimsical objects made in small batches.", images: [{ url: "/brand/og-image.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/brand/og-image.jpg"] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" data-scroll-behavior="smooth"><body className={`${body.variable} ${display.variable} ${handwritten.variable}`}>{children}</body></html>; }
