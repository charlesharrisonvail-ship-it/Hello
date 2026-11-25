import React from 'react';
import {
  AbsoluteFill, Audio, Composition, Easing, Img, OffthreadVideo, Sequence, interpolate, registerRoot,
  spring, staticFile, useCurrentFrame,
} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadDM} from '@remotion/google-fonts/DMSans';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import beats from './beats.json';

const displayI = loadCormorant('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;
const ui = loadDM('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const stamp = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const c = {navy: '#0a1628', navyMid: '#0f1f3d', navyLight: '#172847', gold: '#c9a84c', goldBright: '#e8c66a', cream: '#f5f0e8', red: '#b3262e'};

const FPS = 30;
const BEAT = 0.47;
const B = (n: number) => {
  const i = Math.floor(n);
  const base = (beats as number[])[i] ?? i * BEAT;
  return base + (n - i) * BEAT;
};
const F = (n: number) => Math.round(B(n) * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Cap =
  | {k: 'hook'}
  | {k: 'chapter'; n: number; city: string; sub: string}
  | {k: 'script'; text: string; pos: 'top' | 'bottom'; kicker?: string}
  | {k: 'slam'; text: string; sub?: string}
  | {k: 'mug'; n: number; text?: string};
type Item = {len: number; src: string; from?: number; photo?: 'print' | 'printLand' | 'printWide'; push?: 'in' | 'out'; cap?: Cap; place: string};
const H = 'Heidelberg, DE', M = 'Mannheim, DE', R = 'Rothenburg o.d.T., DE';
const SEQ: Item[] = [
  {len: 7, src: 'c1123_192233', from: 1.0, push: 'in', cap: {k: 'hook'}, place: ''},
  {len: 6, src: 'c1123_190912', from: 0.5, push: 'in', cap: {k: 'chapter', n: 1, city: 'HEIDELBERG', sub: 'after dark'}, place: H},
  {len: 5, src: 'c1123_192556', from: 0.2, push: 'out', cap: {k: 'script', text: 'carousels & lights', pos: 'bottom'}, place: H},
  {len: 5, src: 'c1123_200140', from: 0.3, push: 'in', cap: {k: 'script', kicker: 'GONDOLA HUTS??', text: 'felt like home.', pos: 'top'}, place: H},
  {len: 5, src: 'c1123_200216', from: 1.0, push: 'in', cap: {k: 'script', text: "Santa's on the ride.", pos: 'bottom'}, place: H},
  {len: 6, src: 'selfie', photo: 'printLand', cap: {k: 'script', text: 'Glühwein date night.', pos: 'top'}, place: H},
  {len: 6, src: 'mug1', photo: 'print', cap: {k: 'mug', n: 1}, place: H},
  {len: 6, src: 'c1124_113917', from: 0.3, push: 'in', cap: {k: 'chapter', n: 2, city: 'MANNHEIM', sub: 'by the Wasserturm'}, place: M},
  {len: 5, src: 'c1124_112708', from: 0.3, push: 'in', cap: {k: 'script', text: 'the big pyramid', pos: 'bottom'}, place: M},
  {len: 5, src: 'c1124_112950', from: 0.4, push: 'in', cap: {k: 'script', text: 'Santa, again.', pos: 'bottom'}, place: M},
  {len: 6, src: 'c1124_163532', from: 0.6, push: 'out', cap: {k: 'mug', n: 2}, place: M},
  {len: 6, src: 'c1125_161358', from: 0.8, push: 'in', cap: {k: 'chapter', n: 3, city: 'ROTHENBURG', sub: 'ob der Tauber'}, place: R},
  {len: 5, src: 'c1125_152141', from: 3.2, push: 'in', cap: {k: 'script', text: 'storybook streets', pos: 'bottom'}, place: R},
  {len: 5, src: 'c1125_135424', from: 1.0, push: 'in', cap: {k: 'script', kicker: 'CHRISTMAS SHOPS', text: 'all year long', pos: 'top'}, place: R},
  {len: 5, src: 'c1125_140511', from: 2.5, push: 'in', cap: {k: 'script', text: 'whole Christmas villages', pos: 'bottom'}, place: R},
  {len: 5, src: 'c1125_140654', from: 1.0, push: 'out', cap: {k: 'script', text: 'and cuckoo clocks, everywhere', pos: 'bottom'}, place: R},
  {len: 5, src: 'c1125_154418', from: 0.8, push: 'in', place: R},
  {len: 5, src: 'c1125_151929', from: 2.0, push: 'in', cap: {k: 'slam', text: 'LOCKED UP!', sub: 'behave… or else.'}, place: R},
  {len: 6, src: 'nutcracker', photo: 'print', cap: {k: 'script', text: 'the nutcracker stood guard.', pos: 'top'}, place: R},
  {len: 6, src: 'knight', photo: 'printWide', cap: {k: 'script', text: 'a knight crashed our selfie.', pos: 'top'}, place: R},
  {len: 7, src: 'c1125_143935', from: 0.5, push: 'in', cap: {k: 'mug', n: 3, text: 'whipped cream. obviously.'}, place: R},
];
const STARTS: number[] = [];
{ let b = 0; for (const it of SEQ) { STARTS.push(b); b += it.len; } }
const LINEUP = STARTS[STARTS.length - 1] + SEQ[SEQ.length - 1].len;
const TOTAL_BEAT = LINEUP + 14;
const XF = 9; // soft crossfade frames between shots

const ShotView: React.FC<{it: Item; i: number; len: number}> = ({it, i, len}) => {
  const frame = useCurrentFrame();
  const t = frame / Math.max(1, len);
  const fade = i === 0 ? 1 : interpolate(frame, [0, XF], [0, 1], clamp);
  if (it.photo) {
    const land = it.photo === 'printLand', wide = it.photo === 'printWide';
    const p = spring({frame, fps: FPS, config: {damping: 22, stiffness: 90}});
    const rot = interpolate(p, [0, 1], [i % 2 ? 6 : -6, i % 2 ? 2.5 : -2.5]);
    const sc = interpolate(p, [0, 1], [1.12, 1]) * interpolate(t, [0, 1], [1, 1.04]);
    return (
      <AbsoluteFill style={{opacity: fade, background: `radial-gradient(90% 60% at 50% 45%, ${c.navyLight}, ${c.navy})`, justifyContent: 'flex-start', alignItems: 'center', paddingTop: wide ? 800 : land ? 680 : 560}}>
        <div style={{transform: `rotate(${rot}deg) scale(${sc})`, background: '#fbf8f1', padding: '22px 22px 90px', boxShadow: '0 30px 80px rgba(0,0,0,0.55)'}}>
          <Img src={staticFile(`${it.src}.jpg`)} style={{width: wide ? 960 : land ? 920 : 720, height: wide ? 444 : land ? 690 : 1000, objectFit: 'cover', display: 'block'}} />
        </div>
      </AbsoluteFill>
    );
  }
  const scale = it.push === 'out' ? interpolate(t, [0, 1], [1.1, 1.02]) : interpolate(t, [0, 1], [1.02, 1.09]);
  return (
    <AbsoluteFill style={{opacity: fade, transform: `scale(${scale})`}}>
      <OffthreadVideo src={staticFile(`${it.src}.mp4`)} startFrom={Math.round((it.from ?? 0) * FPS)} muted />
    </AbsoluteFill>
  );
};

const CapView: React.FC<{cap: Cap; b: number; e: number}> = ({cap, b, e}) => {
  const a = b + 0.6;
  if (cap.k === 'hook') return (
    <During b={b} e={e} style={{alignItems: 'center', paddingTop: 300, textAlign: 'center'}}>
      <Pop at={b + 0.3}><Kicker>GERMANY · WEIHNACHTSMÄRKTE</Kicker></Pop>
      <Pop at={b + 1.2}><Big size={170}>3 CHRISTMAS</Big></Pop>
      <Pop at={b + 1.8}><Big size={170}>MARKETS.</Big></Pop>
      <Slam at={b + 3}><Big size={210} color={c.goldBright}>3 MUGS.</Big></Slam>
    </During>
  );
  if (cap.k === 'chapter') return (
    <During b={b} e={e} style={{paddingTop: 300, alignItems: 'center', textAlign: 'center', background: 'linear-gradient(180deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.45) 35%, rgba(10,22,40,0) 55%)'}}>
      <Pop at={b + 0.3}><Kicker size={56}>{`MARKET No. ${cap.n}`}</Kicker></Pop>
      <Slam at={b + 0.9}><Big size={180}>{cap.city}</Big></Slam>
      <Pop at={b + 1.8}><Script size={70}>{cap.sub}</Script></Pop>
    </During>
  );
  if (cap.k === 'script') return (
    <During b={b} e={e} style={cap.pos === 'top' ? {paddingTop: 300, alignItems: 'center', textAlign: 'center'} : {justifyContent: 'flex-end', paddingBottom: 520, alignItems: 'center', textAlign: 'center'}}>
      {cap.kicker && <Pop at={a}><Kicker>{cap.kicker}</Kicker></Pop>}
      <Pop at={a + (cap.kicker ? 0.6 : 0)}><Script size={96}>{cap.text}</Script></Pop>
    </During>
  );
  if (cap.k === 'slam') return (
    <During b={b} e={e} style={{justifyContent: 'flex-end', paddingBottom: 520, alignItems: 'center', textAlign: 'center'}}>
      <Slam at={a}><Big size={130} color={c.goldBright}>{cap.text}</Big></Slam>
      {cap.sub && <Pop at={a + 1}><Script size={74}>{cap.sub}</Script></Pop>}
    </During>
  );
  return (
    <>
      {cap.text && <During b={b} e={e} style={{paddingTop: 280, alignItems: 'center'}}><Pop at={a}><Script size={90}>{cap.text}</Script></Pop></During>}
      <During b={b} e={e} style={{justifyContent: 'flex-end', alignItems: 'flex-end', padding: `0 70px ${SEQ.find((x) => x.cap === cap)?.photo ? 330 : 380}px 0`}}>
        <MugStamp at={b + 1.5} n={cap.n} />
      </During>
    </>
  );
};
const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number}> = ({at, children, style, dy = 50}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - F(at), fps: FPS, config: {damping: 200, stiffness: 320}});
  if (frame < F(at)) return null;
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style}}>{children}</div>;
};
const Slam: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - F(at), fps: FPS, config: {damping: 13, stiffness: 230, mass: 0.7}});
  if (frame < F(at)) return null;
  return <div style={{transform: `scale(${interpolate(p, [0, 1], [2, 1])})`, opacity: Math.min(1, p * 3), ...style}}>{children}</div>;
};

const shadow = '0 4px 24px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5)';
const Kicker: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = c.goldBright, size = 50}) => (
  <div style={{fontFamily: stamp, fontSize: size, letterSpacing: '0.2em', color, textShadow: shadow}}>{children}</div>
);
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 150, color = c.cream}) => (
  <div style={{fontFamily: stamp, fontSize: size, lineHeight: 0.92, color, textShadow: shadow, letterSpacing: '0.02em'}}>{children}</div>
);
const Script: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 96, color = c.cream}) => (
  <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: size, lineHeight: 1.02, color, textShadow: shadow}}>{children}</div>
);
const During: React.FC<{b: number; e: number; children: React.ReactNode; style?: React.CSSProperties}> = ({b, e, children, style}) => {
  const frame = useCurrentFrame();
  if (frame < F(b) || frame >= F(e)) return null;
  const out = interpolate(frame, [F(e) - 4, F(e)], [1, 0], clamp);
  return <AbsoluteFill style={{opacity: out, ...style}}>{children}</AbsoluteFill>;
};

// Round "MUG No. X" stamp
const MugStamp: React.FC<{at: number; n: number}> = ({at, n}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - F(at), fps: FPS, config: {damping: 11, stiffness: 240, mass: 0.6}});
  if (frame < F(at)) return null;
  return (
    <div style={{transform: `rotate(-12deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`, opacity: Math.min(1, p * 3), width: 300, height: 300, borderRadius: '50%',
      border: `8px solid ${c.goldBright}`, background: 'rgba(179,38,46,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.5)'}}>
      <div style={{fontFamily: stamp, fontSize: 64, letterSpacing: '0.12em', color: c.cream, lineHeight: 1}}>MUG</div>
      <div style={{fontFamily: stamp, fontSize: 120, color: c.goldBright, lineHeight: 0.9}}>No.{n}</div>
    </div>
  );
};

// Finale: the three mugs line up, viewers vote
const Lineup: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin((frame - F(LINEUP)) / 5) * 0.025;
  const mugs = ['mug1', 'mug2', 'mug3'];
  return (
    <AbsoluteFill style={{background: `radial-gradient(100% 70% at 50% 40%, #1d2f52, ${c.navyMid} 55%, ${c.navy})`, alignItems: 'center'}}>
      <div style={{marginTop: 250, textAlign: 'center'}}>
        <Pop at={LINEUP}><Kicker size={52}>THE LINEUP</Kicker></Pop>
        <Slam at={LINEUP + 3.5}><Big size={170} color={c.goldBright}>WHICH MUG WINS?</Big></Slam>
      </div>
      <div style={{position: 'relative', width: 1080, height: 560, marginTop: 30}}>
        {mugs.map((m, i) => {
          const at = LINEUP + 0.5 + i;
          const p = spring({frame: frame - F(at), fps: FPS, config: {damping: 15, stiffness: 200}});
          const x = 40 + i * 340;
          const rot = [-6, 2, 7][i];
          return (
            <div key={m} style={{position: 'absolute', left: x, top: interpolate(p, [0, 1], [700, 20]), opacity: p > 0.01 ? 1 : 0, transform: `rotate(${rot}deg)`,
              background: '#fbf8f1', padding: '14px 14px 70px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
              <Img src={staticFile(`${m}.jpg`)} style={{width: 290, height: 400, objectFit: 'cover', display: 'block'}} />
              <div style={{position: 'absolute', bottom: 8, width: 290, textAlign: 'center', fontFamily: stamp, fontSize: 52, color: c.navy}}>{i + 1}</div>
            </div>
          );
        })}
      </div>
      <Pop at={LINEUP + 5} style={{marginTop: 40}}>
        <div style={{transform: `scale(${pulse})`, background: c.gold, color: c.navy, fontFamily: stamp, fontSize: 54, letterSpacing: '0.1em', padding: '14px 40px', borderRadius: 999}}>
          COMMENT 1, 2 OR 3 & FOLLOW FOR MORE
        </div>
      </Pop>
      <Pop at={LINEUP + 6.5} style={{marginTop: 46, textAlign: 'center'}}>
        <div style={{fontFamily: stamp, fontSize: 58, letterSpacing: '0.25em', color: c.goldBright}}>EPIVAIL</div>
        <div style={{fontFamily: ui, fontSize: 30, color: c.cream, marginTop: 4}}>Charles Harrison, Epique Area/Growth Leader</div>
      </Pop>
    </AbsoluteFill>
  );
};

const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const total = F(TOTAL_BEAT);
  let beat = 0;
  while (beat < TOTAL_BEAT && F(beat + 1) <= frame) beat++;
  const idx = STARTS.findIndex((s, i) => beat >= s && beat < s + SEQ[i].len);
  const place = idx >= 0 ? SEQ[idx].place : '';
  return (
    <>
      {place && (
        <div style={{position: 'absolute', top: 76, left: 60, display: 'flex', alignItems: 'center', gap: 12, fontFamily: ui, fontSize: 30, color: c.cream, textShadow: shadow}}>
          <svg width="26" height="34" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0zm0 16a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" fill={c.goldBright} /></svg>
          {place}
        </div>
      )}
      <div style={{position: 'absolute', top: 70, right: 60, fontFamily: stamp, fontSize: 46, letterSpacing: '0.2em', color: c.gold, textShadow: shadow}}>EPIVAIL</div>
      <div style={{position: 'absolute', bottom: 0, left: 0, height: 10, width: `${(frame / total) * 100}%`, background: `linear-gradient(90deg, #8a6f2e, ${c.goldBright})`}} />
    </>
  );
};


const SFX: {b: number; src: string; vol: number}[] = [
  ...SEQ.flatMap((it, i) => {
    const b = STARTS[i];
    if (it.cap?.k === 'mug') return [{b: b + 1.5, src: 'impact-cine-big', vol: 0.25}];
    if (it.photo) return [{b, src: 'camera-shutter-hard', vol: 0.35}];
    if (it.cap?.k === 'chapter') return [{b: b + 0.9, src: 'bass-hit-short', vol: 0.35}];
    return [];
  }),
  {b: 3, src: 'bass-hit-short', vol: 0.45},
  {b: LINEUP + 0.5, src: 'camera-shutter-hard', vol: 0.3},
  {b: LINEUP + 1.5, src: 'camera-shutter-hard', vol: 0.3},
  {b: LINEUP + 2.5, src: 'camera-shutter-hard', vol: 0.3},
  {b: LINEUP + 5, src: 'sparkle-touch', vol: 0.35},
];

const Reel: React.FC = () => {
  const musicVol = (fr: number) => interpolate(fr, [0, 2, F(TOTAL_BEAT) - 45, F(TOTAL_BEAT)], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{background: c.navy, overflow: 'hidden'}}>
      <Audio src={staticFile('music.mp3')} volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, F(s.b))} durationInFrames={90}><Audio src={staticFile(`sfx/${s.src}.mp3`)} volume={s.vol} /></Sequence>
      ))}
      {SEQ.map((it, i) => {
        const from = Math.max(0, F(STARTS[i]) - (i ? XF : 0));
        const to = F(STARTS[i] + it.len);
        return <Sequence key={i} from={from} durationInFrames={to - from}><ShotView it={it} i={i} len={to - from} /></Sequence>;
      })}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0) 22%, rgba(10,22,40,0) 70%, rgba(10,22,40,0.55) 100%)'}} />
      {SEQ.map((it, i) => it.cap ? <CapView key={i} cap={it.cap} b={STARTS[i]} e={STARTS[i] + it.len} /> : null)}
      <During b={LINEUP} e={TOTAL_BEAT + 2}><Lineup /></During>
      <Chrome />
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <Composition id="Maerkte" component={Reel} durationInFrames={F(TOTAL_BEAT)} fps={FPS} width={1080} height={1920} />
));
