"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Camera } from "lucide-react";

const ALL_VIDEOS = Array.from({ length: 26 }, (_, i) => `/videos/${i + 1}.mp4`);

const CAPTIONS = [
  "Studio vibes ✦",
  "Handcrafted with love ✿",
  "Clay & magic ❀",
  "Wearable art ✦",
  "Fresh drops ✿",
  "Joyful imperfections ❀",
  "From our studio ✦",
  "Pure magic ✿",
];

interface VideoCard {
  src: string;
  rotation: number;
  offsetY: number;
  caption: string;
}

export default function InstagramFeed() {
  const [videoCards, setVideoCards] = useState<VideoCard[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    // Pick 8 random videos from public/videos (1.mp4 to 26.mp4)
    const shuffled = [...ALL_VIDEOS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8);

    const cards: VideoCard[] = selected.map((src, idx) => {
      const cap = CAPTIONS[idx % CAPTIONS.length];
      return { src, rotation: 0, offsetY: 0, caption: cap };
    });

    setVideoCards(cards);
  }, []);

  // Continuous smooth auto-scroll
  useEffect(() => {
    let animId: number;
    const speed = 0.75; // smooth gentle pixels per frame

    const step = () => {
      const el = scrollRef.current;
      if (el && !isHoveredRef.current) {
        // If reached end, wrap back smoothly
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += speed;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [videoCards]);

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  return (
    <section className="ig-section reveal">
      {/* Header */}
      <div className="ig-header">
        <div className="ig-header-left">
          <p className="eyebrow">Connect with us on instagram</p>
          <h2>Follow along <i>@mrittika.magic</i></h2>
          <p className="ig-subtitle" style={{ fontSize: "14px", opacity: 0.85, margin: "6px 0 0" }}>
            Get closer to the craft, the maker, and the magic. Tap any piece to explore the shop.
          </p>
        </div>
        <a
          href="https://www.instagram.com/mrittika.magic/"
          target="_blank"
          rel="noreferrer"
          className="ig-follow-btn"
          aria-label="Follow Mrittika Magic on Instagram"
        >
          <Camera size={16} />
          Follow us
        </a>
      </div>

      {/* Horizontal Video Carousel */}
      <div className="ig-video-showcase-wrap">
        <div
          className="ig-video-scroll-container"
          ref={scrollRef}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
          onTouchStart={() => { isHoveredRef.current = true; }}
          onTouchEnd={() => { isHoveredRef.current = false; }}
        >
          {videoCards.map((card, idx) => (
            <Link
              key={idx}
              href="/shop"
              className="ig-video-card"
              title="Click to explore the shop"
            >
              <div className="ig-video-frame">
                <video
                  src={card.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  controls={false}
                  className="ig-video-element"
                />
                <div className="ig-video-badge">
                  <span>{card.caption}</span>
                </div>
                <div className="ig-video-shop-overlay">
                  <span>Explore Shop <ArrowRight size={14} /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Buttons for Smooth Scrolling */}
        <button
          type="button"
          onClick={handleScrollLeft}
          className="ig-arrow-btn left"
          aria-label="Scroll left"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={handleScrollRight}
          className="ig-arrow-btn right"
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>

      {/* Mobile CTA */}
      <div className="ig-mobile-cta" style={{ marginTop: "24px", textAlign: "center" }}>
        <Link
          href="/shop"
          className="solid-button"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", margin: "0 auto" }}
        >
          <Sparkles size={15} /> Explore All in Shop
        </Link>
      </div>
    </section>
  );
}
