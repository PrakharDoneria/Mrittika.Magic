"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";

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
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const posRef = useRef(0);

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

  // Continuous smooth auto-scroll with Apple / iOS WebKit support
  useEffect(() => {
    let animId: number;
    const speed = 0.75; // smooth gentle pixels per frame
    const el = scrollRef.current;
    if (el) {
      posRef.current = el.scrollLeft;
    }

    const step = () => {
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
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animId);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [videoCards]);

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

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
      setTimeout(() => {
        if (scrollRef.current) posRef.current = scrollRef.current.scrollLeft;
      }, 350);
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
      setTimeout(() => {
        if (scrollRef.current) posRef.current = scrollRef.current.scrollLeft;
      }, 350);
    }
  };

  return (
    <section className="ig-section reveal">
      {/* Header with single follow button */}
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
          <InstagramIcon size={18} />
          Follow us
        </a>
      </div>

      {/* Horizontal Video Carousel */}
      <div className="ig-video-showcase-wrap">
        <div
          className="ig-video-scroll-container auto-scroll-strip"
          ref={scrollRef}
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
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
    </section>
  );
}
