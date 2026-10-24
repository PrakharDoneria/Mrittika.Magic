import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

const body = DM_Sans({ variable: "--font-body", subsets: ["latin"] });
const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });
const handwritten = Caveat({ variable: "--font-hand", subsets: ["latin"] });
export const metadata: Metadata = { title: "Mrittika Magic — Tiny joys, thoughtfully made", description: "A pastel indie shop for colorful objects, gifts, and everyday magic." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" data-scroll-behavior="smooth"><body className={`${body.variable} ${display.variable} ${handwritten.variable}`}>{children}</body></html>; }
