import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, OffthreadVideo, Sequence, interpolate, registerRoot, spring, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadDM} from '@remotion/google-fonts/DMSans';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';

const displayI = loadCormorant('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;
const ui = loadDM('normal', {weights: ['700', '900'], subsets: ['latin', 'latin-ext']}).fontFamily;
const stamp = loadBebas('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']}).fontFamily;
const c = {navy: '#0a1628', navyMid: '#0f1f3d', navyLight: '#172847', gold: '#c9a84c', goldBright: '#e8c66a', cream: '#f5f0e8', red: '#b3262e'};
const FPS = 30;
const s = (t: number) => Math.round(t * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const VO_END = 34.7;
const END = 35.2;
const TOTAL = END + 5;
const shadow = '0 4px 24px rgba(0,0,0,0.75), 0 2px 4px rgba(0,0,0,0.6)';

// ── visuals ──
type Shot = {a: number; b: number; src: string; kind: 'video' | 'photo' | 'grid'; from?: number; focus?: [number, number]; zoom?: [number, number]};
const SHOTS: Shot[] = [
  {a: 0, b: 4.35, src: 'oface', kind: 'video', from: 0},
  {a: 4.35, b: 6.45, src: 'oglasses', kind: 'photo', focus: [0.5, 0.4], zoom: [1.0, 1.08]},
  {a: 6.45, b: 9.95, src: 'gluehwein', kind: 'video', from: 0},
  {a: 9.95, b: 11.75, src: 'bootmug', kind: 'video', from: 1.5},
  {a: 11.75, b: 13.95, src: 'oyard', kind: 'video', from: 0.5},
  {a: 13.95, b: 17.45, src: 'kinderpunsch', kind: 'photo', focus: [0.735, 0.745], zoom: [1.0, 2.6]},
  {a: 17.45, b: 19.1, src: 'olake', kind: 'photo', focus: [0.5, 0.4], zoom: [1.0, 1.08]},
  {a: 19.1, b: 22.35, src: 'otug', kind: 'video', from: 1.0},
  {a: 22.35, b: 25.75, src: 'mug_tree', kind: 'video', from: 0},
  {a: 25.75, b: 27.5, src: 'mug_sh', kind: 'video', from: 0.5},
  {a: 27.5, b: 32.65, src: 'grid', kind: 'grid'},
  {a: 32.65, b: END, src: 'oface', kind: 'video', from: 3.0},
];
const XF = 8;

const PhotoView: React.FC<{sh: Shot; len: number}> = ({sh, len}) => {
  const frame = useCurrentFrame();
  if (sh.src === 'kinderpunsch') {
    // glide in on the "Kinderpunsch" sign so it lands mid-screen, above the caption
    const t = interpolate(frame, [s(0.4), len * 0.75], [0, 1], {...clamp});
    const z = 1 + 1.3 * t;
    return (
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img src={staticFile('kinderpunsch.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${-584 * t}px, ${-1241 * t}px) scale(${z})`}} />
      </AbsoluteFill>
    );
  }
  const z = interpolate(frame, [0, len * 0.7], sh.zoom ?? [1, 1.06], {...clamp});
  const [fx, fy] = sh.focus ?? [0.5, 0.5];
  // image is cover-fit to 1080x1920 then zoomed about the focus point
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={staticFile(`${sh.src}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`, transformOrigin: `${fx * 100}% ${fy * 100}%`}} />
    </AbsoluteFill>
  );
};

const MUGS = ['mug_heid', 's_mug_mannheim', 's_mug_roth', 's_bootmug', 's_mug_sh', 's_mug_tree'];
const LABELS = ['Heidelberg', 'Mannheim', 'Rothenburg', 'Dinkelsbühl', 'Schwäbisch Hall', 'Bamberg'];
const Grid: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(100% 70% at 50% 40%, #1d2f52, ${c.navyMid} 55%, ${c.navy})`}}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', fontFamily: stamp, fontSize: 64, letterSpacing: '0.18em', color: c.goldBright}}>EXHIBIT A: ZE COLLECTION</div>
      <div style={{position: 'absolute', top: 380, left: 60, right: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34}}>
        {MUGS.map((m, i) => {
          const p = spring({frame: frame - i * 9, fps: FPS, config: {damping: 16, stiffness: 140}});
          return (
            <div key={m} style={{opacity: p, transform: `translateY(${(1 - p) * 80}px) rotate(${[-3, 2, -2, 3, -1, 2][i]}deg)`, background: '#fbf8f1', padding: '12px 12px 50px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', position: 'relative'}}>
              <Img src={staticFile(`${m}.jpg`)} style={{width: '100%', height: 330, objectFit: 'cover', display: 'block'}} />
              <div style={{position: 'absolute', bottom: 8, width: '100%', left: 0, textAlign: 'center', fontFamily: ui, fontWeight: 700, fontSize: 28, color: c.navy}}>{LABELS[i]}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{sh: Shot; i: number}> = ({sh, i}) => {
  const frame = useCurrentFrame();
  const len = s(sh.b - sh.a) + (i ? XF : 0);
  const fade = i === 0 ? 1 : interpolate(frame, [0, XF], [0, 1], clamp);
  let inner: React.ReactNode;
  if (sh.kind === 'photo') inner = <PhotoView sh={sh} len={len} />;
  else if (sh.kind === 'grid') inner = <Grid />;
  else {
    const z = interpolate(frame, [0, len], [1.02, 1.08]);
    inner = <AbsoluteFill style={{transform: `scale(${z})`}}><OffthreadVideo src={staticFile(`${sh.src}.mp4`)} startFrom={s(sh.from ?? 0)} muted /></AbsoluteFill>;
  }
  return <AbsoluteFill style={{opacity: fade}}>{inner}</AbsoluteFill>;
};

// ── captions: what Olaf says, phrase by phrase ──
const LINES: [number, number, string][] = [
  [0.0, 1.0, 'Guten Tag!'],
  [1.0, 4.35, 'I am Olaf, your official Weihnachtsmarkt expert.'],
  [4.35, 6.45, 'Lesson number vun: Glühwein.'],
  [6.45, 9.95, 'Hot red vine, viz cinnamon, cloves und orange.'],
  [9.95, 11.75, 'Zis is for ze grown-ups, ja?'],
  [11.75, 13.95, 'Lesson number two: Kinderpunsch.'],
  [13.95, 17.45, 'Hot fruit punch, same spices, zero alcohol.'],
  [17.45, 19.1, 'Zis is for ze kinder…'],
  [19.1, 22.35, '…und for ze designated drivers. Like me.'],
  [22.35, 25.75, 'Und ze mug? You pay a little Pfand. A deposit.'],
  [25.75, 27.5, 'Bring it back, you get your money.'],
  [27.5, 29.65, 'Or you keep it… like Charles.'],
  [29.65, 32.65, 'He has… how you say… a problem.'],
  [32.65, VO_END + 0.4, 'Prost!'],
];
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const line = LINES.find(([a, b]) => t >= a && t < b);
  if (!line) return null;
  const p = spring({frame: frame - s(line[0]), fps: FPS, config: {damping: 200, stiffness: 300}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 430, padding: '0 60px 430px'}}>
      <div style={{opacity: p, transform: `scale(${0.9 + p * 0.1})`, background: 'rgba(10,22,40,0.78)', borderRadius: 22, padding: '18px 30px', textAlign: 'center', border: `2px solid ${c.goldBright}`}}>
        <span style={{fontFamily: ui, fontWeight: 900, fontSize: 58, color: c.cream, lineHeight: 1.15}}>{line[2]}</span>
      </div>
    </AbsoluteFill>
  );
};

// ── big lesson titles ──
const Title: React.FC<{a: number; b: number; kicker: string; title: string; color?: string}> = ({a, b, kicker, title, color = c.goldBright}) => {
  const frame = useCurrentFrame();
  if (frame < s(a) || frame >= s(b)) return null;
  const p = spring({frame: frame - s(a), fps: FPS, config: {damping: 12, stiffness: 180, mass: 0.7}});
  const o = interpolate(frame, [s(b) - 8, s(b)], [1, 0], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 240, textAlign: 'center', opacity: o}}>
      <div style={{fontFamily: stamp, fontSize: 52, letterSpacing: '0.2em', color: c.cream, textShadow: shadow}}>{kicker}</div>
      <div style={{transform: `scale(${interpolate(p, [0, 1], [1.8, 1])})`, opacity: Math.min(1, p * 3), fontFamily: stamp, fontSize: 150, lineHeight: 0.95, color, textShadow: shadow}}>{title}</div>
    </AbsoluteFill>
  );
};
const Stamp: React.FC<{a: number; b: number; text: string; rot?: number; top?: number}> = ({a, b, text, rot = -10, top = 300}) => {
  const frame = useCurrentFrame();
  if (frame < s(a) || frame >= s(b)) return null;
  const p = spring({frame: frame - s(a), fps: FPS, config: {damping: 11, stiffness: 240, mass: 0.6}});
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: top}}>
      <div style={{transform: `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [2.6, 1])})`, opacity: Math.min(1, p * 3), border: `8px solid ${c.goldBright}`, borderRadius: 20, padding: '4px 34px', background: 'rgba(179,38,46,0.9)', fontFamily: stamp, fontSize: 110, color: c.cream, lineHeight: 1.05}}>{text}</div>
    </AbsoluteFill>
  );
};

const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const vol = (f: number) => interpolate(f, [0, 10, s(VO_END), s(VO_END) + 20, s(TOTAL) - 30, s(TOTAL)], [0, 0.12, 0.12, 0.4, 0.4, 0], clamp);
  const pulse = 1 + Math.sin((frame - s(END)) / 5) * 0.025;
  return (
    <AbsoluteFill style={{background: c.navy}}>
      <Audio src={staticFile('music.mp3')} volume={vol} />
      <Audio src={staticFile('vo.wav')} />
      {[[4.35, 'typewriter-hit-hard', 0.5], [11.75, 'typewriter-hit-hard', 0.5], [19.1, 'vinyl-scratch-small', 0.45], [29.65, 'typewriter-hit-hard', 0.6], [32.65, 'clap-single', 0.6]].map(([t, f, v], i) => (
        <Sequence key={i} from={s(t as number)} durationInFrames={60}><Audio src={staticFile(`sfx/${f}.mp3`)} volume={v as number} /></Sequence>
      ))}
      {SHOTS.map((sh, i) => {
        const from = Math.max(0, s(sh.a) - (i ? XF : 0));
        return <Sequence key={i} from={from} durationInFrames={s(sh.b) - from}><ShotView sh={sh} i={i} /></Sequence>;
      })}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0) 25%, rgba(10,22,40,0) 62%, rgba(10,22,40,0.55) 100%)', opacity: frame < s(END) ? 1 : 0}} />

      <Title a={0} b={4.35} kicker="WEIHNACHTSMARKT 101" title="PROFESSOR OLAF" />
      <Title a={4.35} b={6.45} kicker="LESSON 1" title="GLÜHWEIN" />
      <Stamp a={9.95} b={11.75} text="GROWN-UPS ONLY" />
      <Title a={11.75} b={13.95} kicker="LESSON 2" title="KINDERPUNSCH" />
      <Stamp a={19.1} b={22.35} text="DESIGNATED DRIVER" rot={-8} />
      <Title a={22.35} b={25.75} kicker="BONUS LESSON" title="ZE PFAND" />
      <Stamp a={29.65} b={32.65} text="A PROBLEM." rot={-12} top={1010} />
      <Title a={32.65} b={END} kicker="" title="PROST! 🍻" />
      {frame < s(END) && <Captions />}

      {frame >= s(END) && (
        <AbsoluteFill style={{background: `radial-gradient(100% 70% at 50% 35%, #1d2f52, ${c.navyMid} 50%, ${c.navy})`, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
          <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: 96, color: c.cream, lineHeight: 1.05}}>Glühwein or Kinderpunsch?</div>
          <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: 64, color: c.goldBright, marginTop: 14}}>Professor Olaf wants to know.</div>
          <div style={{marginTop: 50, transform: `scale(${pulse})`, background: c.gold, color: c.navy, fontFamily: stamp, fontSize: 54, letterSpacing: '0.12em', padding: '14px 40px', borderRadius: 999}}>COMMENT BELOW & FOLLOW FOR MORE</div>
          <div style={{marginTop: 60, fontFamily: stamp, fontSize: 60, letterSpacing: '0.25em', color: c.goldBright}}>EPIVAIL</div>
          <div style={{fontFamily: ui, fontWeight: 700, fontSize: 32, color: c.cream, marginTop: 6}}>Charles Harrison, Epique Area/Growth Leader</div>
        </AbsoluteFill>
      )}
      <div style={{position: 'absolute', top: 70, right: 60, fontFamily: stamp, fontSize: 46, letterSpacing: '0.2em', color: c.gold, textShadow: shadow}}>EPIVAIL</div>
    </AbsoluteFill>
  );
};

registerRoot(() => <Composition id="Olaf" component={Reel} durationInFrames={s(TOTAL)} fps={FPS} width={1080} height={1920} />);
