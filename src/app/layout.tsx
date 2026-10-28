import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Caveat, Lobster, Bree_Serif, Playball, Poppins } from "next/font/google";
import "./global/index.css";

const body = DM_Sans({ variable: "--font-body", subsets: ["latin"] });
const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });
const handwritten = Caveat({ variable: "--font-hand", subsets: ["latin"] });

// Hero section custom fonts requested:
// Main logo: Lobster (400)
const heroMainLogo = Lobster({ weight: "400", variable: "--font-hero-logo", subsets: ["latin"] });
// WELCOME: Bree Serif (400)
const heroWelcome = Bree_Serif({ weight: "400", variable: "--font-hero-welcome", subsets: ["latin"] });
// Tagline: Playball (400)
const heroTagline = Playball({ weight: "400", variable: "--font-hero-tagline", subsets: ["latin"] });
// Buttons: Poppins (400, 500)
const heroButtons = Poppins({ weight: ["400", "500"], variable: "--font-hero-buttons", subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mrittika-magic.com"),
  title: { default: "Mrittika Magic — Handmade jewellery & tiny joys", template: "%s | Mrittika Magic" },
  description: "Handcrafted jewellery, colorful wearable art, and whimsical objects made in small batches.",
  keywords: ["handmade jewellery", "Mrittika Magic", "clay earrings", "artisan gifts"],
  icons: {
    icon: [
      { url: "/brand/logo.ico", type: "image/x-icon" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/brand/logo.ico",
    apple: "/brand/logo.ico",
  },
  openGraph: {
    type: "website",
    siteName: "Mrittika Magic",
    title: "Mrittika Magic — Tiny joys, thoughtfully made",
    description: "Handcrafted jewellery, colorful wearable art, and whimsical objects made in small batches with love.",
    images: [
      {
        url: "/brand/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mrittika Magic Handcrafted Jewellery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mrittika Magic — Tiny joys, thoughtfully made",
    description: "Handcrafted jewellery, colorful wearable art, and whimsical objects made in small batches.",
    images: ["/brand/og-image.jpg"],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${body.variable} ${display.variable} ${handwritten.variable} ${heroMainLogo.variable} ${heroWelcome.variable} ${heroTagline.variable} ${heroButtons.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
