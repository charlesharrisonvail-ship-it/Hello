import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, registerRoot, spring, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadDM} from '@remotion/google-fonts/DMSans';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';

const displayI = loadCormorant('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;
const display = loadCormorant('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const ui = loadDM('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const stamp = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const c = {navy: '#0a1628', navyMid: '#0f1f3d', gold: '#c9a84c', goldBright: '#e8c66a', cream: '#f5f0e8'};
const FPS = 30;
const s = (t: number) => Math.round(t * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const IMG_W = 1080, IMG_H = Math.round(1080 * 4000 / 1848); // cover width

// Shots: a slow look around one photo. cx/cy = point of interest (fractions), z = zoom.
type Shot = {cx: number; cy: number; z: number; len: number};
const SHOTS: Shot[] = [
  {cx: 0.5, cy: 0.46, z: 1.0, len: 4.5},   // whole table
  {cx: 0.6, cy: 0.5, z: 2.0, len: 4.0},    // the cappuccino
  {cx: 0.45, cy: 0.2, z: 1.8, len: 4.0},   // the arched café room
  {cx: 0.24, cy: 0.47, z: 2.2, len: 4.0},  // the cake
  {cx: 0.4, cy: 0.34, z: 1.9, len: 3.5},   // candle & plant
  {cx: 0.5, cy: 0.46, z: 1.0, len: 4.5},   // back to the table
];
const STARTS: number[] = [];
{ let t = 0; for (const sh of SHOTS) { STARTS.push(t); t += sh.len; } }
const END = STARTS[STARTS.length - 1] + SHOTS[SHOTS.length - 1].len;
const TOTAL = END + 4.5;
const XF = 12;

const View: React.FC<{sh: Shot; len: number; first: boolean}> = ({sh, len, first}) => {
  const frame = useCurrentFrame();
  const t = frame / len;
  const z = sh.z * interpolate(t, [0, 1], [1, 1.07]);
  const w = IMG_W * z, h = IMG_H * z;
  // place the point of interest at frame centre, clamped so the photo always covers the frame
  const x = Math.min(0, Math.max(1080 - w, 540 - sh.cx * w));
  const y = Math.min(0, Math.max(1920 - h, 960 - sh.cy * h));
  const fade = first ? 1 : interpolate(frame, [0, XF], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: fade, overflow: 'hidden'}}>
      <Img src={staticFile('kaffee.jpg')} style={{position: 'absolute', left: x, top: y, width: w, height: h}} />
    </AbsoluteFill>
  );
};

const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - s(at), fps: FPS, config: {damping: 200, stiffness: 120}});
  if (frame < s(at)) return null;
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * 30}px)`, ...style}}>{children}</div>;
};
const Win: React.FC<{a: number; b: number; children: React.ReactNode; style?: React.CSSProperties}> = ({a, b, children, style}) => {
  const frame = useCurrentFrame();
  if (frame < s(a) || frame >= s(b)) return null;
  const o = interpolate(frame, [s(b) - 10, s(b)], [1, 0], clamp);
  return <AbsoluteFill style={{opacity: o, ...style}}>{children}</AbsoluteFill>;
};
const shadow = '0 4px 26px rgba(0,0,0,0.75), 0 2px 4px rgba(0,0,0,0.5)';
const Kick: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 46}) => (
  <div style={{fontFamily: stamp, fontSize: size, letterSpacing: '0.22em', color: c.goldBright, textShadow: shadow}}>{children}</div>
);
const Script: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 96, color = c.cream}) => (
  <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: size, lineHeight: 1.05, color, textShadow: shadow}}>{children}</div>
);
const top: React.CSSProperties = {alignItems: 'center', paddingTop: 260, textAlign: 'center', padding: '260px 60px 0'};
const bottom: React.CSSProperties = {alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 480, textAlign: 'center', padding: '0 60px 480px'};

const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const vol = (f: number) => interpolate(f, [0, 15, s(TOTAL) - 45, s(TOTAL)], [0, 0.9, 0.9, 0], clamp);
  const [a0, a1, a2, a3, a4, a5] = STARTS;
  const pulse = 1 + Math.sin((frame - s(END)) / 6) * 0.02;
  return (
    <AbsoluteFill style={{background: c.navy}}>
      <Audio src={staticFile('music.mp3')} volume={vol} />
      {SHOTS.map((sh, i) => {
        const from = Math.max(0, s(STARTS[i]) - (i ? XF : 0));
        const to = s(STARTS[i] + sh.len) + (i === SHOTS.length - 1 ? s(1) : 0);
        return <Sequence key={i} from={from} durationInFrames={to - from}><View sh={sh} len={to - from} first={i === 0} /></Sequence>;
      })}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.6) 0%, rgba(10,22,40,0) 28%, rgba(10,22,40,0) 62%, rgba(10,22,40,0.6) 100%)'}} />

      <Win a={a0} b={a1} style={top}>
        <Pop at={a0 + 0.4}><Kick>SCHLOSS KIRCHBERG AN DER JAGST</Kick></Pop>
        <Pop at={a0 + 1.2}><div style={{fontFamily: display, fontSize: 150, color: c.cream, lineHeight: 1, textShadow: shadow}}>Kaffee</div></Pop>
        <Pop at={a0 + 1.8}><div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: 110, color: c.goldBright, lineHeight: 1, textShadow: shadow}}>und Kuchen</div></Pop>
      </Win>
      <Win a={a1} b={a2} style={bottom}>
        <Pop at={a1 + 0.6}><Kick>LITERALLY</Kick></Pop>
        <Pop at={a1 + 1.1}><Script>"coffee and cake"</Script></Pop>
      </Win>
      <Win a={a2} b={a3} style={top}>
        <Pop at={a2 + 0.6}><Script size={88}>a German afternoon ritual,</Script></Pop>
        <Pop at={a2 + 1.4}><Script size={88} color={c.goldBright}>somewhere between 2 and 5.</Script></Pop>
      </Win>
      <Win a={a3} b={a4} style={bottom}>
        <Pop at={a3 + 0.6}><Script>no rushing.</Script></Pop>
        <Pop at={a3 + 1.4}><Script color={c.goldBright}>just cake.</Script></Pop>
      </Win>
      <Win a={a4} b={a5} style={top}>
        <Pop at={a4 + 0.6}><Script size={92}>coffee, cake & conversation.</Script></Pop>
      </Win>
      <Win a={a5} b={END} style={top}>
        <Pop at={a5 + 0.6}><Kick size={50}>THAT'S THE LIFESTYLE</Kick></Pop>
      </Win>

      {/* end card */}
      <Win a={END} b={TOTAL + 1} style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 70, background: `radial-gradient(100% 70% at 50% 35%, #1d2f52, ${c.navyMid} 50%, ${c.navy})`}}>
        <Pop at={END + 0.2}><Script size={100}>Where's your favorite</Script></Pop>
        <Pop at={END + 0.7}><Script size={100} color={c.goldBright}>coffee & cake spot?</Script></Pop>
        <Pop at={END + 1.4} style={{marginTop: 50}}>
          <div style={{transform: `scale(${pulse})`, background: c.gold, color: c.navy, fontFamily: stamp, fontSize: 54, letterSpacing: '0.12em', padding: '14px 40px', borderRadius: 999}}>COMMENT BELOW & FOLLOW FOR MORE</div>
        </Pop>
        <Pop at={END + 2} style={{marginTop: 60}}>
          <div style={{fontFamily: stamp, fontSize: 60, letterSpacing: '0.25em', color: c.goldBright}}>EPIVAIL</div>
          <div style={{fontFamily: ui, fontSize: 32, color: c.cream, marginTop: 6}}>Charles Harrison, Epique Area/Growth Leader</div>
        </Pop>
      </Win>

      {frame < s(END) && (
        <div style={{position: 'absolute', top: 76, left: 60, display: 'flex', alignItems: 'center', gap: 12, fontFamily: ui, fontSize: 30, color: c.cream, textShadow: shadow}}>
          <svg width="26" height="34" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0zm0 16a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" fill={c.goldBright} /></svg>
          Kirchberg an der Jagst, DE
        </div>
      )}
      <div style={{position: 'absolute', top: 70, right: 60, fontFamily: stamp, fontSize: 46, letterSpacing: '0.2em', color: c.gold, textShadow: shadow}}>EPIVAIL</div>
    </AbsoluteFill>
  );
};

registerRoot(() => <Composition id="Kaffee" component={Reel} durationInFrames={s(TOTAL)} fps={FPS} width={1080} height={1920} />);
