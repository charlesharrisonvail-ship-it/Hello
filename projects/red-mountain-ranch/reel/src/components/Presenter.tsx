import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand } from '../lib/brand';

// An illustrated mountain-town guide (not a likeness of anyone) who points at
// each scene's content. `aims` lists [frame, angleDeg] keyframes for the arm;
// 0deg points right, -90deg points straight up.
const STROKE = '#1b211e';

export const Presenter: React.FC<{ x: number; y: number; scale?: number; aims: [number, number][]; enter?: number }> = ({
  x, y, scale = 1, aims, enter = 6,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = spring({ frame: f - enter, fps, config: { damping: 14, stiffness: 90 } });

  // Arm angle: spring toward the latest keyframe.
  let angle = aims[0][1];
  for (let i = 1; i < aims.length; i++) {
    const [at, to] = aims[i];
    const from = angle;
    const s = spring({ frame: f - at, fps, config: { damping: 12, stiffness: 120 } });
    angle = from + (to - from) * s;
  }
  angle += Math.sin(f / 9) * 2.2; // a little emphasis jab

  const bob = Math.sin(f / 16) * 6;
  const blinkPhase = f % 96;
  const eyeScale = blinkPhase > 90 ? interpolate(blinkPhase, [90, 93, 96], [1, 0.1, 1]) : 1;
  const tilt = Math.sin(f / 30) * 2;

  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 520 * scale, height: 640 * scale,
      transform: `translateY(${(1 - inP) * 700 + bob}px)`,
      filter: 'drop-shadow(12px 14px 0 rgba(0,0,0,0.35))',
    }}>
      <svg viewBox="0 0 520 640" width={520 * scale} height={640 * scale} style={{ overflow: 'visible' }}>
        {/* torso: fleece jacket */}
        <path d="M70 660 C70 470 120 385 240 380 C360 385 410 470 410 660 Z" fill={brand.colors.pine2} stroke={STROKE} strokeWidth="7" />
        <path d="M240 392 L240 660" stroke={brand.colors.bronzeLt} strokeWidth="6" strokeDasharray="10 9" />
        <path d="M180 384 L240 450 L300 384" fill={brand.colors.ivory} stroke={STROKE} strokeWidth="6" strokeLinejoin="round" />
        <path d="M120 470 C150 520 150 590 140 660" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="6" />
        {/* neck */}
        <path d="M212 330 L212 392 L268 392 L268 330 Z" fill="#c98c66" stroke={STROKE} strokeWidth="6" />

        <g transform={`rotate(${tilt} 240 250)`}>
          {/* ears */}
          <circle cx="133" cy="250" r="22" fill="#d99c74" stroke={STROKE} strokeWidth="6" />
          <circle cx="347" cy="250" r="22" fill="#d99c74" stroke={STROKE} strokeWidth="6" />
          {/* head */}
          <ellipse cx="240" cy="245" rx="108" ry="112" fill="#e2a97f" stroke={STROKE} strokeWidth="7" />
          {/* hair under beanie */}
          <path d="M136 220 C138 250 146 262 152 270 L160 214 Z" fill="#5a3a26" stroke={STROKE} strokeWidth="5" strokeLinejoin="round" />
          <path d="M344 220 C342 250 334 262 328 270 L320 214 Z" fill="#5a3a26" stroke={STROKE} strokeWidth="5" strokeLinejoin="round" />
          {/* beanie */}
          <path d="M128 214 C126 110 354 110 352 214 Z" fill={brand.colors.rust} stroke={STROKE} strokeWidth="7" strokeLinejoin="round" />
          <rect x="120" y="190" width="240" height="40" rx="16" fill="#8c3a20" stroke={STROKE} strokeWidth="7" />
          {[150, 180, 210, 240, 270, 300, 330].map((cx) => <line key={cx} x1={cx} y1="196" x2={cx} y2="224" stroke="rgba(0,0,0,0.25)" strokeWidth="5" />)}
          <circle cx="240" cy="104" r="24" fill={brand.colors.ivory} stroke={STROKE} strokeWidth="6" />
          {/* brows */}
          <path d="M184 252 Q202 242 220 250" fill="none" stroke="#3a2618" strokeWidth="8" strokeLinecap="round" />
          <path d="M262 250 Q280 240 298 250" fill="none" stroke="#3a2618" strokeWidth="8" strokeLinecap="round" />
          {/* eyes */}
          <g transform={`translate(0 276) scale(1 ${eyeScale}) translate(0 -276)`}>
            <ellipse cx="203" cy="276" rx="10" ry="13" fill={STROKE} />
            <ellipse cx="279" cy="276" rx="10" ry="13" fill={STROKE} />
            <circle cx="206" cy="271" r="3.5" fill="#fff" />
            <circle cx="282" cy="271" r="3.5" fill="#fff" />
          </g>
          {/* nose, cheeks, smile */}
          <path d="M240 284 Q232 304 244 308" fill="none" stroke="#9c5c3c" strokeWidth="6" strokeLinecap="round" />
          <circle cx="178" cy="306" r="15" fill="#e88a6a" opacity="0.45" />
          <circle cx="304" cy="306" r="15" fill="#e88a6a" opacity="0.45" />
          <path d="M200 318 Q241 352 282 318 Q241 336 200 318 Z" fill="#fff" stroke={STROKE} strokeWidth="6" strokeLinejoin="round" />
        </g>

        {/* raised pointing arm, pivoting at the shoulder */}
        <g transform={`translate(372 438) rotate(${angle})`}>
          <rect x="-34" y="-36" width="250" height="72" rx="36" fill={brand.colors.pine2} stroke={STROKE} strokeWidth="7" />
          <rect x="196" y="-30" width="34" height="60" rx="10" fill={brand.colors.bronzeLt} stroke={STROKE} strokeWidth="6" />
          <g transform="translate(262 0)">
            <ellipse cx="0" cy="6" rx="40" ry="36" fill="#e2a97f" stroke={STROKE} strokeWidth="7" />
            <rect x="10" y="-24" width="92" height="28" rx="14" fill="#e2a97f" stroke={STROKE} strokeWidth="7" />
            <path d="M-6 -22 Q10 -36 26 -20" fill="none" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
            <path d="M-20 16 Q0 30 22 18" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
};
