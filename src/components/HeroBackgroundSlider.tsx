"use client";

import { useEffect, useState } from "react";

const HERO_IMAGES = [
  "/background/pants.jpeg",
  "/media/home/1.jpeg",
  "/media/home/2.jpeg",
  "/media/home/3.jpeg",
  "/media/home/4.jpeg",
  "/media/home/5.jpeg",
  "/media/buttons.jpeg",
  "/media/desk.jpeg",
  "/media/necklace.jpeg",
];

export default function HeroBackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Smooth crossfade transition every 4.8 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-slider-container" aria-hidden="true">
      {HERO_IMAGES.map((src, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={src}
            className={`hero-slider-slide ${isActive ? "is-active" : ""}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        );
      })}
    </div>
  );
}

