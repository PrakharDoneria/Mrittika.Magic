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
  const isHoveredRef = useRef(false);

  useEffect(() => {
    // Pick 6 random distinct videos for rich continuous scrolling
    const shuffled = [...ALL_VIDEOS].sort(() => 0.5 - Math.random());
    setSelectedVideos(shuffled.slice(0, 6));
  }, []);

  // Continuous smooth auto-scroll
  useEffect(() => {
    let animId: number;
    const speed = 0.75;

    const tick = () => {
      const el = scrollRef.current;
      if (el && !isHoveredRef.current) {
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
  }, [selectedVideos]);

  const videos = selectedVideos.length > 0 ? selectedVideos : [ALL_VIDEOS[0], ALL_VIDEOS[1], ALL_VIDEOS[2], ALL_VIDEOS[3]];

  return (
    <section className="about-snapshots-section">
      <div
        className="about-snapshots-grid auto-scroll-strip"
        ref={scrollRef}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
        onTouchStart={() => { isHoveredRef.current = true; }}
        onTouchEnd={() => { isHoveredRef.current = false; }}
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
