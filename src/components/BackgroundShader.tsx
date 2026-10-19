import React from 'react';

type ShaderVariant =
  | 'gold-radial'
  | 'cream-flow'
  | 'gold-mesh'
  | 'translucent-waves'
  | 'dark-brown-glow'
  | 'soft-white-fog'
  | 'warm-sunlight'
  | 'dark-ambient';

interface BackgroundShaderProps {
  variant: ShaderVariant;
  opacity?: number;
}

// A single static gradient costs one paint, unlike the old set of animated,
// blurred Motion elements. The shared AmbientBackground supplies the only
// intentional page-level movement.
const shaderBackgrounds: Record<ShaderVariant, string> = {
  'gold-radial': 'radial-gradient(ellipse 72% 62% at 12% 10%, rgba(251,227,17,.07), transparent 70%)',
  'cream-flow': 'radial-gradient(ellipse 72% 62% at 15% 15%, rgba(253,242,233,.18), transparent 72%)',
  'gold-mesh': 'radial-gradient(ellipse 75% 65% at 18% 18%, rgba(251,227,17,.055), transparent 70%)',
  'translucent-waves': 'radial-gradient(ellipse 75% 65% at 12% 12%, rgba(251,227,17,.05), transparent 72%)',
  'dark-brown-glow': 'radial-gradient(ellipse 72% 60% at 15% 20%, rgba(251,227,17,.06), transparent 70%)',
  'soft-white-fog': 'radial-gradient(ellipse 72% 60% at 20% 15%, rgba(255,255,255,.12), transparent 72%)',
  'warm-sunlight': 'radial-gradient(ellipse 74% 64% at 12% 12%, rgba(255,200,100,.06), transparent 70%)',
  'dark-ambient': 'radial-gradient(ellipse 70% 60% at 20% 20%, rgba(251,227,17,.04), transparent 70%)',
};

export const BackgroundShader: React.FC<BackgroundShaderProps> = ({ variant, opacity = 1 }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden"
    style={{ opacity, background: shaderBackgrounds[variant] }}
  />
);
