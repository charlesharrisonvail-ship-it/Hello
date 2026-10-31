import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, Easing,
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
const S = { hero: 0, phases: 150, process: 330, story: 510, talk: 720, end: 900 };

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
  map: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48"><path d="M6 12l11-5 14 5 11-5v29l-11 5-14-5-11 5z" fill="none" stroke={c} strokeWidth="3.5" strokeLinejoin="round" /><path d="M17 7v29M31 12v29" stroke={c} strokeWidth="3" /><path d="M10 26c6-6 10 4 16-2s9 2 12-1" fill="none" stroke={C.river} strokeWidth="3" strokeLinecap="round" /></svg>),
  zoning: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48"><rect x="6" y="6" width="16" height="16" rx="2" fill="none" stroke={c} strokeWidth="3.5" /><rect x="26" y="6" width="16" height="16" rx="2" fill={c} opacity=".85" /><rect x="6" y="26" width="16" height="16" rx="2" fill={c} opacity=".85" /><rect x="26" y="26" width="16" height="16" rx="2" fill="none" stroke={c} strokeWidth="3.5" /></svg>),
  lots: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48"><path d="M6 8h36v32H6z" fill="none" stroke={c} strokeWidth="3.5" /><path d="M18 8v32M30 8v32M6 24h36" stroke={c} strokeWidth="3" strokeDasharray="4 3" /><path d="M10 14l3-3 3 3v5h-6z" fill={c} /></svg>),
  peak: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48"><path d="M4 40l14-22 7 10 6-8 13 20z" fill="none" stroke={c} strokeWidth="3.5" strokeLinejoin="round" /><path d="M18 18l-4 6h8z" fill={c} /><path d="M33 6v12M33 6h9l-3 3 3 3h-9" fill="none" stroke={c} strokeWidth="3" strokeLinejoin="round" /></svg>),
  browser: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48"><rect x="5" y="8" width="38" height="32" rx="4" fill="none" stroke={c} strokeWidth="3.5" /><path d="M5 16h38" stroke={c} strokeWidth="3" /><circle cx="10" cy="12" r="1.6" fill={c} /><circle cx="15" cy="12" r="1.6" fill={c} /><path d="M11 33l7-9 5 6 4-4 8 7" fill="none" stroke={c} strokeWidth="3" strokeLinejoin="round" /></svg>),
  list: (c: string) => (<svg width="96" height="96" viewBox="0 0 48 48">{[12, 24, 36].map((y) => (<g key={y}><circle cx="10" cy={y} r="3.4" fill={c} /><path d={`M18 ${y}h22`} stroke={c} strokeWidth="3.5" strokeLinecap="round" /></g>))}</svg>),
};

/* ——— Scene 1: hero ——— */
const Hero: React.FC<{ src: string; dim?: number }> = ({ src, dim = 0.55 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Img src={staticFile(src)} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '32% 50%',
        transform: `scale(${1.18 - f * 0.0006}) translateX(${f * 0.08}px)`,
      }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(14,22,19,${dim + 0.15}) 0%, rgba(14,22,19,${dim * 0.75}) 34%, rgba(14,22,19,${dim * 0.4}) 52%, rgba(14,22,19,${dim * 0.9}) 72%, rgba(14,22,19,0.92) 100%)` }} />
    </>
  );
};

const SceneHero: React.FC = () => (
  <SceneIn bg={C.pine}>
    <Hero src="eagle-river-minturn-1600.webp" />
    <Texture dark />
    <Eyebrow text="Dowd Junction · Avon, CO" color={C.bronzeLt} delay={4} />
    <Headline top={290} size={124} color={C.ivory} accent={C.bronzeLt} start={10} lines={[
      [{ t: 'A' }, { t: 'new' }, { t: 'chapter' }],
      [{ t: 'on' }, { t: 'the' }],
      [{ t: 'Eagle', accent: true }, { t: 'River.', accent: true }],
    ]} />
    <Chip text="Eagle River corridor" x={470} y={760} rot={4} delay={44} tone="light" />
    <Chip text="~300-home planning goal" x={80} y={880} rot={-4} delay={62} tone="rust" />
    <Chip text="a concept by EpiVail" x={400} y={1000} rot={-2} delay={82} tone="bronze" />
    <Chip text="Jul 13, 2026 · Avon PZC" x={120} y={1110} rot={3} delay={102} tone="dark" />
    <div style={{ position: 'absolute', right: 180, top: 1240, fontFamily: brand.fonts.ui, fontSize: 20, color: 'rgba(245,240,230,0.6)' }}>
      Eagle River at Minturn · Photo: Jeffrey Beall, CC BY 4.0
    </div>
  </SceneIn>
);

/* ——— Scene 2: phases on the aerial ——— */
const Zone: React.FC<{ cx: number; cy: number; rx: number; ry: number; rot: number; delay: number; label: string; lx: number; ly: number }> = ({ cx, cy, rx, ry, rot, delay, label, lx, ly }) => {
  const p = usePop(delay);
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin((f - delay) / 8) * 0.03;
  return (
    <g opacity={Math.min(1, p)}>
      <ellipse cx={cx} cy={cy} rx={rx * p * pulse} ry={ry * p * pulse} transform={`rotate(${rot} ${cx} ${cy})`}
        fill="rgba(211,173,120,0.32)" stroke={C.bronzeLt} strokeWidth="7" strokeDasharray="18 12" />
      <text x={lx} y={ly} textAnchor="middle" fontFamily='"Cormorant Garamond", serif' fontStyle="italic" fontWeight="500" fontSize="78"
        fill={C.ivory} stroke="rgba(14,22,19,0.85)" strokeWidth="12" paintOrder="stroke">{label}</text>
    </g>
  );
};

const ScenePhases: React.FC = () => {
  const f = useCurrentFrame();
  const card = usePop(18);
  const zoom = interpolate(f, [20, 180], [1.0, 1.12], clamp);
  return (
    <SceneIn bg={C.ivory}>
      <Texture />
      <Eyebrow text="What the plan says" color={C.bronze} />
      <Headline top={270} size={112} start={6} lines={[
        [{ t: 'About' }, { t: '300', accent: true }, { t: 'homes,' }],
        [{ t: 'in' }, { t: 'two' }, { t: 'phases.' }],
      ]} />
      <div style={{
        position: 'absolute', left: 64, top: 700, width: 846, height: 540, overflow: 'hidden', borderRadius: 26,
        border: `10px solid ${C.ivory}`, outline: '4px solid rgba(0,0,0,0.8)', boxShadow: '16px 18px 0 rgba(0,0,0,0.8)',
        transform: `rotate(-1.5deg) scale(${card})`,
      }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '72% 46%' }}>
          <Img src={staticFile('aerial-dowd-1600.webp')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '100% 50%' }} />
          <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <Zone cx={1088} cy={430} rx={70} ry={96} rot={-18} delay={46} label="Phase 1" lx={930} ly={600} />
            <Zone cx={1300} cy={470} rx={180} ry={128} rot={-24} delay={100} label="Phase 2" lx={1320} ly={300} />
            <text x="1250" y="800" textAnchor="middle" fontFamily="Manrope" fontWeight="800" fontSize="40" letterSpacing="6" fill={C.ivory} stroke="rgba(14,22,19,0.8)" strokeWidth="9" paintOrder="stroke">DOWD JUNCTION</text>
            <text x="560" y="175" fontFamily='"Cormorant Garamond", serif' fontStyle="italic" fontSize="60" fill="#dce8e3" stroke="rgba(14,22,19,0.8)" strokeWidth="9" paintOrder="stroke">Eagle River</text>
          </svg>
        </div>
        <div style={{ position: 'absolute', left: 18, bottom: 12, fontFamily: brand.fonts.ui, fontSize: 18, color: 'rgba(245,240,230,0.85)' }}>
          USGS aerial (public domain) · areas approximate, not boundaries
        </div>
      </div>
      <Chip text="~100 · between U.S. 6 & the river" x={300} y={672} rot={3} delay={52} tone="dark" />
      <Chip text="~200 · north of the river" x={330} y={1196} rot={-3} delay={106} tone="rust" />
      <Chip text="goals, not approved inventory" x={430} y={470} rot={4} delay={140} tone="light" />
    </SceneIn>
  );
};

/* ——— Scene 3: what it takes + the source, typed ——— */
const SceneProcess: React.FC = () => {
  const tag = usePop(20);
  return (
    <SceneIn bg={C.pine}>
      <Texture dark />
      <Eyebrow text="Grounded in the public record" color={C.bronzeLt} />
      <Headline top={270} size={118} color={C.ivory} accent={C.bronzeLt} start={4} lines={[
        [{ t: 'What' }, { t: 'it' }, { t: 'takes.', accent: true }],
      ]} />
      <div style={{
        position: 'absolute', left: 64, top: 440, transform: `scale(${tag})`, transformOrigin: 'left center',
        background: C.ivory, color: C.ink, borderRadius: 999, padding: '10px 24px', fontFamily: brand.fonts.mono, fontSize: 26,
        display: 'flex', alignItems: 'center', gap: 12, boxShadow: '5px 6px 0 rgba(0,0,0,0.4)',
      }}>
        <span style={{ width: 14, height: 14, borderRadius: 99, background: C.rust }} /> Town of Avon process
      </div>
      <Tile x={64} y={540} size={168} bg={C.ivory} delay={30} label="Annexation" labelColor={C.ivory}>{I.map(C.ink)}</Tile>
      <Arrow x={246} y={604} len={124} delay={46} color={C.bronzeLt} />
      <Tile x={384} y={540} size={168} bg={C.bronzeLt} delay={52} label="Zoning" labelColor={C.ivory}>{I.zoning(C.ink)}</Tile>
      <Arrow x={566} y={604} len={124} delay={68} color={C.bronzeLt} />
      <Tile x={704} y={540} size={168} bg={C.rust} delay={74} label="Subdivision" labelColor={C.ivory}>{I.lots('#fff3ea')}</Tile>
      <CodeCard x={64} y={880} w={846} title="avon-pzc-2026-07-13.pdf · p.27" delay={88} cps={2.4} lines={[
        { k: 'phase_1:', v: '~100 homes', c: C.bronzeLt },
        { k: 'where:', v: 'U.S. 6 ↔ Eagle River' },
        { k: 'phase_2:', v: '~200, north of river', c: C.bronzeLt },
        { k: 'needs:', v: 'utilities + access' },
        { k: 'status:', v: '"planning goal"', c: '#9fc3a8' },
      ]} />
    </SceneIn>
  );
};

/* ——— Scene 4: the EpiVail approach + the real site ——— */
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
        [{ t: 'EpiVail' }, { t: 'tells' }],
        [{ t: 'the' }, { t: 'story.', accent: true }],
      ]} />
      <div style={{ opacity: diagramOut }}>
        <Chip text="EpiVail · proposed services" x={470} y={490} rot={-3} delay={22} tone="rust" />
        <Tile x={64} y={640} size={168} bg={C.pine2} delay={30} label="Place story">{I.peak(C.bronzeLt)}</Tile>
        <Arrow x={246} y={704} len={124} delay={46} label="tell" />
        <Tile x={384} y={640} size={168} bg={C.bronzeLt} delay={52} label="Digital home">{I.browser(C.ink)}</Tile>
        <Arrow x={566} y={704} len={124} delay={68} label="gather" />
        <Tile x={704} y={640} size={168} bg={C.rust} delay={74} label="Interest list">{I.list('#fff3ea')}</Tile>
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
      <Hero src="gore-range-vail-1400.webp" dim={0.7} />
      <Texture dark />
      <Eyebrow text="Let's talk" color={C.bronzeLt} />
      <Headline top={270} size={116} color={C.ivory} accent={C.bronzeLt} start={4} lines={[
        [{ t: "Let's" }, { t: 'build' }, { t: 'the' }],
        [{ t: 'next', accent: true }, { t: 'chapter.', accent: true }],
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
        Photos: Jeffrey Beall (CC BY 4.0), David Herrera (CC BY 2.0). Aerial: USGS, public domain. Figures: Town of Avon, Jul 13, 2026; planning goals, subject to change.
      </div>
    </SceneIn>
  );
};

export const DowdReel: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: C.pine }}>
      <Sequence from={S.hero} durationInFrames={S.phases - S.hero}><SceneHero /></Sequence>
      <Sequence from={S.phases} durationInFrames={S.process - S.phases}><ScenePhases /></Sequence>
      <Sequence from={S.process} durationInFrames={S.story - S.process}><SceneProcess /></Sequence>
      <Sequence from={S.story} durationInFrames={S.talk - S.story}><SceneStory /></Sequence>
      <Sequence from={S.talk} durationInFrames={S.end - S.talk}><SceneTalk /></Sequence>

      <Presenter x={-20} y={1380} scale={0.95} enter={8} aims={[
        [0, -38],
        [S.phases + 10, -58],
        [S.process + 10, -44],
        [S.process + 95, -30],
        [S.story + 10, -48],
        [S.story + 110, -36],
        [S.talk + 10, -50],
      ]} />

      <Captions cues={[
        { from: 12, to: 150, text: 'Something new is taking shape on the Eagle River.' },
        { from: 158, to: 250, text: "Avon's July 2026 plan sets a goal of about 300 homes." },
        { from: 250, to: 330, text: 'About 100 first, then 200 more across the river.' },
        { from: 338, to: 420, text: 'Annexation, zoning and subdivision come first.' },
        { from: 420, to: 510, text: 'Every figure here comes from the public record.' },
        { from: 518, to: 614, text: 'A place story, a real digital home, careful follow-up.' },
        { from: 614, to: 720, text: 'And the concept site is already built.' },
        { from: 728, to: 900, text: "If you're shaping Dowd Junction, I'd love to talk." },
      ]} />
    </AbsoluteFill>
  );
};
