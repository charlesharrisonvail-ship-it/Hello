import React from 'react';
import {
  AbsoluteFill, Audio, Composition, OffthreadVideo, Sequence, interpolate, registerRoot,
  spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadDM} from '@remotion/google-fonts/DMSans';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import words from './words.json';

const display = loadCormorant('normal', {weights: ['600', '700'], subsets: ['latin']}).fontFamily;
const ui = loadDM('normal', {weights: ['500', '700'], subsets: ['latin']}).fontFamily;
const stamp = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;

const c = {
  navy: '#0a1628', navyMid: '#0f1f3d', navyLight: '#172847', gold: '#c9a84c',
  goldBright: '#e8c66a', cream: '#f5f0e8', muted: '#7a8ba8',
};
const FPS = 30;
const VO_END = 41.6;
const TOTAL = 47;
const f = (s: number) => Math.round(s * FPS);

type W = {w: string; s: number; e: number};
// Whisper splits "$3,600" into "$3" + ",600"; glue those back together.
const merged: W[] = [];
for (const x of words as W[]) {
  const last = merged[merged.length - 1];
  if (last && /^[,.%]/.test(x.w)) { last.w += x.w; last.e = x.e; } else merged.push({...x});
}

const Rise: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - f(at), fps, config: {damping: 200}});
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * 40}px)`, ...style}}>{children}</div>;
};

const Eyebrow: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: stamp, color: c.gold, letterSpacing: '0.25em', fontSize: 44}}>{children}</div>
);
const Rule: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [f(at), f(at) + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{height: 3, width: 420, background: c.gold, transform: `scaleX(${s})`, transformOrigin: 'left', margin: '28px 0'}} />;
};

const NavyBg: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at ${50 + Math.sin(frame / 90) * 10}% 20%, ${c.navyLight} 0%, ${c.navyMid} 45%, ${c.navy} 100%)`}} />
  );
};

const Big: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = c.cream, size = 150}) => (
  <div style={{fontFamily: display, fontWeight: 700, fontSize: size, color, lineHeight: 1}}>{children}</div>
);
const Small: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = c.cream}) => (
  <div style={{fontFamily: ui, fontWeight: 500, fontSize: 46, color, lineHeight: 1.3}}>{children}</div>
);

const Panel: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{padding: '300px 90px 0', display: 'flex', flexDirection: 'column'}}>{children}</AbsoluteFill>
);

// Absolute timings below match Eva's read (words.json). Children use absolute seconds.
const Abs: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => (
  <Sequence from={f(from)} durationInFrames={f(to) - f(from)}>
    <Sequence from={-f(from)} layout="none">{children}</Sequence>
  </Sequence>
);

const Strike: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [f(at), f(at) + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'relative', display: 'inline-block'}}>
      {children}
      <div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 10, background: c.gold, transform: `scaleX(${s})`, transformOrigin: 'left'}} />
    </div>
  );
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t > VO_END + 0.3) return null;
  // Group words into lines of ~4 that break on sentence ends.
  const lines: W[][] = [];
  let cur: W[] = [];
  for (const w of merged) {
    cur.push(w);
    if (cur.length >= 4 || /[.?!]$/.test(w.w)) { lines.push(cur); cur = []; }
  }
  if (cur.length) lines.push(cur);
  const line = lines.find((l, i) => t >= l[0].s - 0.05 && t < (lines[i + 1]?.[0].s ?? l[l.length - 1].e + 0.6) - 0.05);
  if (!line) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 300}}>
      <div style={{background: 'rgba(10,22,40,0.72)', borderRadius: 18, padding: '18px 34px', maxWidth: 940, textAlign: 'center'}}>
        {line.map((w, i) => (
          <span key={i} style={{fontFamily: ui, fontWeight: 700, fontSize: 58, color: t >= w.s ? c.goldBright : c.cream, marginRight: 14}}>
            {w.w}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <>
      <div style={{position: 'absolute', top: 70, right: 60, fontFamily: stamp, fontSize: 52, letterSpacing: '0.2em', color: c.gold, textShadow: '0 2px 12px rgba(0,0,0,0.5)'}}>EPIVAIL</div>
      <div style={{position: 'absolute', bottom: 0, left: 0, height: 10, width: `${(frame / durationInFrames) * 100}%`, background: c.gold}} />
    </>
  );
};

const Shade: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0) 35%, rgba(10,22,40,0) 60%, rgba(10,22,40,0.7) 100%)'}} />
);

const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const musicVol = (fr: number) =>
    interpolate(fr, [0, 15, f(VO_END), f(VO_END) + 20, f(TOTAL) - 30, f(TOTAL)], [0, 0.13, 0.13, 0.4, 0.4, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: c.navy}}>
      <Audio src={staticFile('vo.wav')} />
      <Audio src={staticFile('music.mp3')} volume={musicVol} />

      {/* 0–3.2s: hook over Olaf */}
      <Abs from={0} to={3.2}>
        <OffthreadVideo src={staticFile('olaf.mp4')} muted />
        <Shade />
        <Panel>
          <Rise at={0.1}><Eyebrow>THE COST OF WAITING</Eyebrow></Rise>
          <Rise at={0.4}><Big size={130}>Vail Valley</Big></Rise>
          <Rise at={0.7}><Big size={130} color={c.goldBright}><i>rent edition</i></Big></Rise>
        </Panel>
      </Abs>

      {/* 3.2–12.9s: renting */}
      <Abs from={3.2} to={12.9}>
        <NavyBg />
        <Panel>
          <Rise at={3.3}><Eyebrow>RENTING · 3-BEDROOM IN EAGLE</Eyebrow></Rise>
          <Rule at={3.4} />
          <Rise at={4.7}><Big>$3,600<span style={{fontSize: 70, color: c.muted}}>/mo</span></Big></Rise>
          <Rise at={6.9} style={{marginTop: 40}}><Small color={c.muted}>× 12 months =</Small></Rise>
          <Rise at={7.1}><Strike at={9.7}><Big color={c.goldBright}>$43,200</Big></Strike></Rise>
          <Rise at={9.7} style={{marginTop: 40}}><Big size={110}>Gone.</Big></Rise>
          <Rise at={10.7}><Small color={c.muted}>Nothing back but receipts.</Small></Rise>
        </Panel>
      </Abs>

      {/* 12.9–29s: owning */}
      <Abs from={12.9} to={29}>
        <NavyBg />
        <Panel>
          <Rise at={13.0}><Eyebrow>OWNING · TYPICAL EAGLE TOWNHOME</Eyebrow></Rise>
          <Rule at={13.1} />
          <Rise at={15.4}><Big>$702,200</Big></Rise>
          <Rise at={15.6}><Small color={c.muted}>median townhome/condo, 2026 YTD</Small></Rise>
          <Rise at={17.1} style={{marginTop: 34}}><Small>5% down · <b style={{color: c.goldBright}}>7.28%</b> 30-yr fixed</Small></Rise>
          <Rise at={18.6}><Small color={c.muted}>P&amp;I ≈ $4,564/mo + taxes, HOA, insurance</Small></Rise>
          <Rise at={20.7} style={{marginTop: 44}}><Small color={c.muted}>Year 1 principal paid down</Small></Rise>
          <Rise at={22.9}><Big color={c.goldBright}>≈ $6,400</Big></Rise>
          <Rise at={25.5} style={{marginTop: 20}}><Small>That stays <i style={{color: c.goldBright}}>yours</i> — plus any appreciation.</Small></Rise>
        </Panel>
      </Abs>

      {/* 29–33.6s: honesty beat */}
      <Abs from={29} to={33.6}>
        <NavyBg />
        <Panel>
          <Rise at={29.1}><Eyebrow>STRAIGHT TALK</Eyebrow></Rise>
          <Rule at={29.2} />
          <Rise at={29.4}><Big size={120}>Owning costs more each month up here.</Big></Rise>
          <Rise at={32.0} style={{marginTop: 30}}><Small color={c.goldBright}>We won't pretend it doesn't.</Small></Rise>
        </Panel>
      </Abs>

      {/* 33.6–41.8s: Olaf payoff (rest of clip, slowed) */}
      <Abs from={33.6} to={41.8}>
        <Sequence from={f(33.6)}>
          <OffthreadVideo src={staticFile('olaf.mp4')} startFrom={f(3)} playbackRate={0.6} muted />
        </Sequence>
        <Shade />
        <Panel>
          <div style={{marginTop: -170}} />
          <Rise at={33.7}><Big size={96}>Every rent check builds somebody else's yard.</Big></Rise>
          <Rise at={37.1} style={{marginTop: 30}}><Big size={96} color={c.goldBright}><i>Olaf would like his own.</i></Big></Rise>
        </Panel>
      </Abs>

      {/* 41.8–47s: end card */}
      <Abs from={41.8} to={TOTAL}>
        <NavyBg />
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 80}}>
          <Rise at={41.9}><Big size={96}>Scale Smarter, Build Better…</Big></Rise>
          <Rise at={42.3}><Big size={140} color={c.goldBright}>EpiVail</Big></Rise>
          <Rise at={42.7} style={{marginTop: 30}}><Small>Charles Harrison, Epique Area/Growth Leader</Small></Rise>
          <Rise at={43.0} style={{marginTop: 26}}><div style={{fontFamily: stamp, fontSize: 40, letterSpacing: '0.15em', color: c.gold}}>COMMENT BELOW & FOLLOW FOR MORE</div></Rise>
          <Rise at={43.3} style={{marginTop: 70}}>
            <div style={{fontFamily: ui, fontSize: 24, color: c.muted, lineHeight: 1.5, maxWidth: 880}}>
              Sources: Rent — Trulia, Eagle CO avg. 3-BR, Nov 2026. Price — Vail MLS via Mont Haus, Eagle townhome/condo median YTD Oct 2026.
              Rate — Freddie Mac PMMS, 30-yr fixed, 11/19/2026. Illustration only; not a loan quote. Principal figure is P&amp;I amortization, year 1.
            </div>
          </Rise>
        </AbsoluteFill>
      </Abs>

      <Captions />
      <Chrome />
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <Composition id="Reel" component={Reel} durationInFrames={f(TOTAL)} fps={FPS} width={1080} height={1920} />
));
