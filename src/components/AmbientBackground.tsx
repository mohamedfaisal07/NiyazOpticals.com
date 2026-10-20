import React from 'react';

// This canvas is deliberately mounted once at the application root. Its CSS animations
// therefore continue uninterrupted as page content changes above it.
export const AmbientBackground: React.FC = () => {
  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-stage">
        <div className="ambient-grain" />
        <div className="ambient-blob ambient-blob--gold" />
        <div className="ambient-blob ambient-blob--ivory" />
        <div className="ambient-blob ambient-blob--cream" />
        <div className="ambient-blob ambient-blob--pearl" />
      </div>
    </div>
  );
};
