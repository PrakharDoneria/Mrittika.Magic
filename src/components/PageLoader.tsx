"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  // Instant display without blocking initial DOM render
  useEffect(() => {
    // Only show loader for subsequent client navigations, letting initial page load in 0-1ms
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        targetAttr === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin) {
          if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
            setClosing(false);
            setLoading(true);
          }
        }
      } catch {}
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, []);

  // Dismiss loader on pathname / search change
  useEffect(() => {
    if (loading) {
      setClosing(true);
      const timer = setTimeout(() => {
        setLoading(false);
        setClosing(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, loading]);

  if (!loading) return null;

  return (
    <div
      className={`page-preloader-overlay ${closing ? "fade-out" : ""}`}
      aria-hidden="true"
    >
      <div className="ladybug-loader-box">
        <div className="ladybug-pulse-ring"></div>
        <div className="ladybug-icon-animated">
          <Image
            src="/brand/ladybug.png"
            alt="Loading..."
            width={72}
            height={72}
            priority
            unoptimized
          />
        </div>
        <p className="ladybug-loader-caption">Sprinkling everyday magic...</p>
      </div>
    </div>
  );
}
