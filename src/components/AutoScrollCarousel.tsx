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
  const isInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animId: number;

    const el = containerRef.current;
    if (el) {
      posRef.current = el.scrollLeft;
    }

    const tick = (currentTime: number) => {
      const target = containerRef.current;
      if (!target) {
        animId = requestAnimationFrame(tick);
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }
      const deltaMs = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Cap deltaMs to avoid huge jumps if tab was in background
      const safeDelta = Math.min(deltaMs, 40);
      const step = (speed * 60 * safeDelta) / 1000;

      if (!isInteractingRef.current) {
        const maxScroll = target.scrollWidth - target.clientWidth;
        if (maxScroll > 1) {
          // Sync with manual touch/trackpad scroll if user swiped
          if (Math.abs(target.scrollLeft - posRef.current) > 3) {
            posRef.current = target.scrollLeft;
          }

          if (posRef.current >= maxScroll - 1) {
            posRef.current = 0;
            target.scrollLeft = 0;
          } else {
            posRef.current += step;
            target.scrollLeft = posRef.current;
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

  const handlePointerDown = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    isInteractingRef.current = true;
  };

  const handlePointerUp = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        posRef.current = containerRef.current.scrollLeft;
      }
      isInteractingRef.current = false;
    }, 1200);
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      isInteractingRef.current = true;
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      handlePointerUp();
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
      onTouchCancel={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "auto",
      }}
    >
      {children}
    </div>
  );
}
