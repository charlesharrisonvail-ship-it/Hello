import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, OffthreadVideo, Sequence, interpolate, registerRoot, spring, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadDM} from '@remotion/google-fonts/DMSans';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import durs from './durations.json';

const displayI = loadCormorant('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;
const display = loadCormorant('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const ui = loadDM('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const stamp = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const c = {navy: '#0a1628', navyMid: '#0f1f3d', navyLight: '#172847', gold: '#c9a84c', goldBright: '#e8c66a', cream: '#f5f0e8'};
const FPS = 30;
const s = (t: number) => Math.round(t * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const XF = 12;

type Cap =
  | {k: 'hook'}
  | {k: 'chapter'; kicker: string; title: string; sub?: string}
  | {k: 'line'; text: string; kicker?: string; pos: 'top' | 'bottom'; text2?: string};
type Item = {len: number; src: string; from?: number; photo?: 'tall' | 'cafe'; cap?: Cap; place: string; push?: 'in' | 'out'};
const D = 'Dinkelsbühl, DE', K = 'Kirchberg an der Jagst, DE';
const V = 2.7, P = 3.3, CH = 3.6;
const SEQ: Item[] = [
  {len: 4.2, src: 'c124203', from: 0.5, cap: {k: 'hook'}, place: D},
  {len: V, src: 'c124441', from: 0.5, cap: {k: 'line', text: 'the Münster St. Georg', pos: 'bottom'}, place: D},
  {len: V, src: 'c124612', from: 1.0, cap: {k: 'line', text: 'history carved in stone', pos: 'bottom'}, place: D},
  {len: V, src: 'c124753', from: 0.5, cap: {k: 'line', text: 'quiet corners', pos: 'bottom'}, place: D},
  {len: P, src: 'poster', photo: 'tall', cap: {k: 'line', text: 'a hometown nativity in the Münster St. Georg', pos: 'top'}, place: D},
  {len: V, src: 'c125429', from: 1.5, push: 'out', cap: {k: 'line', text: 'colorful gables everywhere', pos: 'bottom'}, place: D},
  {len: V, src: 'c130920', from: 1.0, place: D},
  {len: V, src: 'c131135', from: 1.0, place: D},
  {len: V, src: 'c131718', from: 1.5, cap: {k: 'line', text: 'storybook squares', pos: 'bottom'}, place: D},
  {len: V, src: 'c132344', from: 1.0, cap: {k: 'line', text: 'along the old town wall', pos: 'bottom'}, place: D},
  {len: P, src: 'tower', photo: 'tall', cap: {k: 'line', text: 'the Münster, rising over the street', pos: 'top'}, place: D},
  {len: V, src: 'c140906', from: 0.5, cap: {k: 'line', kicker: 'LUNCH BREAK', text: 'a cold Hefeweizen', pos: 'top'}, place: D},
  {len: V, src: 'c142158', from: 0.5, cap: {k: 'line', text: 'and a proper German plate', pos: 'bottom'}, place: D},
  {len: V, src: 'c150344', from: 1.5, place: D},
  {len: V, src: 'c151902', from: 1.0, cap: {k: 'line', text: 'the Christmas market', pos: 'bottom'}, place: D},
  {len: V, src: 'c151801', from: 0.5, cap: {k: 'line', text: 'Glühwein time', pos: 'bottom'}, place: D},
  {len: V, src: 'c151809', from: 1.0, cap: {k: 'line', text: 'in a mug shaped like a boot!', pos: 'top'}, place: D},
  {len: CH, src: 'c182206', from: 0.5, cap: {k: 'chapter', kicker: 'THEN', title: 'AFTER DARK', sub: 'one more Christmas market'}, place: ''},
  {len: V, src: 'c182436', from: 0.3, cap: {k: 'line', text: 'lights everywhere', pos: 'bottom'}, place: ''},
  {len: 3.2, src: 'c183148', from: 0.5, cap: {k: 'line', text: 'and one more mug for the collection.', pos: 'top'}, place: ''},
];
const STARTS: number[] = [];
{ let t = 0; for (const it of SEQ) { STARTS.push(t); t += it.len; } }
const END = STARTS[STARTS.length - 1] + SEQ[SEQ.length - 1].len;
const TOTAL = END + 5;

const ShotView: React.FC<{it: Item; i: number; len: number}> = ({it, i, len}) => {
  const frame = useCurrentFrame();
  const t = frame / Math.max(1, len);
  const fade = i === 0 ? 1 : interpolate(frame, [0, XF], [0, 1], clamp);
  if (it.photo) {
    const p = spring({frame, fps: FPS, config: {damping: 22, stiffness: 90}});
    const rot = interpolate(p, [0, 1], [i % 2 ? 6 : -6, i % 2 ? 2 : -2]);
    const sc = interpolate(p, [0, 1], [1.1, 1]) * interpolate(t, [0, 1], [1, 1.04]);
    const cafe = it.photo === 'cafe';
    return (
      <AbsoluteFill style={{opacity: fade, background: `radial-gradient(90% 60% at 50% 45%, ${c.navyLight}, ${c.navy})`, alignItems: 'center', paddingTop: cafe ? 640 : 520}}>
        <div style={{transform: `rotate(${rot}deg) scale(${sc})`, background: '#fbf8f1', padding: '20px 20px 80px', boxShadow: '0 30px 80px rgba(0,0,0,0.55)'}}>
          <Img src={staticFile(`${it.src}.jpg`)} style={{width: cafe ? 620 : 620, height: cafe ? 1000 : 1060, objectFit: 'cover', objectPosition: cafe ? '60% 52%' : 'center', display: 'block'}} />
        </div>
      </AbsoluteFill>
    );
  }
  const dur = (durs as Record<string, number>)[it.src] ?? 99;
  const need = len / FPS + 0.15;
  const from = Math.max(0, Math.min(it.from ?? 0, dur - need));
  const rate = Math.min(1, (dur - from - 0.05) / need);
  const scale = it.push === 'out' ? interpolate(t, [0, 1], [1.1, 1.02]) : interpolate(t, [0, 1], [1.02, 1.08]);
  return (
    <AbsoluteFill style={{opacity: fade, transform: `scale(${scale})`}}>
      <OffthreadVideo src={staticFile(`${it.src}.mp4`)} startFrom={Math.round(from * FPS)} playbackRate={rate} muted />
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
const Script: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 90, color = c.cream}) => (
  <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: size, lineHeight: 1.05, color, textShadow: shadow}}>{children}</div>
);
const topS: React.CSSProperties = {alignItems: 'center', textAlign: 'center', padding: '250px 60px 0'};
const botS: React.CSSProperties = {alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', padding: '0 60px 480px'};

const CapView: React.FC<{cap: Cap; a: number; b: number}> = ({cap, a, b}) => {
  if (cap.k === 'hook') return (
    <Win a={a} b={b} style={{...topS, background: 'linear-gradient(180deg, rgba(10,22,40,0.7) 0%, rgba(10,22,40,0.3) 40%, rgba(10,22,40,0) 60%)'}}>
      <Pop at={a + 0.3}><Kick>ONE SLOW DAY IN GERMANY</Kick></Pop>
      <Pop at={a + 1.0}><div style={{fontFamily: stamp, fontSize: 160, color: c.cream, lineHeight: 0.95, textShadow: shadow}}>DINKELSBÜHL</div></Pop>
      <Pop at={a + 1.8}><Script size={66} color={c.goldBright}>a walled old town</Script></Pop>
    </Win>
  );
  if (cap.k === 'chapter') return (
    <Win a={a} b={b} style={{...topS, background: 'linear-gradient(180deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.4) 35%, rgba(10,22,40,0) 55%)'}}>
      <Pop at={a + 0.3}><Kick size={48}>{cap.kicker}</Kick></Pop>
      <Pop at={a + 0.9}><div style={{fontFamily: stamp, fontSize: cap.title.length > 12 ? 130 : 170, color: c.cream, lineHeight: 0.95, textShadow: shadow}}>{cap.title}</div></Pop>
      {cap.sub && <Pop at={a + 1.6}><Script size={cap.sub.length > 30 ? 56 : 70}>{cap.sub}</Script></Pop>}
    </Win>
  );
  return (
    <Win a={a} b={b} style={cap.pos === 'top' ? topS : botS}>
      {cap.kicker && <Pop at={a + 0.5}><Kick>{cap.kicker}</Kick></Pop>}
      <Pop at={a + (cap.kicker ? 1.0 : 0.5)}><Script>{cap.text}</Script></Pop>
    </Win>
  );
};

const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const vol = (f: number) => interpolate(f, [0, 15, s(TOTAL) - 45, s(TOTAL)], [0, 0.9, 0.9, 0], clamp);
  const idx = STARTS.findIndex((st, i) => frame >= s(st) && frame < s(st + SEQ[i].len));
  const place = idx >= 0 ? SEQ[idx].place : '';
  const pulse = 1 + Math.sin((frame - s(END)) / 6) * 0.02;
  return (
    <AbsoluteFill style={{background: c.navy}}>
      <Audio src={staticFile('music.mp3')} volume={vol} />
      {SEQ.map((it, i) => {
        const from = Math.max(0, s(STARTS[i]) - (i ? XF : 0));
        const to = s(STARTS[i] + it.len);
        return <Sequence key={i} from={from} durationInFrames={to - from}><ShotView it={it} i={i} len={to - from} /></Sequence>;
      })}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0) 22%, rgba(10,22,40,0) 68%, rgba(10,22,40,0.55) 100%)'}} />
      {SEQ.map((it, i) => it.cap ? <CapView key={i} cap={it.cap} a={STARTS[i]} b={STARTS[i] + it.len} /> : null)}

      <Win a={END} b={TOTAL + 1} style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 70, background: `radial-gradient(100% 70% at 50% 35%, #1d2f52, ${c.navyMid} 50%, ${c.navy})`}}>
        <Pop at={END + 0.2}><Script size={100}>Have you been</Script></Pop>
        <Pop at={END + 0.7}><Script size={100} color={c.goldBright}>to Dinkelsbühl?</Script></Pop>
        <Pop at={END + 1.4} style={{marginTop: 50}}>
          <div style={{transform: `scale(${pulse})`, background: c.gold, color: c.navy, fontFamily: stamp, fontSize: 54, letterSpacing: '0.12em', padding: '14px 40px', borderRadius: 999}}>COMMENT BELOW & FOLLOW FOR MORE</div>
        </Pop>
        <Pop at={END + 2} style={{marginTop: 60}}>
          <div style={{fontFamily: stamp, fontSize: 60, letterSpacing: '0.25em', color: c.goldBright}}>EPIVAIL</div>
          <div style={{fontFamily: ui, fontSize: 32, color: c.cream, marginTop: 6}}>Charles Harrison, Epique Area/Growth Leader</div>
        </Pop>
      </Win>

      {place && (
        <div style={{position: 'absolute', top: 76, left: 60, display: 'flex', alignItems: 'center', gap: 12, fontFamily: ui, fontSize: 30, color: c.cream, textShadow: shadow}}>
          <svg width="26" height="34" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0zm0 16a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" fill={c.goldBright} /></svg>
          {place}
        </div>
      )}
      <div style={{position: 'absolute', top: 70, right: 60, fontFamily: stamp, fontSize: 46, letterSpacing: '0.2em', color: c.gold, textShadow: shadow}}>EPIVAIL</div>
    </AbsoluteFill>
  );
};

registerRoot(() => <Composition id="DinkelsbuhlDay" component={Reel} durationInFrames={s(TOTAL)} fps={FPS} width={1080} height={1920} />);
