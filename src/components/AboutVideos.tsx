"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ALL_VIDEOS = Array.from({ length: 26 }, (_, i) => `/videos/${i + 1}.mp4`);

const SNAPSHOT_BADGES = [
  "Curious forms ✦",
  "Handcrafted with soul ✿",
  "Joyful palette ❀",
  "Clay creations ✦",
  "Studio stories ✿",
  "Made by hands ❀",
];

export default function AboutVideos() {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const posRef = useRef(0);

  useEffect(() => {
    // Pick 6 random distinct videos for rich continuous scrolling
    const shuffled = [...ALL_VIDEOS].sort(() => 0.5 - Math.random());
    setSelectedVideos(shuffled.slice(0, 6));
  }, []);

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

  const videos = selectedVideos.length > 0 ? selectedVideos : [ALL_VIDEOS[0], ALL_VIDEOS[1], ALL_VIDEOS[2], ALL_VIDEOS[3]];

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
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              controls={false}
            />
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
