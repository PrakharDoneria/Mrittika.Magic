"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";

// Explicitly exclude large or unwanted videos: 6, 17, 18, 16, etc.
// Keep light, high-speed videos
const ALLOWED_VIDEOS = [
  "/videos/9.mp4",  // ~1.1MB (fastest)
  "/videos/23.mp4", // ~1.2MB
  "/videos/20.mp4", // ~1.6MB
  "/videos/13.mp4", // ~1.7MB
  "/videos/12.mp4", // ~2.4MB
];

const CAPTIONS = [
  "Studio vibes ✦",
  "Handcrafted with love ✿",
  "Clay & magic ❀",
  "Wearable art ✦",
  "Fresh drops ✿",
];

interface VideoCard {
  src: string;
  rotation: number;
  offsetY: number;
  caption: string;
}

export default function InstagramFeed() {
  const [videoCards, setVideoCards] = useState<VideoCard[]>([]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const posRef = useRef(0);

  // Lazy observe this section so videos only load when near viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" } // preload 250px before scrolling into view
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;

    // Load only 4-5 curated light videos, never 6.mp4, 17.mp4, 18.mp4
    const cards: VideoCard[] = ALLOWED_VIDEOS.map((src, idx) => ({
      src,
      rotation: 0,
      offsetY: 0,
      caption: CAPTIONS[idx % CAPTIONS.length],
    }));

    setVideoCards(cards);
  }, [isIntersecting]);

  // Continuous smooth auto-scroll with Apple / iOS WebKit support
  useEffect(() => {
    if (!videoCards.length) return;

    let animId: number;
    const speed = 0.75;
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
    <section ref={sectionRef} className="ig-section reveal">
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
                  preload="metadata"
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
