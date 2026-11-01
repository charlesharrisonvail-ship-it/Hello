import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand } from '../lib/brand';

// AiRE, the course's AI instructor, drawn as a friendly screen-faced robot that
// points at each scene. It is labeled as AI on screen. `aims` lists
// [frame, angleDeg] keyframes for the arm; 0deg points right, -90deg up.
const STROKE = '#020409';
const C = brand.colors;

export const AiRE: React.FC<{ x: number; y: number; scale?: number; aims: [number, number][]; enter?: number }> = ({
  x, y, scale = 1, aims, enter = 6,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = spring({ frame: f - enter, fps, config: { damping: 14, stiffness: 90 } });

  let angle = aims[0][1];
  for (let i = 1; i < aims.length; i++) {
    const [at, to] = aims[i];
    const from = angle;
    const s = spring({ frame: f - at, fps, config: { damping: 12, stiffness: 120 } });
    angle = from + (to - from) * s;
  }
  angle += Math.sin(f / 9) * 2.2;

  const bob = Math.sin(f / 16) * 6;
  const blinkPhase = f % 96;
  const eye = blinkPhase > 90 ? interpolate(blinkPhase, [90, 93, 96], [1, 0.1, 1]) : 1;
  const glow = 0.6 + Math.sin(f / 7) * 0.4;
  const tilt = Math.sin(f / 30) * 2;

  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 520 * scale, height: 640 * scale,
      transform: `translateY(${(1 - inP) * 700 + bob}px)`,
      filter: 'drop-shadow(12px 14px 0 rgba(0,0,0,0.55))',
    }}>
      <svg viewBox="0 0 520 640" width={520 * scale} height={640 * scale} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="aireBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1b2a44" />
            <stop offset="1" stopColor="#0d1524" />
          </linearGradient>
          <linearGradient id="aireGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={C.bronze} />
            <stop offset="0.5" stopColor={C.river} />
            <stop offset="1" stopColor={C.rust} />
          </linearGradient>
        </defs>
        {/* body */}
        <path d="M80 660 C80 480 130 400 240 396 C350 400 400 480 400 660 Z" fill="url(#aireBody)" stroke={STROKE} strokeWidth="7" />
        <rect x="150" y="470" width="180" height="54" rx="27" fill="url(#aireGrad)" stroke={STROKE} strokeWidth="5" />
        <text x="240" y="507" textAnchor="middle" fontFamily="Archivo" fontWeight="900" fontSize="28" fill="#04070d">AiRE · AI</text>
        {/* neck */}
        <rect x="214" y="352" width="52" height="50" rx="10" fill="#2a3b5c" stroke={STROKE} strokeWidth="6" />

        <g transform={`rotate(${tilt} 240 240)`}>
          {/* antenna */}
          <line x1="240" y1="118" x2="240" y2="74" stroke={STROKE} strokeWidth="7" />
          <circle cx="240" cy="64" r="18" fill={C.rust} stroke={STROKE} strokeWidth="6" opacity={0.75 + glow * 0.25} />
          <circle cx="240" cy="64" r={30 + glow * 8} fill={C.rust} opacity={0.18 * glow} />
          {/* ears */}
          <rect x="104" y="196" width="34" height="80" rx="14" fill={C.river} stroke={STROKE} strokeWidth="6" />
          <rect x="342" y="196" width="34" height="80" rx="14" fill={C.river} stroke={STROKE} strokeWidth="6" />
          {/* head */}
          <rect x="128" y="116" width="224" height="240" rx="64" fill="#e8eef6" stroke={STROKE} strokeWidth="7" />
          {/* screen face */}
          <rect x="152" y="150" width="176" height="164" rx="44" fill="#06101f" stroke={STROKE} strokeWidth="5" />
          <g transform={`translate(0 222) scale(1 ${eye}) translate(0 -222)`}>
            <ellipse cx="206" cy="222" rx="16" ry="20" fill={C.bronze} />
            <ellipse cx="274" cy="222" rx="16" ry="20" fill={C.bronze} />
            <circle cx="211" cy="214" r="5" fill="#fff" />
            <circle cx="279" cy="214" r="5" fill="#fff" />
          </g>
          <path d="M210 272 Q240 296 270 272" fill="none" stroke={C.bronze} strokeWidth="8" strokeLinecap="round" />
          <circle cx="178" cy="262" r="10" fill={C.rust} opacity="0.45" />
          <circle cx="302" cy="262" r="10" fill={C.rust} opacity="0.45" />
        </g>

        {/* pointing arm, pivoting at the shoulder */}
        <g transform={`translate(372 446) rotate(${angle})`}>
          <rect x="-34" y="-34" width="246" height="68" rx="34" fill="#1b2a44" stroke={STROKE} strokeWidth="7" />
          <rect x="190" y="-28" width="30" height="56" rx="10" fill="url(#aireGrad)" stroke={STROKE} strokeWidth="5" />
          <g transform="translate(254 0)">
            <ellipse cx="0" cy="6" rx="38" ry="34" fill="#e8eef6" stroke={STROKE} strokeWidth="7" />
            <rect x="10" y="-22" width="88" height="26" rx="13" fill="#e8eef6" stroke={STROKE} strokeWidth="7" />
          </g>
        </g>
      </svg>
    </div>
  );
};
