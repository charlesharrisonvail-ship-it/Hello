import React from 'react';
import {
  AbsoluteFill, Audio, Composition, Easing, Img, OffthreadVideo, Sequence, interpolate, registerRoot,
  spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadDM} from '@remotion/google-fonts/DMSans';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import beats from './beats.json';

const displayI = loadCormorant('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;
const ui = loadDM('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const stamp = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const c = {navy: '#0a1628', navyMid: '#0f1f3d', navyLight: '#172847', gold: '#c9a84c', goldBright: '#e8c66a', cream: '#f5f0e8', muted: '#7a8ba8'};

const FPS = 30;
const B = (n: number) => (beats as number[])[n] ?? n * 0.4876; // seconds of beat n
const F = (n: number) => Math.round(B(n) * FPS);               // frame of beat n
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const END_BEAT = 50, TOTAL_BEAT = 59;

type Shot = {b: number; e: number; src: string; from?: number; photo?: boolean; push?: 'in' | 'out' | 'punch'; rate?: number};
const SHOTS: Shot[] = [
  {b: 0, e: 4, src: 'c145033', from: 0.2, push: 'in'},
  {b: 4, e: 8, src: 'c145117', from: 1.0, push: 'in'},
  {b: 8, e: 12, src: 'c145302', from: 0.8, push: 'out'},
  {b: 12, e: 16, src: 'c145634', from: 1.3, push: 'in'},
  {b: 16, e: 20, src: 'p170f4907', photo: true},
  {b: 20, e: 24, src: 'c144925', from: 0.1, push: 'in'},
  {b: 24, e: 28, src: 'c150827', from: 0.3, push: 'out'},
  {b: 28, e: 32, src: 'p75de6c5e', photo: true},
  // the lift: one-beat Christmas run
  {b: 32, e: 33, src: 'c143912', from: 1.2, push: 'punch'},
  {b: 33, e: 34, src: 'c144624', from: 0.4, push: 'punch'},
  {b: 34, e: 35, src: 'c144418', from: 0.6, push: 'punch'},
  {b: 35, e: 36, src: 'c144222', from: 0.5, push: 'punch'},
  {b: 36, e: 37, src: 'c150529', from: 0.6, push: 'punch'},
  {b: 37, e: 38, src: 'c144719', from: 0.5, push: 'punch'},
  {b: 38, e: 39, src: 'c144448', from: 0.3, push: 'punch'},
  {b: 39, e: 40, src: 'c142605', from: 0.8, push: 'punch'},
  {b: 40, e: 46, src: 'c145654', from: 4.0, push: 'in'},
  {b: 46, e: 50, src: 'pd24ef66c', photo: true},
];

const ShotView: React.FC<{s: Shot; i: number}> = ({s, i}) => {
  const frame = useCurrentFrame(); // local to Sequence
  const len = F(s.e) - F(s.b);
  const t = frame / Math.max(1, len);
  let scale = 1.0;
  if (s.push === 'in') scale = interpolate(t, [0, 1], [1.03, 1.14]);
  if (s.push === 'out') scale = interpolate(t, [0, 1], [1.16, 1.04]);
  if (s.push === 'punch') scale = interpolate(frame, [0, 6], [1.22, 1.06], {...clamp, easing: Easing.out(Easing.cubic)});
  if (s.photo) {
    // snapshot: photo drops in as a print, then slowly drifts
    const {fps} = {fps: FPS};
    const p = spring({frame, fps, config: {damping: 16, stiffness: 180}});
    const rot = interpolate(p, [0, 1], [i % 2 ? 9 : -9, i % 2 ? 2.5 : -2.5]);
    const sc = interpolate(p, [0, 1], [1.25, 1]) * interpolate(t, [0, 1], [1, 1.05]);
    return (
      <AbsoluteFill style={{background: `radial-gradient(90% 60% at 50% 45%, ${c.navyLight}, ${c.navy})`, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 560}}>
        <div style={{transform: `rotate(${rot}deg) scale(${sc})`, background: '#fbf8f1', padding: '22px 22px 90px', boxShadow: '0 30px 80px rgba(0,0,0,0.55)'}}>
          <Img src={staticFile(`${s.src}.jpg`)} style={{width: 720, height: 1000, objectFit: 'cover', display: 'block'}} />
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{transform: `scale(${scale})`}}>
      <OffthreadVideo src={staticFile(`${s.src}.mp4`)} startFrom={Math.round((s.from ?? 0) * FPS)} playbackRate={s.rate ?? 1} muted />
    </AbsoluteFill>
  );
};

// whip blur on selected cuts
const WHIPS = [4, 20, 32, 40];
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

const shadow = '0 4px 24px rgba(0,0,0,0.65), 0 2px 4px rgba(0,0,0,0.5)';
const Kicker: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = c.goldBright, size = 50}) => (
  <div style={{fontFamily: stamp, fontSize: size, letterSpacing: '0.2em', color, textShadow: shadow}}>{children}</div>
);
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 150, color = c.cream}) => (
  <div style={{fontFamily: stamp, fontSize: size, lineHeight: 0.92, color, textShadow: shadow, letterSpacing: '0.02em'}}>{children}</div>
);
const Script: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 96, color = c.cream}) => (
  <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: size, lineHeight: 1.02, color, textShadow: shadow}}>{children}</div>
);
// Visible only within [b, e) beats
const During: React.FC<{b: number; e: number; children: React.ReactNode; style?: React.CSSProperties}> = ({b, e, children, style}) => {
  const frame = useCurrentFrame();
  if (frame < F(b) || frame >= F(e)) return null;
  const out = interpolate(frame, [F(e) - 4, F(e)], [1, 0], clamp);
  return <AbsoluteFill style={{opacity: out, ...style}}>{children}</AbsoluteFill>;
};

const Titles: React.FC = () => (
  <>
    <During b={0} e={4} style={{alignItems: 'center', paddingTop: 300, textAlign: 'center'}}>
      <Pop at={0}><Kicker>SUNDAY OFFICE</Kicker></Pop>
      <Slam at={2}><Big size={190}>HEIDELBERG</Big></Slam>
      <Pop at={2.5}><Kicker color={c.cream} size={44}>GERMANY</Kicker></Pop>
    </During>
    <During b={4} e={8} style={{justifyContent: 'flex-end', paddingBottom: 520, paddingLeft: 70}}>
      <Pop at={4.5}><Kicker>TODAY'S COMMUTE</Kicker></Pop>
      <Pop at={5}><Script size={110}>the Old Bridge.</Script></Pop>
    </During>
    <During b={8} e={12} style={{paddingTop: 300, paddingLeft: 70}}>
      <Pop at={8.5}><Kicker>VIEW FROM THE DESK</Kicker></Pop>
      <Pop at={9}><Script size={110}>not bad, huh?</Script></Pop>
    </During>
    <During b={12} e={16} style={{justifyContent: 'flex-end', paddingBottom: 520, alignItems: 'center', textAlign: 'center'}}>
      <Pop at={12.5}><Kicker>LOCAL CO-WORKER</Kicker></Pop>
      <Slam at={13}><Big size={150}>THE BRIDGE MONKEY</Big></Slam>
    </During>
    <During b={16} e={20} style={{alignItems: 'center', textAlign: 'center', padding: '200px 60px 0'}}>
      <Pop at={16.5}><Script size={88}>“What are you gawking at me for?”</Script></Pop>
      <Pop at={18}><Kicker color={c.goldBright} size={38}>HIS PLAQUE, ROUGHLY TRANSLATED</Kicker></Pop>
    </During>
    <During b={20} e={24} style={{paddingTop: 300, alignItems: 'center', textAlign: 'center'}}>
      <Pop at={20.5}><Kicker>NOVEMBER IN THE ALTSTADT</Kicker></Pop>
      <Pop at={21}><Script size={110}>busy, buzzing, beautiful.</Script></Pop>
    </During>
    <During b={28} e={32} style={{alignItems: 'center', paddingTop: 300}}>
      <Pop at={28.5}><Script size={110} color={c.goldBright}>get lost on purpose.</Script></Pop>
    </During>
    <During b={32} e={40} style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <Slam at={32}><Big size={150}>CHRISTMAS</Big></Slam>
      <Pop at={33}><Big size={150} color={c.goldBright}>ON EVERY</Big></Pop>
      <Pop at={34}><Big size={150}>CORNER</Big></Pop>
    </During>
    <During b={40} e={46} style={{paddingTop: 300, paddingLeft: 70}}>
      <Slam at={40} style={{transformOrigin: 'left'}}><Big size={170}>WORK HARD.</Big></Slam>
      <Slam at={42} style={{transformOrigin: 'left'}}><Big size={170} color={c.goldBright}>WANDER OFTEN.</Big></Slam>
    </During>
    <During b={46} e={50} style={{alignItems: 'center', paddingTop: 300}}>
      <Pop at={46.5}><Script size={100}>that's the lifestyle.</Script></Pop>
    </During>
  </>
);

const End: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin((frame - F(END_BEAT)) / 5) * 0.025;
  return (
    <AbsoluteFill style={{background: `radial-gradient(100% 70% at 50% 35%, #1d2f52, ${c.navyMid} 50%, ${c.navy})`, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <Pop at={END_BEAT}><Kicker size={46}>NEXT STOP?</Kicker></Pop>
      <Slam at={END_BEAT + 1}><Script size={120}>Where should I go next?</Script></Slam>
      <Pop at={END_BEAT + 3} style={{marginTop: 50}}>
        <div style={{transform: `scale(${pulse})`, background: c.gold, color: c.navy, fontFamily: stamp, fontSize: 54, letterSpacing: '0.12em', padding: '14px 40px', borderRadius: 999}}>
          COMMENT BELOW & FOLLOW FOR MORE
        </div>
      </Pop>
      <Pop at={END_BEAT + 4} style={{marginTop: 70}}>
        <div style={{fontFamily: stamp, fontSize: 64, letterSpacing: '0.25em', color: c.goldBright}}>EPIVAIL</div>
        <div style={{fontFamily: ui, fontSize: 32, color: c.cream, marginTop: 6}}>Charles Harrison, Epique Area/Growth Leader</div>
      </Pop>
    </AbsoluteFill>
  );
};

const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const total = F(TOTAL_BEAT);
  const pin = frame < F(END_BEAT);
  return (
    <>
      {pin && (
        <div style={{position: 'absolute', top: 76, left: 60, display: 'flex', alignItems: 'center', gap: 12, fontFamily: ui, fontSize: 30, color: c.cream, textShadow: shadow}}>
          <svg width="26" height="34" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0zm0 16a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" fill={c.goldBright} /></svg>
          Heidelberg, DE
        </div>
      )}
      <div style={{position: 'absolute', top: 70, right: 60, fontFamily: stamp, fontSize: 46, letterSpacing: '0.2em', color: c.gold, textShadow: shadow}}>EPIVAIL</div>
      <div style={{position: 'absolute', bottom: 0, left: 0, height: 10, width: `${(frame / total) * 100}%`, background: `linear-gradient(90deg, #8a6f2e, ${c.goldBright})`}} />
    </>
  );
};

const SFX: {b: number; src: string; vol: number}[] = [
  {b: 2, src: 'bass-hit-short', vol: 0.55},
  ...WHIPS.map((b) => ({b: b - 0.25, src: 'swoosh-quick', vol: 0.45})),
  {b: 13, src: 'bass-hit-short', vol: 0.4},
  {b: 16, src: 'camera-shutter-hard', vol: 0.55},
  {b: 28, src: 'camera-shutter-hard', vol: 0.55},
  {b: 32, src: 'impact-cine-big', vol: 0.4},
  {b: 40, src: 'bass-hit-short', vol: 0.5},
  {b: 42, src: 'bass-hit-short', vol: 0.5},
  {b: 46, src: 'camera-shutter-hard', vol: 0.55},
  {b: END_BEAT - 0.25, src: 'air-whoosh-powerful', vol: 0.35},
  {b: END_BEAT + 3, src: 'sparkle-touch', vol: 0.4},
];

const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const w = useWhip();
  const flash = interpolate(frame, [F(32), F(32) + 5], [0.6, 0], clamp) * (frame >= F(32) ? 1 : 0);
  const musicVol = (fr: number) => interpolate(fr, [0, 3, F(TOTAL_BEAT) - 30, F(TOTAL_BEAT)], [0, 0.9, 0.9, 0], clamp);
  return (
    <AbsoluteFill style={{background: c.navy, overflow: 'hidden'}}>
      <Audio src={staticFile('music.mp3')} volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(B(Math.floor(s.b)) * FPS + (s.b % 1) * 0.4876 * FPS))} durationInFrames={90}>
          <Audio src={staticFile(`sfx/${s.src}.mp3`)} volume={s.vol} />
        </Sequence>
      ))}
      <AbsoluteFill style={{transform: `translateX(${w.x}px)`, filter: w.blur > 0.5 ? `blur(${w.blur}px)` : undefined}}>
        {SHOTS.map((s, i) => (
          <Sequence key={i} from={F(s.b)} durationInFrames={F(s.e) - F(s.b)}><ShotView s={s} i={i} /></Sequence>
        ))}
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0) 22%, rgba(10,22,40,0) 70%, rgba(10,22,40,0.55) 100%)'}} />
        <Titles />
        <During b={END_BEAT} e={TOTAL_BEAT + 2}><End /></During>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
      <Chrome />
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <Composition id="Heidelberg" component={Reel} durationInFrames={F(TOTAL_BEAT)} fps={FPS} width={1080} height={1920} />
));
