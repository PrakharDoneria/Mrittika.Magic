"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ALL_VIDEOS = Array.from({ length: 26 }, (_, i) => `/videos/${i + 1}.mp4`);

const SNAPSHOT_BADGES = [
  "Curious forms ✦",
  "Handcrafted with soul ✿",
  "Joyful palette ❀",
];

export default function AboutVideos() {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  useEffect(() => {
    // Pick 3 random distinct videos every time
    const shuffled = [...ALL_VIDEOS].sort(() => 0.5 - Math.random());
    setSelectedVideos(shuffled.slice(0, 3));
  }, []);

  if (selectedVideos.length === 0) {
    // Fallback initial videos before hydration
    return (
      <section className="about-snapshots-section">
        <div className="about-snapshots-grid">
          {[1, 2, 3].map((num, idx) => (
            <Link href="/shop" key={num} className="about-snapshot-card">
              <video
                src={`/videos/${num}.mp4`}
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                controls={false}
              />
              <span>{SNAPSHOT_BADGES[idx]}</span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="about-snapshots-section">
      <div className="about-snapshots-grid">
        {selectedVideos.map((videoSrc, idx) => (
          <Link
            href="/shop"
            key={videoSrc}
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
            <span>{SNAPSHOT_BADGES[idx % SNAPSHOT_BADGES.length]}</span>
            <div className="about-snapshot-hover">
              <span>View in shop <ArrowRight size={13} /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
