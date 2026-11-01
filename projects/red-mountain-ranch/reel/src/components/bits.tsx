import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { brand } from '../lib/brand';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const useIn = (delay: number, dur = 14) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
};

export const usePop = (delay: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 11, stiffness: 160, mass: 0.7 } });
};

/** Halftone dots + grain + vignette: the texture layer on every scene. */
export const Texture: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const f = useCurrentFrame();
  const dot = dark ? 'rgba(245,240,230,0.07)' : 'rgba(27,33,30,0.09)';
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(${dot} 1.6px, transparent 1.9px)`,
        backgroundSize: '9px 9px',
        backgroundPosition: `${(f * 0.15) % 9}px 0`,
        maskImage: 'linear-gradient(160deg, black 0%, transparent 55%, black 100%)',
        WebkitMaskImage: 'linear-gradient(160deg, black 0%, transparent 55%, black 100%)',
      }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: dark ? 0.16 : 0.1, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(f / 2) % 8} /></filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: `inset 0 0 220px ${dark ? 'rgba(0,0,0,0.55)' : 'rgba(27,33,30,0.18)'}` }} />
    </>
  );
};

type Word = { t: string; accent?: boolean };

/** Big headline that builds word by word; accent words switch to italic serif. */
export const Headline: React.FC<{ lines: Word[][]; start?: number; color?: string; accent?: string; size?: number; top: number; left?: number }> = ({
  lines, start = 0, color = brand.colors.ink, accent = brand.colors.rust, size = 108, top, left = 64,
}) => {
  const f = useCurrentFrame();
  let i = 0;
  return (
    <div style={{ position: 'absolute', top, left, right: 170, lineHeight: 0.98 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: 'flex', flexWrap: 'wrap', columnGap: size * 0.24 }}>
          {line.map((w) => {
            const d = start + i++ * 4;
            const p = interpolate(f, [d, d + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
            return (
              <span key={w.t + d} style={{
                display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 34}px)`,
                fontFamily: w.accent ? brand.fonts.display : brand.fonts.ui,
                fontStyle: w.accent ? 'italic' : 'normal',
                fontWeight: w.accent ? 500 : 800,
                fontSize: w.accent ? size * 1.12 : size,
                letterSpacing: w.accent ? '-0.01em' : '-0.035em',
                color: w.accent ? accent : color,
              }}>{w.t}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Floating proof chip: small rotated pill that pops in. */
export const Chip: React.FC<{ text: string; x: number; y: number; rot?: number; delay: number; tone?: 'dark' | 'rust' | 'light' | 'bronze' }> = ({
  text, x, y, rot = -3, delay, tone = 'dark',
}) => {
  const p = usePop(delay);
  const f = useCurrentFrame();
  const bob = Math.sin((f + delay * 7) / 22) * 4;
  const tones = {
    dark: { bg: brand.colors.ink, fg: brand.colors.ivory, bd: 'rgba(245,240,230,0.2)' },
    rust: { bg: brand.colors.rust, fg: '#fff3ea', bd: 'rgba(0,0,0,0.25)' },
    light: { bg: brand.colors.ivory, fg: brand.colors.ink, bd: 'rgba(27,33,30,0.2)' },
    bronze: { bg: brand.colors.bronzeLt, fg: brand.colors.pine, bd: 'rgba(0,0,0,0.2)' },
  }[tone];
  return (
    <div style={{
      position: 'absolute', left: x, top: y + bob,
      transform: `rotate(${rot}deg) scale(${p})`, transformOrigin: 'left center', opacity: Math.min(1, p * 1.4),
      background: tones.bg, color: tones.fg, border: `2px solid ${tones.bd}`,
      borderRadius: 999, padding: '12px 26px', whiteSpace: 'nowrap',
      fontFamily: brand.fonts.mono, fontSize: 30, fontWeight: 500,
      boxShadow: '6px 8px 0 rgba(0,0,0,0.28)',
    }}>{text}</div>
  );
};

/** Diagram tile: an icon in a rounded square with a hard drop shadow. */
export const Tile: React.FC<{ x: number; y: number; size?: number; bg: string; delay: number; label: string; labelColor?: string; children: React.ReactNode }> = ({
  x, y, size = 200, bg, delay, label, labelColor = brand.colors.ink, children,
}) => {
  const p = usePop(delay);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size, textAlign: 'center' }}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.22, background: bg,
        border: '4px solid rgba(0,0,0,0.75)', boxShadow: '10px 12px 0 rgba(0,0,0,0.75)',
        display: 'grid', placeItems: 'center', transform: `scale(${p}) rotate(${(1 - p) * -12}deg)`,
      }}>{children}</div>
      <div style={{ marginTop: 26, fontFamily: brand.fonts.ui, fontWeight: 700, fontSize: 30, color: labelColor, opacity: p, letterSpacing: '-0.01em' }}>{label}</div>
    </div>
  );
};

/** Arrow that draws between tiles, with a mono label pill riding on it. */
export const Arrow: React.FC<{ x: number; y: number; len: number; delay: number; label?: string; color?: string; vertical?: boolean }> = ({
  x, y, len, delay, label, color = brand.colors.ink, vertical,
}) => {
  const p = useIn(delay, 14);
  const lp = usePop(delay + 8);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: vertical ? 40 : len, height: vertical ? len : 40 }}>
      <svg width={vertical ? 40 : len} height={vertical ? len : 40} style={{ overflow: 'visible' }}>
        {vertical ? (
          <>
            <line x1="20" y1="0" x2="20" y2={(len - 14) * p} stroke={color} strokeWidth="5" strokeLinecap="round" />
            {p > 0.9 && <path d={`M8 ${len - 22} L20 ${len - 4} L32 ${len - 22}`} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />}
          </>
        ) : (
          <>
            <line x1="0" y1="20" x2={(len - 14) * p} y2="20" stroke={color} strokeWidth="5" strokeLinecap="round" />
            {p > 0.9 && <path d={`M${len - 22} 8 L${len - 4} 20 L${len - 22} 32`} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />}
          </>
        )}
      </svg>
      {label && (
        <div style={{
          position: 'absolute', left: vertical ? 54 : '50%', top: vertical ? '42%' : -50,
          transform: `${vertical ? '' : 'translateX(-50%)'} scale(${lp})`,
          background: brand.colors.ink, color: brand.colors.ivory, borderRadius: 10, padding: '6px 16px',
          fontFamily: brand.fonts.mono, fontSize: 26, whiteSpace: 'nowrap', boxShadow: '4px 5px 0 rgba(0,0,0,0.3)',
        }}>{label}</div>
      )}
    </div>
  );
};

/** Dark terminal-style card whose lines type on. */
export const CodeCard: React.FC<{ x: number; y: number; w: number; title: string; lines: { k?: string; v: string; c?: string }[]; delay: number; cps?: number }> = ({
  x, y, w, title, lines, delay, cps = 1.6,
}) => {
  const f = useCurrentFrame();
  const p = usePop(delay);
  let budget = Math.max(0, (f - delay - 8) * cps);
  const caret = Math.floor(f / 8) % 2 === 0;
  let caretPlaced = false;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, background: '#0d1210', borderRadius: 22,
      border: '3px solid rgba(245,240,230,0.12)', boxShadow: '14px 16px 0 rgba(0,0,0,0.45)',
      transform: `translateY(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 1.3), overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '2px solid rgba(245,240,230,0.08)' }}>
        {['#a34a2c', '#d3ad78', '#5f7f6f'].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 99, background: c }} />)}
        <span style={{ marginLeft: 14, fontFamily: brand.fonts.mono, fontSize: 24, color: 'rgba(245,240,230,0.55)' }}>{title}</span>
      </div>
      <div style={{ padding: '22px 28px 28px', fontFamily: brand.fonts.mono, fontSize: 31, lineHeight: 1.6 }}>
        {lines.map((l, i) => {
          const full = (l.k ? l.k + ' ' : '') + l.v;
          const shown = Math.min(full.length, Math.floor(budget));
          budget -= full.length;
          const kShown = l.k ? full.slice(0, Math.min(shown, l.k.length + 1)) : '';
          const vShown = full.slice(l.k ? l.k.length + 1 : 0, shown);
          const showCaret = !caretPlaced && shown < full.length;
          if (showCaret) caretPlaced = true;
          return (
            <div key={i} style={{ minHeight: 50, whiteSpace: 'pre' }}>
              <span style={{ color: brand.colors.rust }}>{kShown}</span>
              <span style={{ color: l.c ?? 'rgba(245,240,230,0.88)' }}>{vShown}</span>
              {showCaret && shown > 0 && caret && <span style={{ color: brand.colors.bronzeLt }}>▍</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Burned-in captions: one cue at a time, words light up as they are "spoken". */
export const Captions: React.FC<{ cues: { from: number; to: number; text: string }[] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const cue = cues.find((c) => f >= c.from && f < c.to);
  if (!cue) return null;
  const words = cue.text.split(' ');
  const span = cue.to - cue.from - 10;
  const inP = interpolate(f, [cue.from, cue.from + 6], [0, 1], clamp);
  return (
    <div style={{
      position: 'absolute', left: 64, right: 190, top: 1300, display: 'flex', flexWrap: 'wrap', columnGap: 14, rowGap: 4,
      opacity: inP, transform: `translateY(${(1 - inP) * 12}px)`,
    }}>
      {words.map((w, i) => {
        const lit = f - cue.from >= (i / words.length) * span * 0.8;
        return (
          <span key={i} style={{
            fontFamily: brand.fonts.ui, fontWeight: 800, fontSize: 46, letterSpacing: '-0.01em',
            color: lit ? '#ffffff' : 'rgba(255,255,255,0.55)',
            background: lit ? 'rgba(13,18,16,0.92)' : 'rgba(13,18,16,0.7)', padding: '2px 12px', borderRadius: 8,
            boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
          }}>{w}</span>
        );
      })}
    </div>
  );
};
