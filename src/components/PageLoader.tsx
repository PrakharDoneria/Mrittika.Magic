"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  // Initial full page load listener
  useEffect(() => {
    const handleReady = () => {
      setClosing(true);
      setTimeout(() => setLoading(false), 450);
    };

    if (document.readyState === "complete") {
      // Delay slightly for smooth perceived animation
      const timer = setTimeout(handleReady, 350);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener("load", handleReady);
      return () => window.removeEventListener("load", handleReady);
    }
  }, []);

  // Listen to route changes (when navigation finishes)
  useEffect(() => {
    // When pathname or search changes, momentarily dismiss loader smoothly
    setClosing(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Intercept click on standard navigation links to trigger loading transition
  useEffect(() => {
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

      // Check if internal route
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin) {
          // If going to a different path or search query, activate ladybug loader
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
