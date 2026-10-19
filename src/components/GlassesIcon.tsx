import React from 'react';

interface GlassesIconProps {
  frameStyle: 'Round' | 'Aviator' | 'Wayfarer' | 'Clubmaster' | 'Hexagonal' | 'Rectangular' | 'Cat-Eye';
  collection: 'full' | 'half' | 'rimless' | 'sunglasses' | 'kids';
  primaryColor: string;
  className?: string;
  showTemples?: boolean;
}

export const GlassesIcon: React.FC<GlassesIconProps> = ({
  frameStyle,
  collection,
  primaryColor,
  className = "w-full h-full",
  showTemples = true
}) => {
  // Determine stroke/fill colors based on collection
  const isSunglasses = collection === 'sunglasses';
  const isRimless = collection === 'rimless';
  const isHalf = collection === 'half';

  // Lens fill color
  const lensFill = isSunglasses 
    ? "rgba(17, 17, 17, 0.85)" 
    : "rgba(226, 232, 240, 0.25)"; // slight clear tint or blue reflection

  // Rimless uses thin gold/silver hinges, frameColor is only on the temple
  const actualFrameColor = isRimless ? "#D4AF37" : primaryColor;
  const frameOpacity = isRimless ? 0.2 : 1;

  // Render SVG paths depending on style
  return (
    <svg 
      viewBox="0 0 200 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Anti-reflective blue light coating filter reflection */}
        <linearGradient id="lensReflect" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3182ce" stopOpacity={isSunglasses ? "0.2" : "0.3"} />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#fbe311" stopOpacity="0.05" />
        </linearGradient>

        {/* Shadow for luxury depth */}
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#261606" floodOpacity="0.1" />
        </filter>
      </defs>

      <g filter="url(#softShadow)">
        {/* Temples (Sides) */}
        {showTemples && (
          <>
            {/* Left temple */}
            <path 
              d="M 15,35 C 10,35 5,45 5,55" 
              fill="none" 
              stroke={actualFrameColor} 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              opacity="0.8"
            />
            <line 
              x1="15" y1="35" x2="45" y2="40" 
              stroke={actualFrameColor} 
              strokeWidth="2" 
              strokeLinecap="round" 
              opacity="0.8"
            />
            
            {/* Right temple */}
            <path 
              d="M 185,35 C 190,35 195,45 195,55" 
              fill="none" 
              stroke={actualFrameColor} 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              opacity="0.8"
            />
            <line 
              x1="185" y1="35" x2="155" y2="40" 
              stroke={actualFrameColor} 
              strokeWidth="2" 
              strokeLinecap="round" 
              opacity="0.8"
            />
          </>
        )}

        {/* Bridge */}
        <path 
          d="M 90,42 Q 100,32 110,42" 
          fill="none" 
          stroke={isRimless ? "#C0C0C0" : actualFrameColor} 
          strokeWidth="3.5" 
          strokeLinecap="round"
        />
        {isSunglasses && frameStyle === 'Aviator' && (
          // Upper brow bar for aviators
          <line 
            x1="55" y1="30" x2="145" y2="30" 
            stroke={actualFrameColor} 
            strokeWidth="2.5"
          />
        )}

        {/* LEFT EYE FRAME & LENS */}
        <g>
          {frameStyle === 'Round' && (
            <>
              <circle cx="65" cy="45" r="23" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : isHalf ? 0 : 4} />
              {isHalf && <path d="M 42,45 A 23,23 0 0,1 88,45" fill="none" stroke={actualFrameColor} strokeWidth="4" />}
              <circle cx="65" cy="45" r="23" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Aviator' && (
            <>
              <path d="M 42,35 C 50,32 75,32 87,35 C 88,45 84,65 65,65 C 45,65 41,45 42,35 Z" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : 3.5} strokeLinejoin="round" />
              <path d="M 42,35 C 50,32 75,32 87,35 C 88,45 84,65 65,65 C 45,65 41,45 42,35 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Wayfarer' && (
            <>
              <path d="M 38,32 C 48,30 75,30 86,34 C 88,46 84,60 62,60 C 44,60 38,44 38,32 Z" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : 5.5} strokeLinejoin="round" />
              {/* Retro metal rivets on corner */}
              {!isRimless && <circle cx="44" cy="36" r="1.5" fill="#C0C0C0" />}
              <path d="M 38,32 C 48,30 75,30 86,34 C 88,46 84,60 62,60 C 44,60 38,44 38,32 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Clubmaster' && (
            <>
              <path d="M 40,32 C 50,29 74,29 86,32 C 88,45 83,58 63,58 C 45,58 40,45 40,32 Z" fill={lensFill} stroke="#C0C0C0" strokeWidth="2" strokeLinejoin="round" />
              {/* Thick plastic upper brow */}
              <path d="M 38,32 Q 63,27 88,32 L 86,38 Q 63,33 40,38 Z" fill={actualFrameColor} />
              {!isRimless && <circle cx="43" cy="35" r="1.2" fill="#FFFFFF" />}
              <path d="M 40,32 C 50,29 74,29 86,32 C 83,45 83,58 63,58 C 45,58 40,45 40,32 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Hexagonal' && (
            <>
              <path d="M 42,35 L 58,30 L 83,35 L 85,51 L 65,59 L 44,51 Z" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : 3.5} strokeLinejoin="round" />
              <path d="M 42,35 L 58,30 L 83,35 L 85,51 L 65,59 L 44,51 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Rectangular' && (
            <>
              <path d="M 40,34 H 86 V 56 H 40 Z" rx="4" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : isHalf ? 0 : 4} />
              {isHalf && <path d="M 40,34 H 86" fill="none" stroke={actualFrameColor} strokeWidth="4.5" />}
              <path d="M 40,34 H 86 V 56 H 40 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Cat-Eye' && (
            <>
              <path d="M 34,28 C 48,32 75,34 86,38 C 84,52 75,62 58,58 C 42,54 36,40 34,28 Z" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : 4.5} strokeLinejoin="round" />
              <path d="M 34,28 C 48,32 75,34 86,38 C 84,52 75,62 58,58 C 42,54 36,40 34,28 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}
        </g>

        {/* RIGHT EYE FRAME & LENS */}
        <g>
          {frameStyle === 'Round' && (
            <>
              <circle cx="135" cy="45" r="23" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : isHalf ? 0 : 4} />
              {isHalf && <path d="M 112,45 A 23,23 0 0,1 158,45" fill="none" stroke={actualFrameColor} strokeWidth="4" />}
              <circle cx="135" cy="45" r="23" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Aviator' && (
            <>
              <path d="M 158,35 C 150,32 125,32 113,35 C 112,45 116,65 135,65 C 155,65 159,45 158,35 Z" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : 3.5} strokeLinejoin="round" />
              <path d="M 158,35 C 150,32 125,32 113,35 C 112,45 116,65 135,65 C 155,65 159,45 158,35 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Wayfarer' && (
            <>
              <path d="M 162,32 C 152,30 125,30 114,34 C 112,46 116,60 138,60 C 156,60 162,44 162,32 Z" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : 5.5} strokeLinejoin="round" />
              {!isRimless && <circle cx="156" cy="36" r="1.5" fill="#C0C0C0" />}
              <path d="M 162,32 C 152,30 125,30 114,34 C 112,46 116,60 138,60 C 156,60 162,44 162,32 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Clubmaster' && (
            <>
              <path d="M 160,32 C 150,29 126,29 114,32 C 112,45 117,58 137,58 C 155,58 160,45 160,32 Z" fill={lensFill} stroke="#C0C0C0" strokeWidth="2" strokeLinejoin="round" />
              {/* Thick plastic upper brow */}
              <path d="M 162,32 Q 137,27 112,32 L 114,38 Q 137,33 160,38 Z" fill={actualFrameColor} />
              {!isRimless && <circle cx="157" cy="35" r="1.2" fill="#FFFFFF" />}
              <path d="M 160,32 C 150,29 126,29 114,32 C 117,45 117,58 137,58 C 155,58 160,45 160,32 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Hexagonal' && (
            <>
              <path d="M 158,35 L 142,30 L 117,35 L 115,51 L 135,59 L 156,51 Z" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : 3.5} strokeLinejoin="round" />
              <path d="M 158,35 L 142,30 L 117,35 L 115,51 L 135,59 L 156,51 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Rectangular' && (
            <>
              <path d="M 160,34 H 114 V 56 H 160 Z" rx="4" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : isHalf ? 0 : 4} />
              {isHalf && <path d="M 160,34 H 114" fill="none" stroke={actualFrameColor} strokeWidth="4.5" />}
              <path d="M 160,34 H 114 V 56 H 160 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}

          {frameStyle === 'Cat-Eye' && (
            <>
              <path d="M 166,28 C 152,32 125,34 114,38 C 116,52 125,62 142,58 C 158,54 164,40 166,28 Z" fill={lensFill} stroke={isRimless ? "none" : actualFrameColor} strokeWidth={isRimless ? 0 : 4.5} strokeLinejoin="round" />
              <path d="M 166,28 C 152,32 125,34 114,38 C 116,52 125,62 142,58 C 158,54 164,40 166,28 Z" fill="url(#lensReflect)" pointerEvents="none" />
            </>
          )}
        </g>

        {/* Nose Pads (comfort support) */}
        {!isRimless && (
          <>
            <path d="M 80,48 Q 83,54 80,58" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
            <path d="M 120,48 Q 117,54 120,58" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
          </>
        )}
      </g>
    </svg>
  );
};
