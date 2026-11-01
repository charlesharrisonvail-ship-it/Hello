/* AiRE Estate: the six Claude Code skills we recommend. Five come from Part One,
   Module 3 ("The Five Setups"); Superpowers is an extra pick, not in the course.
   Descriptions restate the course narration (lm3-script.txt on the live-site
   branch). No owner name, no install lines, Claude Code marked (not included). */
import React, { useEffect, useState } from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import '@fontsource/archivo/700.css';
import '@fontsource/archivo/800.css';
import '@fontsource/archivo/900.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import { brand } from './lib/brand';
import { Arrow, Captions, Chip, CodeCard, Headline, Texture, Tile, useIn, usePop } from './components/bits';
import { AiRE } from './components/AiRE';

const C = brand.colors;
const G = brand.grad;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const S = { hook: 0, look: 150, move: 360, numbers: 570, plan: 750, cta: 930, end: 1110 };
export const TOTAL = S.end;

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([
      '700 40px Archivo', '800 40px Archivo', '900 40px Archivo',
      'italic 500 40px "Cormorant Garamond"', '400 40px "JetBrains Mono"', '500 40px "JetBrains Mono"',
    ].map((s) => document.fonts.load(s))).then(() => continueRender(handle));
  }, [handle]);
};

/* Near-black ground with slow drifting colour glows, as in aire-vs-bootcamps. */
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const a = f / 90;
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: 'hidden' }}>
      {[C.bronze, C.rust, C.river].map((c, i) => (
        <div key={c} style={{
          position: 'absolute', width: 1100, height: 1100, borderRadius: '50%', background: c, opacity: 0.16, filter: 'blur(160px)',
          left: -300 + i * 380 + Math.sin(a + i * 2) * 120, top: -200 + i * 650 + Math.cos(a * 0.8 + i) * 140,
        }} />
      ))}
    </AbsoluteFill>
  );
};

/* Optional AI footage (Higgsfield, Kling text-to-video) behind a scene, darkened
   for legibility and always tagged as AI on screen. */
const AiFootage: React.FC<{ src: string; rate?: number; dim?: number }> = ({ src, rate = 1, dim = 0.62 }) => (
  <>
    <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(4,7,13,${dim + 0.2}) 0%, rgba(4,7,13,${dim}) 30%, rgba(4,7,13,${dim * 0.75}) 55%, rgba(4,7,13,${dim + 0.25}) 80%, rgba(4,7,13,0.95) 100%)` }} />
    <div style={{
      position: 'absolute', right: 180, top: 140, fontFamily: brand.fonts.mono, fontSize: 20, color: C.ivory,
      background: 'rgba(13,21,36,0.85)', border: '2px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '4px 14px',
    }}>AI-generated footage</div>
  </>
);

const SceneIn: React.FC<{ children: React.ReactNode; footage?: { src: string; rate?: number; dim?: number } }> = ({ children, footage }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: p, transform: `scale(${1.04 - 0.04 * p})` }}>
      {footage && <AiFootage {...footage} />}
      {children}<Texture dark />
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ n?: string; text: string }> = ({ n, text }) => {
  const p = useIn(0, 12);
  return (
    <div style={{
      position: 'absolute', left: 64, top: 200, display: 'flex', alignItems: 'center', gap: 16, opacity: p,
      fontFamily: brand.fonts.mono, fontSize: 26, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.bronze,
    }}>
      {n && <span style={{ background: G, color: C.ink, borderRadius: 8, padding: '2px 12px', fontWeight: 500 }}>{n}</span>}
      {text}
    </div>
  );
};

/* ——— Icons ——— */
const I = {
  taste: (c: string) => (<svg width="92" height="92" viewBox="0 0 48 48"><rect x="6" y="8" width="36" height="32" rx="3" fill="none" stroke={c} strokeWidth="3.2" /><path d="M12 16h16M12 22h24M12 28h10" stroke={c} strokeWidth="3" strokeLinecap="round" /><path d="M30 26l8 8" stroke={c} strokeWidth="3.2" strokeLinecap="round" /><circle cx="28" cy="24" r="4" fill="none" stroke={c} strokeWidth="2.6" /></svg>),
  eyes: (c: string) => (<svg width="92" height="92" viewBox="0 0 48 48"><path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z" fill="none" stroke={c} strokeWidth="3.2" /><circle cx="24" cy="24" r="6" fill={c} /><path d="M34 34l6 6" stroke={c} strokeWidth="3.2" strokeLinecap="round" /></svg>),
  motion: (c: string) => (<svg width="92" height="92" viewBox="0 0 48 48"><path d="M6 38C14 38 14 12 24 12s10 26 18 26" fill="none" stroke={c} strokeWidth="3.4" strokeLinecap="round" /><circle cx="24" cy="12" r="4.5" fill={c} /><path d="M6 44h36" stroke={c} strokeWidth="2" strokeDasharray="3 4" /></svg>),
  film: (c: string) => (<svg width="92" height="92" viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="28" rx="5" fill="none" stroke={c} strokeWidth="3.2" /><path d="M20 18l10 6-10 6z" fill={c} /><path d="M6 16h4M6 24h4M6 32h4M38 16h4M38 24h4M38 32h4" stroke={c} strokeWidth="2.6" /></svg>),
  house: (c: string) => (<svg width="92" height="92" viewBox="0 0 48 48"><path d="M6 24L24 8l18 16" fill="none" stroke={c} strokeWidth="3.2" strokeLinejoin="round" /><path d="M11 21v19h26V21" fill="none" stroke={c} strokeWidth="3.2" /><path d="M17 35v-6M24 35v-10M31 35v-8" stroke={c} strokeWidth="3.4" strokeLinecap="round" /></svg>),
  pdf: (c: string) => (<svg width="92" height="92" viewBox="0 0 48 48"><path d="M12 4h17l9 9v31H12z" fill="none" stroke={c} strokeWidth="3.2" strokeLinejoin="round" /><path d="M29 4v9h9" fill="none" stroke={c} strokeWidth="3" /><path d="M17 24h16M17 30h16M17 36h10" stroke={c} strokeWidth="3" strokeLinecap="round" /></svg>),
  idea: (c: string) => (<svg width="92" height="92" viewBox="0 0 48 48"><path d="M24 6a12 12 0 0 0-7 22v6h14v-6A12 12 0 0 0 24 6z" fill="none" stroke={c} strokeWidth="3.2" strokeLinejoin="round" /><path d="M18 40h12M20 44h8" stroke={c} strokeWidth="3" strokeLinecap="round" /></svg>),
  plan: (c: string) => (<svg width="92" height="92" viewBox="0 0 48 48">{[12, 24, 36].map((y) => (<g key={y}><path d={`M8 ${y}l3 3 6-6`} fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d={`M22 ${y + 1}h18`} stroke={c} strokeWidth="3.2" strokeLinecap="round" /></g>))}</svg>),
  build: (c: string) => (<svg width="92" height="92" viewBox="0 0 48 48"><path d="M16 14l-10 10 10 10M32 14l10 10-10 10M27 8l-6 32" fill="none" stroke={c} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>),
};

const tileBg = '#0d1524';

/* ——— 1. Hook ——— */
const Hook: React.FC = () => (
  <SceneIn footage={{ src: 'aire-hook-home.mp4', dim: 0.5 }}>
    <Kicker text="AiRE Estate · Claude Code for agents" />
    <Headline top={270} size={104} color={C.ivory} accent={G} start={8} lines={[
      [{ t: 'Six' }, { t: 'skills.' }],
      [{ t: 'Work' }, { t: 'that' }, { t: 'looks' }],
      [{ t: 'like' }, { t: 'a' }, { t: 'firm', accent: true }],
      [{ t: 'made', accent: true }, { t: 'it.', accent: true }],
    ]} />
    <Chip text="for real estate agents" x={470} y={760} rot={4} delay={44} tone="light" />
    <Chip text="Claude Code (not included)" x={80} y={880} rot={-4} delay={62} tone="rust" />
    <Chip text="5 set up in Part One · Module 3" x={300} y={1000} rot={-2} delay={82} tone="bronze" />
    <Chip text="1 extra pick" x={140} y={1110} rot={3} delay={102} tone="dark" />
  </SceneIn>
);

/* ——— 2. Taste + Impeccable ——— */
const Look: React.FC = () => (
  <SceneIn>
    <Kicker n="1 · 2" text="Make it look right" />
    <Headline top={270} size={112} color={C.ivory} accent={G} start={4} lines={[
      [{ t: 'Taste,' }, { t: 'then' }],
      [{ t: 'a' }, { t: 'second', accent: true }, { t: 'look.', accent: true }],
    ]} />
    <Tile x={110} y={560} size={190} bg={tileBg} delay={28} label="Taste" labelColor={C.ivory}>{I.taste(C.bronze)}</Tile>
    <Arrow x={330} y={632} len={250} delay={46} label="then" color={C.ivory} />
    <Tile x={610} y={560} size={190} bg={tileBg} delay={56} label="Impeccable" labelColor={C.ivory}>{I.eyes(C.rust)}</Tile>
    <CodeCard x={64} y={880} w={846} title="part-one · module-3 · design" delay={84} cps={2.6} lines={[
      { k: 'taste:', v: "fixes what you can't name", c: C.bronze },
      { k: 'teaches:', v: 'spacing · type · layout, and why' },
      { k: 'impeccable:', v: 'a second set of eyes', c: C.rust },
      { k: 'built_by:', v: 'Paul Bakaus' },
      { k: 'modes:', v: 'polish · audit · critique', c: C.river },
    ]} />
  </SceneIn>
);

/* ——— 3. Emil Kowalski + Remotion ——— */
const Move: React.FC = () => (
  <SceneIn footage={{ src: 'aire-move-room.mp4', rate: 0.72, dim: 0.46 }}>
    <Kicker n="3 · 4" text="Make it move" />
    <Headline top={270} size={112} color={C.ivory} accent={G} start={4} lines={[
      [{ t: "It's" }, { t: 'the' }],
      [{ t: 'movement.', accent: true }],
    ]} />
    <Tile x={110} y={560} size={190} bg={tileBg} delay={28} label="Emil Kowalski" labelColor={C.ivory}>{I.motion(C.river)}</Tile>
    <Arrow x={330} y={632} len={250} delay={46} label="then" color={C.ivory} />
    <Tile x={610} y={560} size={190} bg={tileBg} delay={56} label="Remotion" labelColor={C.ivory}>{I.film(C.bronze)}</Tile>
    <CodeCard x={64} y={880} w={846} title="part-one · module-3 · video" delay={84} cps={2.6} lines={[
      { k: 'emil_kowalski:', v: 'a skill about motion', c: C.river },
      { k: 'why:', v: "it's the movement, not the photo" },
      { k: 'remotion:', v: 'video built with code', c: C.bronze },
      { k: 'reuse:', v: 'new address + price = new video' },
      { k: 'proof:', v: '"this reel is Remotion"', c: C.amber },
    ]} />
    <Chip text="you're watching it" x={520} y={470} rot={5} delay={150} tone="rust" />
  </SceneIn>
);

/* ——— 4. AI Real Estate ——— */
const Numbers: React.FC = () => {
  const items = ['comps', 'rental analysis', 'investment numbers', 'flip math', 'neighborhoods'];
  return (
    <SceneIn>
      <Kicker n="5" text="Run the numbers" />
      <Headline top={270} size={112} color={C.ivory} accent={G} start={4} lines={[
        [{ t: 'Numbers' }, { t: 'into' }],
        [{ t: 'a' }, { t: 'report.', accent: true }],
      ]} />
      <Tile x={110} y={560} size={190} bg={tileBg} delay={24} label="AI Real Estate" labelColor={C.ivory}>{I.house(C.bronze)}</Tile>
      <Arrow x={330} y={632} len={250} delay={40} label="writes" color={C.ivory} />
      <Tile x={610} y={560} size={190} bg={tileBg} delay={50} label="PDF report" labelColor={C.ivory}>{I.pdf(C.rust)}</Tile>
      {items.map((t, i) => (
        <Chip key={t} text={t} x={[80, 420, 120, 520, 260][i]} y={[880, 900, 990, 1010, 1100][i]} rot={[-3, 3, 2, -2, -4][i]} delay={66 + i * 12} tone={(['light', 'dark', 'bronze', 'dark', 'light'] as const)[i]} />
      ))}
      <div style={{
        position: 'absolute', left: 64, top: 1210, fontFamily: brand.fonts.mono, fontSize: 26, color: C.amber,
        opacity: useIn(140, 12), letterSpacing: '0.06em',
      }}>ANALYSIS · NOT AN APPRAISAL</div>
    </SceneIn>
  );
};

/* ——— 5. Superpowers ——— */
const Plan: React.FC = () => (
  <SceneIn>
    <Kicker n="6" text="The extra pick" />
    <Headline top={270} size={112} color={C.ivory} accent={G} start={4} lines={[
      [{ t: 'Plan' }, { t: 'before' }],
      [{ t: 'it' }, { t: 'builds.', accent: true }],
    ]} />
    <Chip text="Superpowers · not in the course" x={430} y={470} rot={-3} delay={18} tone="rust" />
    <Tile x={64} y={600} size={168} bg={tileBg} delay={28} label="Brainstorm" labelColor={C.ivory}>{I.idea(C.amber)}</Tile>
    <Arrow x={246} y={664} len={124} delay={44} color={C.ivory} />
    <Tile x={384} y={600} size={168} bg={tileBg} delay={50} label="Plan" labelColor={C.ivory}>{I.plan(C.bronze)}</Tile>
    <Arrow x={566} y={664} len={124} delay={66} color={C.ivory} />
    <Tile x={704} y={600} size={168} bg={tileBg} delay={72} label="Build & test" labelColor={C.ivory}>{I.build(C.river)}</Tile>
    <CodeCard x={64} y={930} w={846} title="obra/superpowers · Claude Code plugin" delay={92} cps={2.6} lines={[
      { k: 'what:', v: 'skills that make Claude plan first', c: C.bronze },
      { k: 'then:', v: 'build, test, and check its work' },
      { k: 'status:', v: '"our pick, not in Part One"', c: C.amber },
    ]} />
  </SceneIn>
);

/* ——— 6. CTA ——— */
const Cta: React.FC = () => {
  const card = usePop(40);
  return (
    <SceneIn footage={{ src: 'aire-cta-light.mp4', rate: 0.84, dim: 0.45 }}>
      <Kicker text="Set it up once" />
      <Headline top={270} size={112} color={C.ivory} accent={G} start={4} lines={[
        [{ t: 'Five' }, { t: 'of' }, { t: 'them,' }],
        [{ t: 'in' }, { t: 'Part', accent: true }, { t: 'One.', accent: true }],
      ]} />
      <div style={{
        position: 'absolute', left: 64, top: 600, width: 846, borderRadius: 28, padding: '44px 50px', background: '#0d1524',
        border: '3px solid rgba(255,255,255,0.14)', boxShadow: '16px 18px 0 rgba(0,0,0,0.6)',
        transform: `translateY(${(1 - card) * 300}px) rotate(${(1 - card) * -4}deg)`, opacity: Math.min(1, card * 1.4),
      }}>
        <div style={{ fontFamily: brand.fonts.ui, fontWeight: 900, fontSize: 56, color: C.ivory, letterSpacing: '-0.02em' }}>AiRE Estate</div>
        <div style={{ height: 4, width: `${useIn(60, 18) * 100}%`, backgroundImage: G, margin: '18px 0 24px', borderRadius: 4 }} />
        <div style={{ fontFamily: brand.fonts.ui, fontWeight: 700, fontSize: 36, color: C.ivory }}>Part One · Module 3: The Five Setups</div>
        <div style={{ marginTop: 14, fontFamily: brand.fonts.ui, fontWeight: 800, fontSize: 48, color: C.ivory }}>
          $67 <span style={{ fontWeight: 700, fontSize: 30, color: C.inkSoft }}>once</span>
        </div>
        <div style={{ marginTop: 18, fontFamily: brand.fonts.mono, fontSize: 34, color: C.bronze }}>learn.aireestate.com</div>
      </div>
      <Chip text="Claude Code (not included) · Claude Pro $20/mo" x={64} y={1080} rot={-2} delay={84} tone="rust" />
      <div style={{ position: 'absolute', left: 64, right: 180, top: 1190, fontFamily: brand.fonts.ui, fontWeight: 700, fontSize: 19, lineHeight: 1.4, color: C.inkSoft }}>
        AiRE is the course's AI narrator. Price from learn.aireestate.com, Nov 2026. Skill names belong to their makers; Superpowers is by obra (Jesse Vincent).
      </div>
    </SceneIn>
  );
};

export const AireSixSkills: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill>
      <Backdrop />
      <Sequence from={S.hook} durationInFrames={S.look - S.hook}><Hook /></Sequence>
      <Sequence from={S.look} durationInFrames={S.move - S.look}><Look /></Sequence>
      <Sequence from={S.move} durationInFrames={S.numbers - S.move}><Move /></Sequence>
      <Sequence from={S.numbers} durationInFrames={S.plan - S.numbers}><Numbers /></Sequence>
      <Sequence from={S.plan} durationInFrames={S.cta - S.plan}><Plan /></Sequence>
      <Sequence from={S.cta} durationInFrames={S.end - S.cta}><Cta /></Sequence>

      <AiRE x={-20} y={1380} scale={0.95} enter={8} aims={[
        [0, -38],
        [S.look + 10, -56],
        [S.move + 10, -56],
        [S.numbers + 10, -56],
        [S.plan + 10, -60],
        [S.cta + 10, -50],
      ]} />

      <Captions cues={[
        { from: 10, to: 150, text: 'Six skills. Work that looks like a firm made it.' },
        { from: 156, to: 255, text: 'Taste fixes what you can feel but can\'t name.' },
        { from: 255, to: 360, text: 'Impeccable is a second set of eyes before a client sees it.' },
        { from: 366, to: 465, text: 'Emil Kowalski\'s skill is about motion.' },
        { from: 465, to: 570, text: 'Remotion builds video with code. Like this one.' },
        { from: 576, to: 750, text: 'AI Real Estate runs comps and rentals into a PDF report.' },
        { from: 756, to: 930, text: 'Superpowers makes Claude plan before it builds.' },
        { from: 936, to: 1110, text: 'Five of them are set up in Part One. Link in bio.' },
      ]} />
    </AbsoluteFill>
  );
};
