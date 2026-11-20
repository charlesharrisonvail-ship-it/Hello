import React from 'react';
import {
  AbsoluteFill, Audio, Composition, Easing, OffthreadVideo, Sequence, interpolate, registerRoot,
  spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadDM} from '@remotion/google-fonts/DMSans';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import words from './words2.json';

const display = loadCormorant('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const displayI = loadCormorant('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;
const ui = loadDM('normal', {weights: ['700', '900'], subsets: ['latin']}).fontFamily;
const stamp = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;

const c = {
  navy: '#0a1628', navyMid: '#0f1f3d', navyLight: '#172847', gold: '#c9a84c',
  goldBright: '#e8c66a', goldDim: '#8a6f2e', cream: '#f5f0e8', muted: '#7a8ba8',
};
const FPS = 30;
const TOTAL = 26.6;
const f = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const out3 = Easing.out(Easing.cubic);

// Seeded PRNG for deterministic scatter.
const rnd = (i: number) => {
  let t = (i + 1) * 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// ── key moments (seconds, after 1.1× tempo) ──
const T = {
  roll: 0.25, slam43: 1.53, year: 3.2,
  rent: 4.0, poof: 6.93, gone: 7.45,
  own: 8.3, median: 8.89, year1: 10.95, eqStart: 12.0, pocket: 15.38,
  honest: 16.4, yep: 18.58,
  yard: 19.4, yardWord: 20.07, olaf: 21.47,
  end: 22.8,
};

// ── camera shake: only on the 3 big slams ──
const SLAMS = [T.slam43, T.gone, T.yardWord];
const useShake = () => {
  const frame = useCurrentFrame();
  let x = 0, y = 0;
  for (const s of SLAMS) {
    const d = frame - f(s);
    if (d >= 0 && d < 10) {
      const k = (1 - d / 10) * 14;
      x += Math.sin(d * 2.7) * k;
      y += Math.cos(d * 3.3) * k * 0.6;
    }
  }
  return `translate(${x}px, ${y}px)`;
};

// Whip transition: content slides out left / in from right with blur.
const Whip: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const a = f(from), b = f(to), W = 7;
  const pin = interpolate(frame, [a, a + W], [1, 0], {...clamp, easing: out3});
  const pout = interpolate(frame, [b - W, b], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  if (frame < a || frame >= b) return null;
  const x = pin * 1080 - pout * 1080;
  const blur = Math.sin(Math.PI * Math.max(pin, pout)) * 18;
  return <AbsoluteFill style={{transform: `translateX(${x}px)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined}}>{children}</AbsoluteFill>;
};

const NavyBg: React.FC<{glow?: string}> = ({glow = c.navyLight}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background: `radial-gradient(110% 70% at ${50 + Math.sin(frame / 40) * 12}% 30%, ${glow} 0%, ${c.navyMid} 45%, ${c.navy} 100%)`}} />;
};

const Slam: React.FC<{at: number; children: React.ReactNode; from?: number; style?: React.CSSProperties}> = ({at, children, from = 2.2, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - f(at), fps, config: {damping: 14, stiffness: 220, mass: 0.7}});
  if (frame < f(at)) return null;
  const s = interpolate(p, [0, 1], [from, 1]);
  return <div style={{transform: `scale(${s})`, opacity: Math.min(1, p * 3), ...style}}>{children}</div>;
};

const Pop: React.FC<{at: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties}> = ({at, children, dy = 60, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - f(at), fps, config: {damping: 200, stiffness: 300}});
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style}}>{children}</div>;
};

// Counting number with tabular figures.
const Count: React.FC<{from: number; to: number; start: number; end: number; prefix?: string; style?: React.CSSProperties; ease?: (t: number) => number}> =
  ({from, to, start, end, prefix = '$', style, ease = out3}) => {
    const frame = useCurrentFrame();
    const v = interpolate(frame, [f(start), f(end)], [from, to], {...clamp, easing: ease});
    return <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>{prefix}{Math.round(v).toLocaleString('en-US')}</span>;
  };

const Stamp: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 52, color = c.gold}) => (
  <div style={{fontFamily: stamp, fontSize: size, letterSpacing: '0.18em', color}}>{children}</div>
);

// ── Scene 1: hook over Olaf ──
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, f(4.1)], [1.0, 1.28], {...clamp, easing: Easing.inOut(Easing.quad)});
  const flash = frame < f(T.slam43) ? 0 : interpolate(frame, [f(T.slam43), f(T.slam43) + 5], [0.55, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 45%'}}>
        <OffthreadVideo src={staticFile('olaf.mp4')} muted />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.35) 40%, rgba(10,22,40,0.2) 60%, rgba(10,22,40,0.8) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 270, textAlign: 'center'}}>
        <Pop at={0.05}><Stamp size={58} color={c.cream}>YOU'RE HANDING YOUR LANDLORD</Stamp></Pop>
        <div style={{fontFamily: display, fontWeight: 700, fontSize: 230, color: c.goldBright, lineHeight: 1, marginTop: 10, textShadow: '0 8px 40px rgba(0,0,0,0.5)'}}>
          {frame < f(T.slam43)
            ? <Count from={0} to={43200} start={T.roll} end={T.slam43} ease={Easing.in(Easing.quad)} />
            : <Slam at={T.slam43} from={1.35}>$43,200</Slam>}
        </div>
        <Slam at={T.year} from={1.8}><Stamp size={66} color={c.cream}>EVERY. SINGLE. YEAR.</Stamp></Slam>
      </AbsoluteFill>
      <AbsoluteFill style={{background: c.cream, opacity: flash}} />
    </AbsoluteFill>
  );
};

// ── Scene 2+3: months deal in, then POOF ──
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
// Accelerating deal: gaps shrink like a dealer speeding up.
const dealAt = (i: number) => T.rent + 0.25 + 2.35 * (1 - Math.pow(1 - i / 11, 1.8));
const Rent: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const boom = frame - f(T.poof);
  const landed = MONTHS.filter((_, i) => frame >= f(dealAt(i))).length;
  return (
    <AbsoluteFill>
      <NavyBg />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 250}}>
        <Pop at={T.rent}><Stamp>3-BEDROOM · EAGLE, CO</Stamp></Pop>
        <Pop at={T.rent + 0.05}>
          <div style={{fontFamily: display, fontSize: 150, color: c.cream, lineHeight: 1.05, opacity: boom > 0 ? Math.max(0, 1 - boom / 6) : 1}}>
            $3,600<span style={{fontSize: 64, color: c.muted}}>/mo</span>
          </div>
        </Pop>
      </AbsoluteFill>
      {/* month tiles */}
      <AbsoluteFill style={{top: 560}}>
        {MONTHS.map((m, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          const x0 = 105 + col * 300, y0 = row * 175;
          const p = spring({frame: frame - f(dealAt(i)), fps, config: {damping: 18, stiffness: 260}});
          // deal from bottom-right like cards off a deck
          let x = interpolate(p, [0, 1], [900, x0]);
          let y = interpolate(p, [0, 1], [1100, y0]);
          let rot = interpolate(p, [0, 1], [25 - rnd(i) * 50, 0]);
          let op = p > 0.01 ? 1 : 0;
          if (boom >= 0) {
            const a = rnd(i + 40) * Math.PI * 2;
            const v = 30 + rnd(i + 80) * 40;
            x += Math.cos(a) * v * boom; y += Math.sin(a) * v * boom - 0; rot += (rnd(i + 9) - 0.5) * 30 * boom;
            op = Math.max(0, 1 - boom / 12);
          }
          return (
            <div key={m} style={{position: 'absolute', left: x, top: y, width: 270, height: 150, transform: `rotate(${rot}deg)`, opacity: op,
              background: `linear-gradient(160deg, ${c.navyLight}, ${c.navyMid})`, border: `2px solid ${c.goldDim}`, borderRadius: 18,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(0,0,0,0.4)'}}>
              <div style={{fontFamily: stamp, fontSize: 40, letterSpacing: '0.2em', color: c.muted}}>{m}</div>
              <div style={{fontFamily: ui, fontWeight: 900, fontSize: 44, color: c.goldBright}}>−$3,600</div>
            </div>
          );
        })}
      </AbsoluteFill>
      {/* running total */}
      <AbsoluteFill style={{top: 1255, alignItems: 'center'}}>
        {boom < 0 && (
          <div style={{fontFamily: ui, fontWeight: 900, fontSize: 70, color: c.cream}}>
            <span style={{color: c.muted, fontSize: 44, marginRight: 16}}>TOTAL</span>
            <span style={{fontVariantNumeric: 'tabular-nums'}}>${(landed * 3600).toLocaleString('en-US')}</span>
          </div>
        )}
      </AbsoluteFill>
      {/* POOF / GONE */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        {boom >= 0 && frame < f(T.gone) && (
          <Slam at={T.poof} from={0.4}><div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: 200, color: c.goldBright}}>Poof.</div></Slam>
        )}
        <Slam at={T.gone} from={2.6}><div style={{fontFamily: stamp, fontSize: 380, color: c.cream, letterSpacing: '0.04em', lineHeight: 1}}>GONE.</div></Slam>
        {frame >= f(T.gone) && <Pop at={T.gone + 0.3}><Stamp size={46} color={c.muted}>$43,200 · NOTHING BACK</Stamp></Pop>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 4: owning ──
const HOUSE = 'M 60 300 L 60 150 L 220 30 L 380 150 L 380 300 Z M 170 300 L 170 210 L 270 210 L 270 300 M 100 175 L 150 175 L 150 220 L 100 220 Z M 290 175 L 340 175 L 340 220 L 290 220 Z';
const Own: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [f(T.own), f(T.own + 1.0)], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const fill = interpolate(frame, [f(T.eqStart), f(T.pocket)], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const drift = interpolate(frame, [f(T.own), f(T.honest)], [1, 1.06], clamp);
  const glow = interpolate(frame, [f(T.pocket), f(T.pocket) + 8, f(T.pocket) + 30], [0, 1, 0.35], clamp);
  return (
    <AbsoluteFill>
      <NavyBg glow="#1d2f52" />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 250, transform: `scale(${drift})`}}>
        <Pop at={T.own}><Stamp>OWN IT · MEDIAN EAGLE TOWNHOME</Stamp></Pop>
        <svg width={440} height={330} viewBox="0 0 440 330" style={{marginTop: 30}}>
          <path d={HOUSE} fill="none" stroke={c.goldBright} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
        </svg>
        <Pop at={T.median}>
          <div style={{fontFamily: display, fontSize: 150, color: c.cream, lineHeight: 1}}>
            <Count from={500000} to={702200} start={T.median} end={T.median + 0.8} />
          </div>
        </Pop>
        <Pop at={T.median + 0.3}><div style={{fontFamily: ui, fontWeight: 700, fontSize: 40, color: c.muted}}>5% down · 7.28% · 30-yr fixed</div></Pop>
        <div style={{height: 70}} />
        <Slam at={T.year1} from={1.6}><Stamp size={70} color={c.goldBright}>YEAR ONE</Stamp></Slam>
        {/* equity bar */}
        <Pop at={T.eqStart - 0.2}>
          <div style={{width: 860, height: 96, borderRadius: 48, border: `3px solid ${c.gold}`, marginTop: 20, overflow: 'hidden', position: 'relative',
            boxShadow: `0 0 ${60 * glow}px ${c.goldBright}`}}>
            <div style={{position: 'absolute', inset: 0, width: `${fill * 100}%`, background: `linear-gradient(90deg, ${c.goldDim}, ${c.goldBright})`}} />
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ui, fontWeight: 900, fontSize: 56, color: fill > 0.5 ? c.navy : c.cream}}>
              <Count from={0} to={6419} start={T.eqStart} end={T.pocket} ease={Easing.inOut(Easing.quad)} /><span style={{fontSize: 34, marginLeft: 12}}>PAID DOWN</span>
            </div>
          </div>
        </Pop>
        <Slam at={T.pocket} from={1.7}><div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: 110, color: c.goldBright, marginTop: 30}}>into YOUR pocket.</div></Slam>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 5: honest beat ──
const Honest: React.FC = () => {
  const frame = useCurrentFrame();
  const g = (d: number) => interpolate(frame, [f(T.honest + 0.15 + d), f(T.honest + 1.0 + d)], [0, 1], {...clamp, easing: out3});
  const bars = [
    {label: 'OWN · P&I', v: 4564, h: 4564 / 4564, col: c.goldBright, d: 0},
    {label: 'RENT', v: 3600, h: 3600 / 4564, col: c.muted, d: 0.15},
  ];
  return (
    <AbsoluteFill>
      <NavyBg />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 250}}>
        <Pop at={T.honest}><Stamp>COSTS MORE EACH MONTH?</Stamp></Pop>
        <div style={{display: 'flex', gap: 120, alignItems: 'flex-end', height: 640, marginTop: 50}}>
          {bars.map((b) => (
            <div key={b.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontFamily: ui, fontWeight: 900, fontSize: 60, color: b.col, opacity: g(b.d)}}>${b.v.toLocaleString('en-US')}</div>
              <div style={{width: 230, height: 520 * b.h * g(b.d), background: b.col, borderRadius: '16px 16px 0 0', marginTop: 14}} />
              <Stamp size={42} color={c.cream}>{b.label}</Stamp>
            </div>
          ))}
        </div>
        <Pop at={T.honest + 0.9}><div style={{fontFamily: ui, fontWeight: 700, fontSize: 34, color: c.muted, marginTop: 20}}>per month · own also adds taxes, HOA, insurance</div></Pop>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <Slam at={T.yep} from={3}><div style={{transform: 'rotate(-10deg)', border: `10px solid ${c.goldBright}`, borderRadius: 24, padding: '0 50px',
          fontFamily: stamp, fontSize: 300, color: c.goldBright, background: 'rgba(10,22,40,0.75)', lineHeight: 1.1}}>YEP.</div></Slam>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 6: Olaf payoff ──
const Yard: React.FC = () => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [f(T.yard), f(T.olaf), f(T.olaf) + 8, f(T.end)], [1.05, 1.12, 1.45, 1.52], {...clamp, easing: out3});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 38%'}}>
        <Sequence from={f(T.yard)}><OffthreadVideo src={staticFile('olaf.mp4')} startFrom={f(3.4)} playbackRate={0.75} muted /></Sequence>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0) 30%, rgba(10,22,40,0) 62%, rgba(10,22,40,0.75) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 250, textAlign: 'center'}}>
        <Pop at={T.yard + 0.05}><Stamp size={56} color={c.cream}>BUT IT'S</Stamp></Pop>
        <Slam at={T.yardWord} from={2.4}><div style={{fontFamily: stamp, fontSize: 250, color: c.goldBright, lineHeight: 0.95, textShadow: '0 8px 40px rgba(0,0,0,0.6)'}}>YOUR YARD.</div></Slam>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 640}}>
        <Pop at={T.olaf - 0.4}><div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: 90, color: c.cream, textShadow: '0 4px 20px rgba(0,0,0,0.7)'}}>just ask Olaf.</div></Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 7: end card ──
const End: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin((frame - f(T.end)) / 5) * 0.025;
  return (
    <AbsoluteFill>
      <NavyBg glow="#1d2f52" />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
        <Pop at={T.end + 0.1}><div style={{fontFamily: display, fontSize: 84, color: c.cream}}>Scale Smarter, Build Better…</div></Pop>
        <Slam at={T.end + 0.45} from={1.5}><div style={{fontFamily: display, fontSize: 190, color: c.goldBright, lineHeight: 1.05}}>EpiVail</div></Slam>
        <Pop at={T.end + 0.8}><div style={{fontFamily: ui, fontWeight: 700, fontSize: 40, color: c.cream, marginTop: 10}}>Charles Harrison, Epique Area/Growth Leader</div></Pop>
        <Pop at={T.end + 1.0} style={{marginTop: 46}}>
          <div style={{transform: `scale(${pulse})`, background: c.gold, color: c.navy, fontFamily: stamp, fontSize: 56, letterSpacing: '0.12em', padding: '14px 40px', borderRadius: 999}}>
            COMMENT BELOW & FOLLOW
          </div>
        </Pop>
        <Pop at={T.end + 1.2} style={{marginTop: 60}}>
          <div style={{fontFamily: ui, fontSize: 22, color: c.muted, lineHeight: 1.5, maxWidth: 900}}>
            Rent: Trulia, Eagle CO avg. 3-BR, Nov 2026 · Price: Vail MLS via Mont Haus, Eagle townhome/condo median YTD Oct 2026 ·
            Rate: Freddie Mac PMMS 30-yr fixed, 11/19/2026 · 5% down; principal = year-1 P&amp;I amortization. Illustration only, not a loan quote.
          </div>
        </Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Karaoke captions: 3-word groups, active word pops gold ──
type W = {w: string; s: number; e: number};
const merged: W[] = [];
for (const x of words as W[]) {
  const last = merged[merged.length - 1];
  if (last && /^[,.%]/.test(x.w)) { last.w += x.w; last.e = x.e; } else merged.push({...x});
}
const fix: Record<string, string> = {'$43,000': '$43,200', 'Townhome': 'townhome'};
const groups: W[][] = [];
{ let cur: W[] = []; for (const w of merged) { cur.push({...w, w: fix[w.w] ?? w.w}); if (cur.length >= 3 || /[.?!,]$/.test(w.w)) { groups.push(cur); cur = []; } } if (cur.length) groups.push(cur); }
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t >= T.end) return null;
  const gi = groups.findIndex((g, i) => t >= g[0].s - 0.03 && t < (groups[i + 1]?.[0].s ?? g[g.length - 1].e + 0.4) - 0.03);
  if (gi < 0) return null;
  const g = groups[gi];
  const enter = spring({frame: frame - f(g[0].s - 0.03), fps, config: {damping: 200, stiffness: 400}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 450}}>
      <div style={{transform: `scale(${0.85 + enter * 0.15})`, opacity: enter, textAlign: 'center', maxWidth: 900}}>
        {g.map((w, i) => {
          const on = t >= w.s;
          const p = spring({frame: frame - f(w.s), fps, config: {damping: 12, stiffness: 300}});
          return (
            <span key={i} style={{display: 'inline-block', fontFamily: ui, fontWeight: 900, fontSize: 66, margin: '0 14px', textTransform: 'uppercase',
              color: on ? c.goldBright : c.cream, transform: `scale(${on ? 1 + 0.08 * (1 - p) : 1})`,
              textShadow: '0 4px 0 rgba(10,22,40,0.9), 0 0 24px rgba(10,22,40,0.8)'}}>{w.w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <>
      <div style={{position: 'absolute', top: 70, right: 60, fontFamily: stamp, fontSize: 48, letterSpacing: '0.2em', color: c.gold, textShadow: '0 2px 12px rgba(0,0,0,0.6)'}}>EPIVAIL</div>
      <div style={{position: 'absolute', bottom: 0, left: 0, height: 12, width: `${(frame / durationInFrames) * 100}%`, background: `linear-gradient(90deg, ${c.goldDim}, ${c.goldBright})`}} />
    </>
  );
};

// ── Sound design: each cue lands on its visual event ──
const SFX: {at: number; src: string; vol: number}[] = [
  {at: T.slam43 - 0.02, src: 'impact-cine-big', vol: 0.55},
  {at: T.year, src: 'typewriter-hit-hard', vol: 0.5},
  {at: T.rent - 0.12, src: 'swoosh-quick', vol: 0.5},
  ...MONTHS.map((_, i) => ({at: dealAt(i), src: 'clock-tick-single', vol: 0.45})),
  {at: T.poof - 0.03, src: 'sparkle-poof-hit', vol: 0.6},
  {at: T.gone - 0.02, src: 'bass-hit-short', vol: 0.7},
  {at: T.own - 0.12, src: 'air-whoosh-powerful', vol: 0.35},
  {at: T.year1, src: 'typewriter-hit-hard', vol: 0.45},
  {at: T.eqStart, src: 'riser-cine', vol: 0.22},
  {at: T.pocket - 0.02, src: 'hit-fast-exciting', vol: 0.5},
  {at: T.honest - 0.12, src: 'swoosh-quick', vol: 0.45},
  {at: T.yep - 0.02, src: 'typewriter-hit-hard', vol: 0.7},
  {at: T.yard - 0.12, src: 'air-whoosh-powerful', vol: 0.35},
  {at: T.yardWord - 0.02, src: 'impact-cine-big', vol: 0.55},
  {at: T.end - 0.1, src: 'swoosh-quick', vol: 0.4},
];

const Reel: React.FC = () => {
  const shake = useShake();
  const musicVol = (fr: number) => interpolate(fr, [0, 6, f(T.end) - 10, f(T.end) + 10, f(TOTAL) - 25, f(TOTAL)], [0, 0.2, 0.2, 0.45, 0.45, 0], clamp);
  return (
    <AbsoluteFill style={{background: c.navy, overflow: 'hidden'}}>
      <Audio src={staticFile('vo2.wav')} volume={1} />
      <Audio src={staticFile('music2.mp3')} volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, f(s.at))} durationInFrames={f(3)}><Audio src={staticFile(`sfx/${s.src}.mp3`)} volume={s.vol} /></Sequence>
      ))}
      <AbsoluteFill style={{transform: shake}}>
        <Whip from={-1} to={T.rent}><Hook /></Whip>
        <Whip from={T.rent} to={T.own}><Rent /></Whip>
        <Whip from={T.own} to={T.honest}><Own /></Whip>
        <Whip from={T.honest} to={T.yard}><Honest /></Whip>
        <Whip from={T.yard} to={T.end}><Yard /></Whip>
        <Whip from={T.end} to={TOTAL + 1}><End /></Whip>
        <Captions />
      </AbsoluteFill>
      <Chrome />
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <Composition id="ReelV2" component={Reel} durationInFrames={f(TOTAL)} fps={FPS} width={1080} height={1920} />
));
