import React from 'react';

// Decorative background kept CSS-only so it never competes with product images,
// gestures, or the main thread on slower devices.
export const CinematicBackground: React.FC = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_6%_34%,rgba(251,227,17,0.25),transparent_72%),radial-gradient(ellipse_42%_58%_at_94%_82%,rgba(230,203,132,0.15),transparent_74%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(132deg,rgba(255,254,244,0.84)_0%,rgba(255,252,232,0.64)_34%,rgba(255,255,255,0.36)_57%,rgba(252,249,240,0.7)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(35deg,transparent_28%,rgba(255,255,255,0.52)_48%,transparent_67%)]" />
    </div>
  );
};
