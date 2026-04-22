import { useEffect, useRef } from "react";

interface HlsVideoProps {
  src: string;
  className?: string;
}

export function HlsVideo({ src, className }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If native HLS is supported (Safari), just set src directly
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    // Otherwise use hls.js
    let hls: import("hls.js").default | null = null;

    import("hls.js").then((mod) => {
      const Hls = mod.default;
      if (!Hls.isSupported()) return;
      hls = new Hls({
        autoStartLoad: true,
        startLevel: -1,
        lowLatencyMode: false,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    });

    return () => {
      hls?.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className={className}
      aria-hidden="true"
    />
  );
}
