"use client";

import { useState } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({
  images = [],
  title = "Product",
}: {
  images: string[];
  title?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="product-gallery-empty">
        <ShoppingBag size={48} />
      </div>
    );
  }

  const activeIndex = Math.min(selectedIndex, images.length - 1);

  return (
    <div className="product-interactive-gallery">
      {/* Main active image viewport */}
      <div className="product-main-view">
        <img
          src={images[activeIndex]}
          alt={`${title} - view ${activeIndex + 1}`}
          key={images[activeIndex]}
          className="product-main-image"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-nav-btn prev"
              aria-label="Previous image"
              onClick={() =>
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
              }
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="gallery-nav-btn next"
              aria-label="Next image"
              onClick={() =>
                setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
              }
            >
              <ChevronRight size={20} />
            </button>
            <span className="gallery-counter">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Flipkart-style thumbnail strip below */}
      {images.length > 1 && (
        <div className="product-thumb-strip" role="tablist" aria-label="Product thumbnails">
          {images.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                type="button"
                role="tab"
                key={img + idx}
                aria-selected={isSelected}
                aria-label={`View image ${idx + 1}`}
                onClick={() => setSelectedIndex(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`product-thumb-btn ${isSelected ? "is-active" : ""}`}
              >
                <img src={img} alt="" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
