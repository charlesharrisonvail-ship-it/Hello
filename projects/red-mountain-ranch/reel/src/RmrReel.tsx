import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, Easing,
} from 'remotion';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import { brand } from './lib/brand';
import { Arrow, Captions, Chip, CodeCard, Headline, Texture, Tile, useIn, usePop } from './components/bits';
import { Presenter } from './components/Presenter';

const C = brand.colors;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Scene boundaries (frames @30fps). 30 seconds total.
const S = { hero: 0, homes: 150, built: 330, story: 510, talk: 720, end: 900 };

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([
      '800 40px Manrope', '700 40px Manrope', '500 40px Manrope',
      'italic 500 40px "Cormorant Garamond"', '500 40px "Cormorant Garamond"',
      '400 40px "JetBrains Mono"', '500 40px "JetBrains Mono"',
    ].map((s) => document.fonts.load(s))).then(() => continueRender(handle));
  }, [handle]);
};

const SceneIn: React.FC<{ children: React.ReactNode; bg: string }> = ({ children, bg }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: bg, opacity: p, transform: `scale(${1.04 - 0.04 * p})` }}>{children}</AbsoluteFill>
  );
};

const Eyebrow: React.FC<{ text: string; color: string; delay?: number }> = ({ text, color, delay = 0 }) => {
  const p = useIn(delay, 12);
  return (
    <div style={{
      position: 'absolute', left: 64, top: 200, display: 'flex', alignItems: 'center', gap: 18, opacity: p,
      fontFamily: brand.fonts.mono, fontSize: 26, letterSpacing: '0.16em', textTransform: 'uppercase', color,
    }}>
      <span style={{ width: 70 * p, height: 3, background: color, display: 'inline-block' }} />{text}
    </div>
  );
};

/* ——— Icons for diagram tiles ——— */
const I = {
  bolt: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48"><path d="M27 4L10 27h12l-3 17 18-24H25z" fill={c} stroke={c} strokeWidth="2" strokeLinejoin="round" /></svg>),
  sun: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48"><circle cx="24" cy="20" r="7" fill={c} />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (<line key={a} x1="24" y1="20" x2={24 + 12 * Math.cos((a * Math.PI) / 180)} y2={20 + 12 * Math.sin((a * Math.PI) / 180)} stroke={c} strokeWidth="3" strokeLinecap="round" strokeDasharray="0 8 4" />))}<path d="M6 42l8-10h20l8 10z" fill="none" stroke={c} strokeWidth="3" strokeLinejoin="round" /><path d="M16 37h16" stroke={c} strokeWidth="2.5" /></svg>),
  leaf: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48"><path d="M10 38C8 20 22 8 40 8c0 18-12 32-30 30z" fill="none" stroke={c} strokeWidth="3.5" strokeLinejoin="round" /><path d="M10 38L30 18" stroke={c} strokeWidth="3" strokeLinecap="round" /></svg>),
  peak: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48"><path d="M4 40l14-22 7 10 6-8 13 20z" fill="none" stroke={c} strokeWidth="3.5" strokeLinejoin="round" /><path d="M6 44c6-3 10 3 16 0s10 3 20 0" fill="none" stroke={C.river} strokeWidth="3" strokeLinecap="round" /></svg>),
  browser: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48"><rect x="5" y="8" width="38" height="32" rx="4" fill="none" stroke={c} strokeWidth="3.5" /><path d="M5 16h38" stroke={c} strokeWidth="3" /><circle cx="10" cy="12" r="1.6" fill={c} /><circle cx="15" cy="12" r="1.6" fill={c} /><path d="M11 33l7-9 5 6 4-4 8 7" fill="none" stroke={c} strokeWidth="3" strokeLinejoin="round" /></svg>),
  list: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48">{[12, 24, 36].map((y) => (<g key={y}><circle cx="10" cy={y} r="3.4" fill={c} /><path d={`M18 ${y}h22`} stroke={c} strokeWidth="3.5" strokeLinecap="round" /></g>))}</svg>),
};

/* ——— Full-bleed photo with a slow push ——— */
// `video` is an AI-motion clip made from the same real photo (Higgsfield, Kling
// image-to-video); the still is the fallback when no clip is set.
const Hero: React.FC<{ src: string; video?: string; rate?: number; pos?: string; dim?: number }> = ({ src, video, rate = 1, pos = '38% 50%', dim = 0.55 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {video ? (
        <OffthreadVideo src={staticFile(video)} muted playbackRate={rate} style={{
          position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        }} />
      ) : (
        <Img src={staticFile(src)} style={{
          position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos,
          transform: `scale(${1.18 - f * 0.0006}) translateX(${f * 0.08}px)`,
        }} />
      )}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(14,22,19,${dim + 0.15}) 0%, rgba(14,22,19,${dim * 0.75}) 34%, rgba(14,22,19,${dim * 0.4}) 52%, rgba(14,22,19,${dim * 0.9}) 72%, rgba(14,22,19,0.92) 100%)` }} />
    </>
  );
};

/* ——— Scene 1: hero ——— */
const SceneHero: React.FC = () => (
  <SceneIn bg={C.pine}>
    <Hero src="eagle-river-eagle-1600.webp" video="rmr-river-motion.mp4" pos="30% 50%" />
    <Texture dark />
    <Eyebrow text="Red Mountain Ranch · Eagle, CO" color={C.bronzeLt} delay={4} />
    <Headline top={290} size={124} color={C.ivory} accent={C.bronzeLt} start={10} lines={[
      [{ t: 'Home,' }, { t: 'on' }, { t: 'the' }],
      [{ t: 'Eagle', accent: true }, { t: 'River.', accent: true }],
    ]} />
    <Chip text="66 homes · 3–4 bedrooms" x={470} y={660} rot={4} delay={40} tone="light" />
    <Chip text="approved Mar 24, 2026" x={80} y={790} rot={-4} delay={58} tone="rust" />
    <Chip text="17.5 acres on the river" x={380} y={920} rot={-2} delay={78} tone="bronze" />
    <Chip text="a concept by EpiVail" x={120} y={1060} rot={3} delay={98} tone="dark" />
    <div style={{ position: 'absolute', right: 180, top: 1240, fontFamily: brand.fonts.ui, fontSize: 20, color: 'rgba(245,240,230,0.62)' }}>
      Eagle River in Eagle, not the ranch site · Photo: Jeffrey Beall, CC BY 4.0 · AI motion from the real photo
    </div>
  </SceneIn>
);

/* ——— Scene 2: the homes on the aerial ——— */
const SceneHomes: React.FC = () => {
  const f = useCurrentFrame();
  const card = usePop(18);
  const zoom = interpolate(f, [20, 180], [1.0, 1.18], clamp);
  const band = usePop(52);
  const pulse = 1 + Math.sin(f / 8) * 0.03;
  return (
    <SceneIn bg={C.ivory}>
      <Texture />
      <Eyebrow text="What the town approved" color={C.bronze} />
      <Headline top={270} size={112} start={6} lines={[
        [{ t: '66', accent: true }, { t: 'homes,' }],
        [{ t: 'room' }, { t: 'to' }, { t: 'breathe.' }],
      ]} />
      <div style={{
        position: 'absolute', left: 64, top: 640, width: 846, height: 560, overflow: 'hidden', borderRadius: 26,
        border: `10px solid ${C.ivory}`, outline: '4px solid rgba(0,0,0,0.8)', boxShadow: '16px 18px 0 rgba(0,0,0,0.8)',
        transform: `rotate(-1.5deg) scale(${card})`,
      }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '60% 35%' }}>
          <Img src={staticFile('aerial-rmr-1600.webp')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '100% 50%' }} />
          <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <g opacity={Math.min(1, band)}>
              <ellipse cx="940" cy="335" rx={215 * band * pulse} ry={46 * band * pulse} transform="rotate(-27 940 335)"
                fill="rgba(211,173,120,0.45)" stroke="#f5e3c4" strokeWidth="7" strokeDasharray="18 12" />
              <text x="1010" y="480" textAnchor="middle" fontFamily='"Cormorant Garamond", serif' fontStyle="italic" fontWeight="500" fontSize="70"
                fill={C.ivory} stroke="rgba(14,22,19,0.85)" strokeWidth="12" paintOrder="stroke">Red Mountain Ranch</text>
            </g>
            <text x="300" y="770" fontFamily="Manrope" fontWeight="800" fontSize="40" letterSpacing="6" fill={C.ivory} stroke="rgba(14,22,19,0.8)" strokeWidth="9" paintOrder="stroke">DOWNTOWN EAGLE</text>
            <text x="560" y="655" fontFamily='"Cormorant Garamond", serif' fontStyle="italic" fontSize="60" fill="#dce8e3" stroke="rgba(14,22,19,0.8)" strokeWidth="9" paintOrder="stroke">Eagle River</text>
          </svg>
        </div>
        <div style={{ position: 'absolute', left: 18, bottom: 12, fontFamily: brand.fonts.ui, fontSize: 18, color: 'rgba(245,240,230,0.9)' }}>
          USGS aerial (public domain) · area approximate, not a boundary
        </div>
      </div>
      <Chip text="42 townhomes" x={520} y={590} rot={3} delay={56} tone="dark" />
      <Chip text="12 duplex · 12 single-family" x={300} y={1180} rot={-3} delay={86} tone="rust" />
      <Chip text="plan allowed 97" x={560} y={470} rot={4} delay={120} tone="light" />
    </SceneIn>
  );
};

/* ——— Scene 3: built lighter + the filing, typed ——— */
const SceneBuilt: React.FC = () => {
  const tag = usePop(20);
  return (
    <SceneIn bg={C.pine}>
      <Texture dark />
      <Eyebrow text="From the town filings" color={C.bronzeLt} />
      <Headline top={270} size={118} color={C.ivory} accent={C.bronzeLt} start={4} lines={[
        [{ t: 'Built' }, { t: 'lighter.', accent: true }],
      ]} />
      <div style={{
        position: 'absolute', left: 64, top: 440, transform: `scale(${tag})`, transformOrigin: 'left center',
        background: C.ivory, color: C.ink, borderRadius: 999, padding: '10px 24px', fontFamily: brand.fonts.mono, fontSize: 26,
        display: 'flex', alignItems: 'center', gap: 12, boxShadow: '5px 6px 0 rgba(0,0,0,0.4)',
      }}>
        <span style={{ width: 14, height: 14, borderRadius: 99, background: C.rust }} /> Tres Birds design
      </div>
      <Tile x={64} y={540} size={168} bg={C.bronzeLt} delay={30} label="All-electric" labelColor={C.ivory}>{I.bolt(C.ink)}</Tile>
      <Arrow x={246} y={604} len={124} delay={46} color={C.bronzeLt} />
      <Tile x={384} y={540} size={168} bg={C.ivory} delay={52} label="Solar roofs" labelColor={C.ivory}>{I.sun(C.ink)}</Tile>
      <Arrow x={566} y={604} len={124} delay={68} color={C.bronzeLt} />
      <Tile x={704} y={540} size={168} bg={C.rust} delay={74} label="Native land" labelColor={C.ivory}>{I.leaf('#fff3ea')}</Tile>
      <CodeCard x={64} y={880} w={846} title="rmr-parcel-1 · town of eagle filings" delay={88} cps={2.4} lines={[
        { k: 'river_setback:', v: '75 ft', c: C.bronzeLt },
        { k: 'solar:', v: '30% of roof space' },
        { k: 'envelope:', v: '10% better than code' },
        { k: 'bedrooms:', v: '3 or 4, every home', c: C.bronzeLt },
        { k: 'status:', v: '"approved, not yet built"', c: '#9fc3a8' },
      ]} />
    </SceneIn>
  );
};

/* ——— Scene 4: the proposal + the real site ——— */
const SceneStory: React.FC = () => {
  const f = useCurrentFrame();
  const diagramOut = interpolate(f, [96, 110], [1, 0], clamp);
  const phone = usePop(104);
  const scroll = interpolate(f, [118, 205], [0, -2350], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <SceneIn bg={C.ivory}>
      <Texture />
      <Eyebrow text="The proposal" color={C.bronze} />
      <Headline top={270} size={112} start={4} lines={[
        [{ t: 'One' }, { t: 'partner,' }],
        [{ t: 'six', accent: true }, { t: 'parcels.' }],
      ]} />
      <div style={{ opacity: diagramOut }}>
        <Chip text="Parcel 1 · proof of concept" x={440} y={490} rot={-3} delay={22} tone="rust" />
        <Tile x={64} y={640} size={168} bg={C.pine2} delay={30} label="River story">{I.peak(C.bronzeLt)}</Tile>
        <Arrow x={246} y={704} len={124} delay={46} label="tell" />
        <Tile x={384} y={640} size={168} bg={C.bronzeLt} delay={52} label="Digital home">{I.browser(C.ink)}</Tile>
        <Arrow x={566} y={704} len={124} delay={68} label="gather" />
        <Tile x={704} y={640} size={168} bg={C.rust} delay={74} label="Buyer list">{I.list('#fff3ea')}</Tile>
        <Chip text="follow-up only when authorized" x={120} y={1000} rot={2} delay={84} tone="dark" />
      </div>
      {f > 100 && (
        <>
          <div style={{
            position: 'absolute', left: 250, top: 560, width: 470, height: 700, borderRadius: 54, background: '#0d1210',
            padding: 16, boxShadow: '18px 20px 0 rgba(0,0,0,0.8)', border: '4px solid #000',
            transform: `translateY(${(1 - phone) * 500}px) rotate(${(1 - phone) * 8 + 2}deg)`,
          }}>
            <div style={{ width: '100%', height: '100%', borderRadius: 40, overflow: 'hidden', position: 'relative', background: C.ivory }}>
              <Img src={staticFile('site-mobile.webp')} style={{ width: '100%', transform: `translateY(${scroll}px)` }} />
            </div>
          </div>
          <Chip text="the real concept site" x={560} y={520} rot={5} delay={116} tone="rust" />
          <Chip text="tested · 390 → 1440px" x={70} y={1100} rot={-4} delay={140} tone="dark" />
        </>
      )}
    </SceneIn>
  );
};

/* ——— Scene 5: the conversation ——— */
const SceneTalk: React.FC = () => {
  const card = usePop(46);
  const line = useIn(70, 18);
  return (
    <SceneIn bg={C.pine}>
      <Hero src="eagle-river-water-1400.webp" video="rmr-water-motion.mp4" rate={0.84} pos="50% 50%" dim={0.7} />
      <Texture dark />
      <Eyebrow text="Let's talk" color={C.bronzeLt} />
      <Headline top={270} size={116} color={C.ivory} accent={C.bronzeLt} start={4} lines={[
        [{ t: "Let's" }, { t: 'launch' }],
        [{ t: 'the' }, { t: 'first', accent: true }, { t: 'of', accent: true }, { t: 'six.', accent: true }],
      ]} />
      <div style={{
        position: 'absolute', left: 64, top: 640, width: 846, background: C.ivory, borderRadius: 28, padding: '46px 52px',
        border: '4px solid #000', boxShadow: '16px 18px 0 rgba(0,0,0,0.75)', transform: `translateY(${(1 - card) * 300}px) rotate(${(1 - card) * -4}deg)`, opacity: Math.min(1, card * 1.4),
      }}>
        <div style={{ fontFamily: brand.fonts.display, fontSize: 52, fontWeight: 500, color: C.ink }}>EpiVail</div>
        <div style={{ height: 3, width: `${line * 100}%`, background: C.bronze, margin: '18px 0 26px' }} />
        <div style={{ fontFamily: brand.fonts.ui, fontWeight: 800, fontSize: 35, color: C.ink, letterSpacing: '-0.02em', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
          Charles Harrison, Epique Area/Growth Leader
        </div>
        <div style={{ marginTop: 26, fontFamily: brand.fonts.mono, fontSize: 32, color: C.rust }}>charlesharrison.epiquerealty.com</div>
      </div>
      <Chip text="independent concept" x={480} y={560} rot={4} delay={90} tone="light" />
      <Chip text="not an official listing" x={90} y={1080} rot={-3} delay={110} tone="rust" />
      <div style={{ position: 'absolute', left: 64, right: 180, top: 1200, fontFamily: brand.fonts.ui, fontSize: 19, lineHeight: 1.4, color: 'rgba(245,240,230,0.62)' }}>
        Photos: Jeffrey Beall (CC BY 4.0), the Eagle River in town; AI motion added to the real photos. Aerial: USGS, public domain. Figures: Town of Eagle filings (2025) and Vail Daily (Apr 2, 2026); subject to change.
      </div>
    </SceneIn>
  );
};

export const RmrReel: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: C.pine }}>
      <Sequence from={S.hero} durationInFrames={S.homes - S.hero}><SceneHero /></Sequence>
      <Sequence from={S.homes} durationInFrames={S.built - S.homes}><SceneHomes /></Sequence>
      <Sequence from={S.built} durationInFrames={S.story - S.built}><SceneBuilt /></Sequence>
      <Sequence from={S.story} durationInFrames={S.talk - S.story}><SceneStory /></Sequence>
      <Sequence from={S.talk} durationInFrames={S.end - S.talk}><SceneTalk /></Sequence>

      <Presenter x={-20} y={1380} scale={0.95} enter={8} aims={[
        [0, -38],
        [S.homes + 10, -58],
        [S.built + 10, -44],
        [S.built + 95, -30],
        [S.story + 10, -48],
        [S.story + 110, -36],
        [S.talk + 10, -50],
      ]} />

      <Captions cues={[
        { from: 12, to: 150, text: 'Sixty-six homes are coming to the Eagle River.' },
        { from: 158, to: 250, text: 'Eagle approved Red Mountain Ranch in March 2026.' },
        { from: 250, to: 330, text: 'The plan allowed 97. They chose 66, and open land.' },
        { from: 338, to: 420, text: 'All-electric, solar-ready, 75 feet back from the river.' },
        { from: 420, to: 510, text: "Every figure here is from the town's filings." },
        { from: 518, to: 614, text: 'Parcel 1 is the first of six parcels on the river.' },
        { from: 614, to: 720, text: 'And the concept site is already built.' },
        { from: 728, to: 900, text: "Bringing Red Mountain Ranch to market? Let's talk." },
      ]} />
    </AbsoluteFill>
  );
};
