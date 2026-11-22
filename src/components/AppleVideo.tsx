"use client";

import { useEffect, useRef } from "react";

interface AppleVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

/**
 * Robust video component that guarantees autoplay on iOS (iPhone / iPad) and macOS Safari.
 * WebKit requires:
 * 1. muted attribute AND DOM property .muted = true
 * 2. playsinline AND webkit-playsinline attributes
 * 3. explicit programmatic .play() call with catch handler
 * 4. listener for 'canplay' or user interaction if Low Power Mode temporarily delays autoplay
 */
export default function AppleVideo({ src, className, ...rest }: AppleVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct property assignment required by WebKit/iOS Safari
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    let isPlaying = false;

    const tryPlay = () => {
      if (!video) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying = true;
          })
          .catch(() => {
            // If autoplay is delayed by Low Power Mode or Safari battery saver:
            // attempt play as soon as data/canplay fires
            isPlaying = false;
          });
      }
    };

    tryPlay();

    const onCanPlay = () => {
      if (!isPlaying) {
        tryPlay();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        tryPlay();
      }
    };

    video.addEventListener("canplay", onCanPlay, { once: true });
    video.addEventListener("loadeddata", onCanPlay, { once: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Also trigger on first touch/interaction on page if WebKit blocked background autoplay
    const onTouch = () => {
      if (video.paused) {
        tryPlay();
      }
    };
    window.addEventListener("touchstart", onTouch, { once: true, passive: true });
    window.addEventListener("click", onTouch, { once: true, passive: true });

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("click", onTouch);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      controls={false}
      className={className}
      {...rest}
    />
  );
}
