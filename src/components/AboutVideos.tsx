"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppleVideo from "@/components/AppleVideo";

// Curated lightweight 4-5 videos excluding heavy 6, 17, 18
const ABOUT_ALLOWED_VIDEOS = [
  "/videos/9.mp4",
  "/videos/23.mp4",
  "/videos/20.mp4",
  "/videos/13.mp4",
  "/videos/12.mp4",
];

const SNAPSHOT_BADGES = [
  "Curious forms ✦",
  "Handcrafted with soul ✿",
  "Joyful palette ❀",
  "Clay creations ✦",
  "Studio stories ✿",
];

export default function AboutVideos() {
  const [selectedVideos, setSelectedVideos] = useState<string[]>(ABOUT_ALLOWED_VIDEOS);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const posRef = useRef(0);

  // Continuous smooth auto-scroll with Apple / iOS WebKit support
  useEffect(() => {
    let animId: number;
    const speed = 0.75;
    const el = scrollRef.current;
    if (el) {
      posRef.current = el.scrollLeft;
    }

    const tick = () => {
      const target = scrollRef.current;
      if (target && !isPausedRef.current) {
        const maxScroll = target.scrollWidth - target.clientWidth;
        if (maxScroll > 1) {
          if (Math.abs(target.scrollLeft - posRef.current) > 3) {
            posRef.current = target.scrollLeft;
          }

          if (posRef.current >= maxScroll - 1) {
            posRef.current = 0;
            target.scrollLeft = 0;
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
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [selectedVideos]);

  const handleTouchStart = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    isPausedRef.current = true;
  };

  const handleTouchEnd = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      if (scrollRef.current) {
        posRef.current = scrollRef.current.scrollLeft;
      }
      isPausedRef.current = false;
    }, 1200);
  };

  const videos = selectedVideos.length > 0 ? selectedVideos : ABOUT_ALLOWED_VIDEOS;

  return (
    <section className="about-snapshots-section">
      <div
        className="about-snapshots-grid auto-scroll-strip"
        ref={scrollRef}
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {videos.map((videoSrc, idx) => (
          <Link
            href="/shop"
            key={`${videoSrc}-${idx}`}
            className="about-snapshot-card"
            title="Explore in shop"
          >
            <AppleVideo src={videoSrc} />
            <span className="about-snapshot-badge">{SNAPSHOT_BADGES[idx % SNAPSHOT_BADGES.length]}</span>
            <div className="about-snapshot-hover">
              <span className="about-snapshot-btn">View in shop <ArrowRight size={13} /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
