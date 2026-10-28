"use client";

import React, { useRef, useEffect } from "react";

interface AutoScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // pixels per animation frame
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

  useEffect(() => {
    let animId: number;

    const tick = () => {
      const el = containerRef.current;
      if (el && !isPausedRef.current) {
        // If content fits without scrolling, do nothing
        if (el.scrollWidth > el.clientWidth) {
          if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
            el.scrollLeft = 0;
          } else {
            el.scrollLeft += speed;
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

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
      onTouchStart={() => {
        if (pauseOnHover) isPausedRef.current = true;
      }}
      onTouchEnd={() => {
        if (pauseOnHover) isPausedRef.current = false;
      }}
    >
      {children}
    </div>
  );
}
