"use client";

import { useEffect, useRef } from "react";
import { Camera } from "lucide-react";

const POSTS = [
  "https://www.instagram.com/reel/DZ2mQEDMsmI/",
  "https://www.instagram.com/reel/DZVTSkQsmM7/",
  "https://www.instagram.com/reel/DXMz7CnjBg2/",
  "https://www.instagram.com/p/DcQmEQtkmQF/",
];

declare global {
  interface Window {
    instgrm?: { Embeds: { process(): void } };
  }
}

export default function InstagramFeed() {
  const loaded = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loaded.current) {
      // Script already injected — just re-process embeds
      window.instgrm?.Embeds.process();
      return;
    }
    loaded.current = true;

    if (document.getElementById("ig-embed-script")) {
      window.instgrm?.Embeds.process();
      return;
    }

    const script = document.createElement("script");
    script.id = "ig-embed-script";
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  return (
    <section className="ig-section reveal">
      {/* Header */}
      <div className="ig-header">
        <div className="ig-header-left">
          <p className="eyebrow">Connect with us on instagram</p>
          <h2>Follow along <i>@mrittika.magic</i></h2>
          <p className="ig-subtitle" style={{ fontSize: "13px", opacity: 0.8, margin: "4px 0 0" }}>
            Get closer to the craft, the maker, and the magic.
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

      {/* Embed carousel */}
      <div className="ig-carousel-wrapper" style={{ position: "relative" }}>
        <div className="ig-grid" ref={scrollRef}>
          {POSTS.map((url) => (
            <div key={url} className="ig-embed-wrap">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={`${url}?utm_source=ig_embed&utm_campaign=loading`}
                data-instgrm-version="14"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="ig-scroll-btn"
          onClick={handleNext}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <div className="ig-mobile-cta" style={{ marginTop: "20px", textAlign: "center" }}>
        <a
          href="https://www.instagram.com/mrittika.magic/"
          target="_blank"
          rel="noreferrer"
          className="solid-button ig-visit-pill"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          <Camera size={15} /> Visit Instagram
        </a>
      </div>
    </section>
  );
}
