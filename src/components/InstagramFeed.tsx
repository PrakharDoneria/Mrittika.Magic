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

  return (
    <section className="ig-section reveal">
      {/* Header */}
      <div className="ig-header">
        <div className="ig-header-left">
          <p className="eyebrow">as seen on instagram</p>
          <h2>Follow along <i>@mrittika.magic</i></h2>
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

      {/* Embed grid */}
      <div className="ig-grid">
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
    </section>
  );
}
