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
const c = {navy: '#0a1628', navyMid: '#0f1f3d', navyLight: '#172847', gold: '#c9a84c', goldBright: '#e8c66a', cream: '#f5f0e8', muted: '#7a8ba8', river: '#2c4a78'};

const FPS = 30;
const BEAT = 0.4876;
const B = (n: number) => {
  const i = Math.floor(n);
  const base = (beats as number[])[i] ?? i * BEAT;
  return base + (n - i) * BEAT;
};
const F = (n: number) => Math.round(B(n) * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const END_BEAT = 35, TOTAL_BEAT = 41;

type Shot = {b: number; e: number; src: string; from?: number; photo?: 'print' | 'printLand' | 'full'; push?: 'in' | 'out' | 'punch'};
const SHOTS: Shot[] = [
  {b: 0, e: 4, src: 'c113917', from: 0.3, push: 'in'},
  // 4–9: route map (drawn separately)
  {b: 9, e: 11, src: 'c112708', from: 0.5, push: 'in'},
  {b: 11, e: 13, src: 'c163532', from: 0.6, push: 'out'},
  {b: 13, e: 15, src: 'c112950', from: 0.6, push: 'punch'},
  {b: 15, e: 17, src: 'c114502', from: 1.2, push: 'punch'},
  {b: 17, e: 19, src: 'p4573a1f0', photo: 'print'},
  {b: 19, e: 21, src: 'c123042', from: 2.0, push: 'in'},
  {b: 21, e: 23, src: 'pae0f82e1', photo: 'printLand'},
  {b: 23, e: 25, src: 'c144902', from: 1.0, push: 'in'},
  {b: 25, e: 26, src: 'c145241', from: 1.0, push: 'punch'},
  {b: 26, e: 27, src: 'pf0057285', photo: 'full'},
  {b: 27, e: 29, src: 'c150326', from: 0.8, push: 'punch'},
  {b: 29, e: 32, src: 'c155158', from: 6.5, push: 'in'},
  {b: 32, e: 35, src: 'p73d254f2', photo: 'full'},
];

const ShotView: React.FC<{s: Shot; i: number}> = ({s, i}) => {
  const frame = useCurrentFrame();
  const len = F(s.e) - F(s.b);
  const t = frame / Math.max(1, len);
  if (s.photo === 'full') {
    const sc = s.e - s.b > 1 ? interpolate(t, [0, 1], [1.02, 1.12]) : interpolate(frame, [0, 6], [1.2, 1.05], {...clamp, easing: Easing.out(Easing.cubic)});
    return <AbsoluteFill style={{transform: `scale(${sc})`}}><Img src={staticFile(`${s.src}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></AbsoluteFill>;
  }
  if (s.photo) {
    const land = s.photo === 'printLand';
    const p = spring({frame, fps: FPS, config: {damping: 16, stiffness: 180}});
    const rot = interpolate(p, [0, 1], [i % 2 ? 9 : -9, i % 2 ? 2.5 : -2.5]);
    const sc = interpolate(p, [0, 1], [1.25, 1]) * interpolate(t, [0, 1], [1, 1.05]);
    return (
      <AbsoluteFill style={{background: `radial-gradient(90% 60% at 50% 45%, ${c.navyLight}, ${c.navy})`, justifyContent: 'flex-start', alignItems: 'center', paddingTop: land ? 720 : 560}}>
        <div style={{transform: `rotate(${rot}deg) scale(${sc})`, background: '#fbf8f1', padding: '22px 22px 90px', boxShadow: '0 30px 80px rgba(0,0,0,0.55)'}}>
          <Img src={staticFile(`${s.src}.jpg`)} style={{width: land ? 900 : 720, height: land ? 675 : 1000, objectFit: 'cover', display: 'block'}} />
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

// ── Route map: Mannheim → Worms → Heidelberg (stylized, not to scale) ──
const PTS = {mannheim: [600, 760], worms: [250, 610], heidelberg: [840, 1120]} as const;
const ROUTE = `M ${PTS.mannheim[0]} ${PTS.mannheim[1]} C 470 640, 360 590, ${PTS.worms[0]} ${PTS.worms[1]} C 360 860, 640 1080, ${PTS.heidelberg[0]} ${PTS.heidelberg[1]}`;
const RouteMap: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [F(4.4), F(8.2)], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const dot = (at: number, [x, y]: readonly [number, number]) => {
    const p = spring({frame: frame - F(at), fps: FPS, config: {damping: 12, stiffness: 260}});
    return <circle cx={x} cy={y} r={22 * p} fill={c.goldBright} stroke={c.navy} strokeWidth={6} />;
  };
  return (
    <AbsoluteFill style={{background: `radial-gradient(100% 70% at 50% 40%, #1d2f52, ${c.navyMid} 55%, ${c.navy})`}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        {/* Rhine and Neckar, stylized */}
        <path d="M 430 300 C 400 520, 470 700, 420 900 S 380 1300, 430 1600" stroke={c.river} strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.8} />
        <path d="M 440 820 C 600 860, 720 1000, 1000 1060" stroke={c.river} strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.7} />
        <path d={ROUTE} stroke={c.goldBright} strokeWidth={10} fill="none" strokeDasharray="1" pathLength={1} strokeDashoffset={draw} strokeLinecap="round" />
        {dot(4.4, PTS.mannheim)}
        {dot(6.3, PTS.worms)}
        {dot(8.0, PTS.heidelberg)}
      </svg>
      <Label at={4.5} x={PTS.mannheim[0] + 40} y={PTS.mannheim[1] - 30} title="MANNHEIM" sub="Turley Barracks: stationed here, way back" />
      <Label at={6.4} x={PTS.worms[0] - 60} y={PTS.worms[1] - 150} title="WORMS" />
      <Label at={8.0} x={PTS.heidelberg[0] - 380} y={PTS.heidelberg[1] + 50} title="HEIDELBERG" sub="home base" right />
      <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center'}}>
        <Pop at={4.2}><Kicker>TODAY'S LOOP</Kicker></Pop>
      </div>
    </AbsoluteFill>
  );
};
const Label: React.FC<{at: number; x: number; y: number; title: string; sub?: string; right?: boolean}> = ({at, x, y, title, sub, right}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 420, textAlign: right ? 'right' : 'left'}}>
    <Pop at={at} dy={20}><div style={{fontFamily: stamp, fontSize: 66, letterSpacing: '0.12em', color: c.cream}}>{title}</div></Pop>
    {sub && <Pop at={at + 0.5} dy={20}><div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: 44, color: c.goldBright, lineHeight: 1.05}}>{sub}</div></Pop>}
  </div>
);

const WHIPS = [4, 9, 17, 23, 29];
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
const During: React.FC<{b: number; e: number; children: React.ReactNode; style?: React.CSSProperties}> = ({b, e, children, style}) => {
  const frame = useCurrentFrame();
  if (frame < F(b) || frame >= F(e)) return null;
  const out = interpolate(frame, [F(e) - 4, F(e)], [1, 0], clamp);
  return <AbsoluteFill style={{opacity: out, ...style}}>{children}</AbsoluteFill>;
};

const Titles: React.FC = () => (
  <>
    <During b={0} e={4} style={{alignItems: 'center', paddingTop: 300, textAlign: 'center'}}>
      <Pop at={0}><Kicker>PART TWO</Kicker></Pop>
      <Slam at={1}><Big size={190}>ROAD TRIP</Big></Slam>
      <Pop at={2.5}><Kicker color={c.cream} size={48}>ONE DAY · THREE TOWNS</Kicker></Pop>
    </During>
    <During b={9} e={11} style={{paddingTop: 300, paddingLeft: 70}}>
      <Pop at={9.3}><Kicker>MANNHEIM</Kicker></Pop>
      <Pop at={9.8}><Script size={100}>Christmas market</Script></Pop>
      <Pop at={10.3}><Script size={100}>at the Wasserturm.</Script></Pop>
    </During>
    <During b={11} e={13} style={{justifyContent: 'flex-end', paddingBottom: 470, alignItems: 'center', textAlign: 'center', paddingLeft: 50, paddingRight: 50}}>
      <Pop at={11.2}><Kicker>SOUVENIR SECURED</Kicker></Pop>
      <Pop at={11.6}><Script size={100}>the market mug, Wasserturm and all.</Script></Pop>
    </During>
    <During b={13} e={15} style={{justifyContent: 'flex-end', paddingBottom: 520, alignItems: 'center'}}>
      <Pop at={13.3}><Script size={104}>met the big guy.</Script></Pop>
    </During>
    <During b={15} e={17} style={{justifyContent: 'flex-end', paddingBottom: 520, alignItems: 'center'}}>
      <Slam at={15.3}><Big size={140} color={c.goldBright}>DANCE BREAK!</Big></Slam>
    </During>
    <During b={17} e={23} style={{paddingTop: 260, alignItems: 'center', textAlign: 'center'}}>
      <Pop at={17.3}><Kicker>WORMS</Kicker></Pop>
      <Pop at={17.8}><Script size={100}>over the Rhine…</Script></Pop>
    </During>
    <During b={21} e={23} style={{paddingTop: 460, alignItems: 'center'}}>
      <Pop at={21.3}><Script size={84} color={c.goldBright}>a cathedral in the fog.</Script></Pop>
    </During>
    <During b={23} e={25} style={{paddingTop: 300, alignItems: 'center', textAlign: 'center'}}>
      <Pop at={23.2}><Kicker>BACK IN</Kicker></Pop>
      <Slam at={23.6}><Big size={170}>HEIDELBERG</Big></Slam>
    </During>
    <During b={25} e={29} style={{justifyContent: 'flex-end', paddingBottom: 520, alignItems: 'center', textAlign: 'center'}}>
      <Pop at={25.3}><Big size={120}>BRATWURST</Big></Pop>
      <Pop at={26.3}><Big size={120} color={c.goldBright}>& A BEER FLIGHT</Big></Pop>
      <Pop at={27.5}><Script size={80}>earned it.</Script></Pop>
    </During>
    <During b={29} e={32} style={{paddingTop: 300, paddingLeft: 70}}>
      <Pop at={29.3}><Kicker>GOLDEN HOUR</Kicker></Pop>
      <Pop at={29.8}><Script size={110}>one more stroll.</Script></Pop>
    </During>
    <During b={32} e={35} style={{justifyContent: 'flex-end', paddingBottom: 520, alignItems: 'center'}}>
      <Pop at={32.4}><Script size={110}>home base tonight.</Script></Pop>
    </During>
  </>
);

const End: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin((frame - F(END_BEAT)) / 5) * 0.025;
  return (
    <AbsoluteFill style={{background: `radial-gradient(100% 70% at 50% 35%, #1d2f52, ${c.navyMid} 50%, ${c.navy})`, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <Pop at={END_BEAT}><Kicker size={46}>GERMANY · PART TWO</Kicker></Pop>
      <Slam at={END_BEAT + 0.6}><Big size={210} color={c.goldBright}>MORE TO COME!</Big></Slam>
      <Pop at={END_BEAT + 1.4}><Script size={84}>stay tuned, y'all…</Script></Pop>
      <Pop at={END_BEAT + 2.2} style={{marginTop: 50}}>
        <div style={{transform: `scale(${pulse})`, background: c.gold, color: c.navy, fontFamily: stamp, fontSize: 54, letterSpacing: '0.12em', padding: '14px 40px', borderRadius: 999}}>
          COMMENT BELOW & FOLLOW FOR MORE
        </div>
      </Pop>
      <Pop at={END_BEAT + 3} style={{marginTop: 70}}>
        <div style={{fontFamily: stamp, fontSize: 64, letterSpacing: '0.25em', color: c.goldBright}}>EPIVAIL</div>
        <div style={{fontFamily: ui, fontSize: 32, color: c.cream, marginTop: 6}}>Charles Harrison, Epique Area/Growth Leader</div>
      </Pop>
    </AbsoluteFill>
  );
};

const placeAt = (b: number) => (b < 4 || (b >= 9 && b < 17) ? 'Mannheim, DE' : b >= 17 && b < 23 ? 'Worms, DE' : b >= 23 && b < END_BEAT ? 'Heidelberg, DE' : null);
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
  {b: 1, src: 'bass-hit-short', vol: 0.55},
  ...WHIPS.map((b) => ({b: b - 0.25, src: 'swoosh-quick', vol: 0.45})),
  {b: 4.4, src: 'sparkle-touch', vol: 0.35},
  {b: 11, src: 'camera-shutter-hard', vol: 0.4},
  {b: 15.3, src: 'bass-hit-short', vol: 0.45},
  {b: 17, src: 'camera-shutter-hard', vol: 0.55},
  {b: 21, src: 'camera-shutter-hard', vol: 0.55},
  {b: 23.6, src: 'impact-cine-big', vol: 0.35},
  {b: END_BEAT - 0.25, src: 'air-whoosh-powerful', vol: 0.35},
  {b: END_BEAT + 0.6, src: 'bass-hit-short', vol: 0.5},
  {b: END_BEAT + 2.2, src: 'sparkle-touch', vol: 0.4},
];

const Reel: React.FC = () => {
  const w = useWhip();
  const musicVol = (fr: number) => interpolate(fr, [0, 3, F(TOTAL_BEAT) - 24, F(TOTAL_BEAT)], [0, 0.9, 0.9, 0], clamp);
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
        <During b={4} e={9}><RouteMap /></During>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0) 22%, rgba(10,22,40,0) 70%, rgba(10,22,40,0.55) 100%)'}} />
        <Titles />
        <During b={END_BEAT} e={TOTAL_BEAT + 2}><End /></During>
      </AbsoluteFill>
      <Chrome />
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <Composition id="RoadTrip" component={Reel} durationInFrames={F(TOTAL_BEAT)} fps={FPS} width={1080} height={1920} />
));
