import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const MUX_SOURCE = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

// One video layer per mounted page. The overlays retain the warm ivory/gold
// optical palette while allowing the cinematic motion to remain visible.
export const CinematicBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, maxBufferLength: 12 });
      hls.loadSource(MUX_SOURCE);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = MUX_SOURCE;
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <video ref={videoRef} autoPlay loop muted playsInline preload="metadata" className="h-full w-full object-cover opacity-[0.16] mix-blend-multiply" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_6%_34%,rgba(251,227,17,0.25),transparent_72%),radial-gradient(ellipse_42%_58%_at_94%_82%,rgba(230,203,132,0.15),transparent_74%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(132deg,rgba(255,254,244,0.84)_0%,rgba(255,252,232,0.64)_34%,rgba(255,255,255,0.36)_57%,rgba(252,249,240,0.7)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(35deg,transparent_28%,rgba(255,255,255,0.52)_48%,transparent_67%)]" />
    </div>
  );
};
