"use client";

import { useEffect, useState } from "react";

export const HERO_IMAGES = [
  "/background/banner.png",
  "/media/home/1.jpeg",
  "/media/home/2.jpeg",
  "/media/home/3.jpeg",
  "/media/home/4.jpeg",
  "/media/home/5.jpeg",
];

export default function HeroBackgroundSlider({
  onImageChange,
}: {
  onImageChange?: (currentImage: string) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    onImageChange?.(HERO_IMAGES[currentIndex]);
  }, [currentIndex, onImageChange]);

  useEffect(() => {
    // Smooth crossfade transition every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
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
