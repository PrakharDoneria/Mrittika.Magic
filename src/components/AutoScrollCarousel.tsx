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
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      // Give the user 1.5s after touch interaction ends before resuming smooth auto scroll
      resumeTimeoutRef.current = setTimeout(() => {
        isPausedRef.current = false;
      }, 1500);
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
