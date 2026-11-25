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
const BEAT = 0.4985;
const B = (n: number) => {
  const i = Math.floor(n);
  const base = (beats as number[])[i] ?? i * BEAT;
  return base + (n - i) * BEAT;
};
const F = (n: number) => Math.round(B(n) * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const LINEUP = 33, TOTAL_BEAT = 45;

type Shot = {b: number; e: number; src: string; from?: number; photo?: 'print' | 'printLand'; push?: 'in' | 'out' | 'punch'};
const SHOTS: Shot[] = [
  {b: 0, e: 4, src: 'c1123_192233', from: 1.5, push: 'in'},
  // ── No. 1 Heidelberg (night)
  {b: 4, e: 6, src: 'c1123_190912', from: 0.8, push: 'in'},
  {b: 6, e: 8, src: 'c1123_192002', from: 2.0, push: 'punch'},
  {b: 8, e: 10, src: 'c1123_192556', from: 0.3, push: 'punch'},
  {b: 10, e: 12, src: 'c1123_200140', from: 0.4, push: 'in'},
  {b: 12, e: 14, src: 'c1123_200216', from: 1.5, push: 'punch'},
  {b: 14, e: 16, src: 'selfie', photo: 'printLand'},
  {b: 16, e: 18, src: 'mug1', photo: 'print'},
  // ── No. 2 Mannheim (day)
  {b: 18, e: 20, src: 'c1124_113917', from: 0.3, push: 'in'},
  {b: 20, e: 22, src: 'c1124_112708', from: 0.4, push: 'punch'},
  {b: 22, e: 24, src: 'c1124_112834', from: 4.0, push: 'out'},
  {b: 24, e: 26, src: 'c1124_112950', from: 0.6, push: 'punch'},
  {b: 26, e: 28, src: 'c1124_163532', from: 0.6, push: 'out'},
  // ── No. 3 Rothenburg
  {b: 28, e: 30, src: 'c1125_140424', from: 0.5, push: 'in'},
  {b: 30, e: 33, src: 'c1125_143935', from: 0.6, push: 'in'},
];

const ShotView: React.FC<{s: Shot; i: number}> = ({s, i}) => {
  const frame = useCurrentFrame();
  const len = F(s.e) - F(s.b);
  const t = frame / Math.max(1, len);
  if (s.photo) {
    const land = s.photo === 'printLand';
    const p = spring({frame, fps: FPS, config: {damping: 16, stiffness: 180}});
    const rot = interpolate(p, [0, 1], [i % 2 ? 9 : -9, i % 2 ? 2.5 : -2.5]);
    const sc = interpolate(p, [0, 1], [1.25, 1]) * interpolate(t, [0, 1], [1, 1.05]);
    return (
      <AbsoluteFill style={{background: `radial-gradient(90% 60% at 50% 45%, ${c.navyLight}, ${c.navy})`, justifyContent: 'flex-start', alignItems: 'center', paddingTop: land ? 680 : 560}}>
        <div style={{transform: `rotate(${rot}deg) scale(${sc})`, background: '#fbf8f1', padding: '22px 22px 90px', boxShadow: '0 30px 80px rgba(0,0,0,0.55)'}}>
          <Img src={staticFile(`${s.src}.jpg`)} style={{width: land ? 920 : 720, height: land ? 690 : 1000, objectFit: 'cover', display: 'block'}} />
        </div>
      </AbsoluteFill>
    );
  }
  let scale = 1;
  if (s.push === 'in') scale = interpolate(t, [0, 1], [1.03, 1.14]);
  if (s.push === 'out') scale = interpolate(t, [0, 1], [1.16, 1.04]);
  if (s.push === 'punch') scale = interpolate(frame, [0, 6], [1.22, 1.06], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{transform: `scale(${scale})`}}>
      <OffthreadVideo src={staticFile(`${s.src}.mp4`)} startFrom={Math.round((s.from ?? 0) * FPS)} muted />
    </AbsoluteFill>
  );
};

const WHIPS = [4, 18, 28, LINEUP];
const useWhip = () => {
  const frame = useCurrentFrame();
  for (const b of WHIPS) {
    const d = frame - F(b);
    if (d >= -3 && d < 4) {
      const k = 1 - Math.abs(d + 0.5) / 4;
      return {blur: k * 22, x: (d < 0 ? -1 : 1) * k * 90};
    }
  }
  return {blur: 0, x: 0};
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

const Chapter: React.FC<{b: number; n: number; city: string; sub: string}> = ({b, n, city, sub}) => (
  <During b={b} e={b + 2} style={{paddingTop: 300, alignItems: 'center', textAlign: 'center', background: 'linear-gradient(180deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.45) 35%, rgba(10,22,40,0) 55%)'}}>
    <Pop at={b}><Kicker size={56}>{`MARKET No. ${n}`}</Kicker></Pop>
    <Slam at={b + 0.4}><Big size={180}>{city}</Big></Slam>
    <Pop at={b + 1}><Script size={70}>{sub}</Script></Pop>
  </During>
);

const Titles: React.FC = () => (
  <>
    <During b={0} e={4} style={{alignItems: 'center', paddingTop: 300, textAlign: 'center'}}>
      <Pop at={0}><Kicker>GERMANY · WEIHNACHTSMÄRKTE</Kicker></Pop>
      <Slam at={1}><Big size={170}>3 CHRISTMAS</Big></Slam>
      <Slam at={1.5}><Big size={170}>MARKETS.</Big></Slam>
      <Slam at={2.5}><Big size={210} color={c.goldBright}>3 MUGS.</Big></Slam>
    </During>
    <Chapter b={4} n={1} city="HEIDELBERG" sub="after dark" />
    <During b={8} e={10} style={{justifyContent: 'flex-end', paddingBottom: 520, alignItems: 'center'}}>
      <Pop at={8.3}><Script size={100}>carousels & lights</Script></Pop>
    </During>
    <During b={10} e={12} style={{paddingTop: 300, alignItems: 'center', textAlign: 'center'}}>
      <Pop at={10.3}><Kicker>GONDOLA HUTS??</Kicker></Pop>
      <Pop at={10.8}><Script size={100}>felt like home.</Script></Pop>
    </During>
    <During b={12} e={14} style={{justifyContent: 'flex-end', paddingBottom: 520, alignItems: 'center'}}>
      <Pop at={12.3}><Script size={100}>Santa's on the ride.</Script></Pop>
    </During>
    <During b={14} e={16} style={{paddingTop: 300, alignItems: 'center'}}>
      <Pop at={14.3}><Script size={100}>Glühwein date night.</Script></Pop>
    </During>
    <During b={16} e={18} style={{justifyContent: 'flex-end', alignItems: 'flex-end', padding: '0 70px 330px 0'}}>
      <MugStamp at={16.4} n={1} />
    </During>
    <Chapter b={18} n={2} city="MANNHEIM" sub="by the Wasserturm" />
    <During b={24} e={26} style={{justifyContent: 'flex-end', paddingBottom: 520, alignItems: 'center'}}>
      <Pop at={24.3}><Script size={100}>Santa, again.</Script></Pop>
    </During>
    <During b={26} e={28} style={{justifyContent: 'flex-end', alignItems: 'flex-end', padding: '0 70px 380px 0'}}>
      <MugStamp at={26.4} n={2} />
    </During>
    <Chapter b={28} n={3} city="ROTHENBURG" sub="ob der Tauber" />
    <During b={30} e={33} style={{paddingTop: 280, alignItems: 'center'}}>
      <Pop at={30.3}><Script size={90}>whipped cream. obviously.</Script></Pop>
    </During>
    <During b={30.8} e={33} style={{justifyContent: 'flex-end', alignItems: 'flex-end', padding: '0 70px 380px 0'}}>
      <MugStamp at={31} n={3} />
    </During>
  </>
);

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

const placeAt = (b: number) => (b >= 4 && b < 18 ? 'Heidelberg, DE' : b >= 18 && b < 28 ? 'Mannheim, DE' : b >= 28 && b < LINEUP ? 'Rothenburg o.d.T., DE' : null);
const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const total = F(TOTAL_BEAT);
  let beat = 0;
  while (beat < TOTAL_BEAT && F(beat + 1) <= frame) beat++;
  const place = placeAt(beat);
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
  {b: 1, src: 'bass-hit-short', vol: 0.5},
  {b: 2.5, src: 'bass-hit-short', vol: 0.55},
  ...WHIPS.map((b) => ({b: b - 0.25, src: 'swoosh-quick', vol: 0.4})),
  {b: 14, src: 'camera-shutter-hard', vol: 0.5},
  {b: 16, src: 'camera-shutter-hard', vol: 0.5},
  {b: 16.4, src: 'impact-cine-big', vol: 0.3},
  {b: 26.4, src: 'impact-cine-big', vol: 0.3},
  {b: 31, src: 'impact-cine-big', vol: 0.3},
  {b: LINEUP + 0.5, src: 'camera-shutter-hard', vol: 0.35},
  {b: LINEUP + 1.5, src: 'camera-shutter-hard', vol: 0.35},
  {b: LINEUP + 2.5, src: 'camera-shutter-hard', vol: 0.35},
  {b: LINEUP + 3.5, src: 'bass-hit-short', vol: 0.5},
  {b: LINEUP + 5, src: 'sparkle-touch', vol: 0.4},
];

const Reel: React.FC = () => {
  const w = useWhip();
  const musicVol = (fr: number) => interpolate(fr, [0, 3, F(TOTAL_BEAT) - 24, F(TOTAL_BEAT)], [0, 0.85, 0.85, 0], clamp);
  return (
    <AbsoluteFill style={{background: c.navy, overflow: 'hidden'}}>
      <Audio src={staticFile('music.mp3')} volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, F(s.b))} durationInFrames={90}><Audio src={staticFile(`sfx/${s.src}.mp3`)} volume={s.vol} /></Sequence>
      ))}
      <AbsoluteFill style={{transform: `translateX(${w.x}px)`, filter: w.blur > 0.5 ? `blur(${w.blur}px)` : undefined}}>
        {SHOTS.map((s, i) => (
          <Sequence key={i} from={F(s.b)} durationInFrames={F(s.e) - F(s.b)}><ShotView s={s} i={i} /></Sequence>
        ))}
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0) 22%, rgba(10,22,40,0) 70%, rgba(10,22,40,0.55) 100%)'}} />
        <Titles />
        <During b={LINEUP} e={TOTAL_BEAT + 2}><Lineup /></During>
      </AbsoluteFill>
      <Chrome />
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <Composition id="Maerkte" component={Reel} durationInFrames={F(TOTAL_BEAT)} fps={FPS} width={1080} height={1920} />
));
