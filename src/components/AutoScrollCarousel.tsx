"use client";

import React, { useRef, useEffect } from "react";

interface AutoScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // pixels per step (e.g. 0.8)
  pauseOnHover?: boolean;
}

export default function AutoScrollCarousel({
  children,
  className = "",
  speed = 0.8,
  pauseOnHover = true,
}: AutoScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const posRef = useRef(0);

  useEffect(() => {
    let animId: number;
    const el = containerRef.current;
    if (el) {
      posRef.current = el.scrollLeft;
    }

    const tick = () => {
      const target = containerRef.current;
      if (target && !isPausedRef.current) {
        const maxScroll = target.scrollWidth - target.clientWidth;
        if (maxScroll > 1) {
          // Sync with manual user scrolling if dragged
          if (Math.abs(target.scrollLeft - posRef.current) > 3) {
            posRef.current = target.scrollLeft;
          }

          if (posRef.current >= maxScroll - 1) {
            posRef.current = 0;
            target.scrollLeft = 0;
            // Also call scrollTo for iOS Safari WebKit engine
            if (typeof target.scrollTo === "function") {
              try {
                target.scrollTo({ left: 0, behavior: "auto" });
              } catch {}
            }
          } else {
            posRef.current += speed;
            target.scrollLeft = posRef.current;
            if (typeof target.scrollTo === "function") {
              try {
                target.scrollTo({ left: posRef.current, behavior: "auto" });
              } catch {}
            }
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [speed]);

  const handleTouchStart = () => {
    if (pauseOnHover) {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      isPausedRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (pauseOnHover) {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      // Wait 1.2s after user finishes touch before resuming auto-scroll
      resumeTimeoutRef.current = setTimeout(() => {
        if (containerRef.current) {
          posRef.current = containerRef.current.scrollLeft;
        }
        isPausedRef.current = false;
      }, 1200);
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseEnter={() => {
        if (pauseOnHover) isPausedRef.current = true;
      }}
      onMouseLeave={() => {
        if (pauseOnHover) isPausedRef.current = false;
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {children}
    </div>
  );
}
