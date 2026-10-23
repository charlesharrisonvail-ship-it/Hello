/* AiRE Estate vs. the AI programs on Forbes Advisor's "Best AI Certification
   Programs" page (read 2026-10-22). Every number on screen comes from that page
   or from learn.aireestate.com. No owner name, no competitor logos. */
import React from 'react';
import {
  AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, staticFile,
} from 'remotion';
import { loadFont } from '@remotion/fonts';

/* Fonts are vendored in public/ (Google Fonts, OFL) so renders work offline. */
const HEAD = 'Archivo';
const BODY = 'Manrope';
loadFont({ family: HEAD, url: staticFile('archivo.woff2'), weight: '100 900' });
loadFont({ family: BODY, url: staticFile('manrope.woff2'), weight: '200 800' });

const C = { bg: '#04070d', card: '#0d1524', line: 'rgba(255,255,255,.12)', text: '#dbe2ec', dim: '#8496b2',
  blue: '#38bdf8', pink: '#f472b6', violet: '#a78bfa', amber: '#fbbf24' };

/* Ad-safe cut: no school names, no Forbes scores, for paid placement. */
const AdSafe = React.createContext(false);

const S = 30; // fps
const SCENES = [
  { id: 'hook', len: 4 * S },
  { id: 'programs', len: 8 * S },
  { id: 'cost', len: 7 * S },
  { id: 'claude', len: 7 * S },
  { id: 'honest', len: 6 * S },
  { id: 'cta', len: 6 * S },
];
export const TOTAL = SCENES.reduce((a, s) => a + s.len, 0);

/* Fade + rise in, fade out at the end of the scene. */
const useEnter = (delay = 0, len?: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 200 } });
  const out = len ? interpolate(f, [len - 10, len], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  return { opacity: s * out, transform: `translateY(${(1 - s) * 40}px)` };
};

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const a = f / 90;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      {[C.blue, C.pink, C.violet].map((c, i) => (
        <div key={c} style={{
          position: 'absolute', width: 1100, height: 1100, borderRadius: '50%', background: c, opacity: 0.16,
          filter: 'blur(160px)',
          left: -300 + i * 380 + Math.sin(a + i * 2) * 120,
          top: -200 + i * 650 + Math.cos(a * 0.8 + i) * 140,
        }} />
      ))}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, letterSpacing: '.08em', textTransform: 'uppercase',
    color: C.blue, ...style }}>{children}</div>
);
const Big: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 104, style }) => (
  <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, lineHeight: 1.04, color: '#fff', letterSpacing: '-.02em', ...style }}>{children}</div>
);
const Grad: React.FC<{ children: React.ReactNode; warm?: boolean }> = ({ children, warm }) => (
  <span style={{ backgroundImage: warm ? `linear-gradient(90deg,${C.amber},${C.pink})` : `linear-gradient(90deg,${C.blue},${C.violet},${C.pink})`,
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{children}</span>
);
const Source: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', left: 90, right: 90, bottom: 120, fontFamily: BODY, fontSize: 26, color: C.dim, lineHeight: 1.4 }}>{children}</div>
);
const Pad: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ padding: '160px 90px 260px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 44 }}>{children}</AbsoluteFill>
);

/* 1. Hook */
const Hook: React.FC<{ len: number }> = ({ len }) => (
  <Pad>
    <div style={{ ...useEnter(0, len) }}><Kicker>{React.useContext(AdSafe) ? 'AI certification programs' : <>Forbes Advisor &middot; Best AI Certification Programs</>}</Kicker></div>
    <div style={{ ...useEnter(8, len) }}><Big size={124}>The top AI programs are <Grad>excellent.</Grad></Big></div>
    <div style={{ ...useEnter(22, len) }}><Big size={124} style={{ color: C.text }}>Here&rsquo;s where <Grad warm>AiRE</Grad> fits.</Big></div>
  </Pad>
);

/* 2. What the top programs are */
const AD_PROGRAMS = [
  { name: 'An agentic AI program', meta: '10 weeks · multi-agent AI systems', score: '' },
  { name: 'An AI adoption course', meta: '6 weeks · 4–6 hours a week', score: '' },
  { name: 'A generative AI program', meta: 'Build GenAI apps, agents and RAG', score: '' },
  { name: 'An enterprise AI program', meta: '17 weeks · 6–8 hours a week', score: '' },
];
const PROGRAMS = [
  { name: 'Virginia Tech · Applied Agentic AI', meta: '10 weeks · multi-agent AI systems', score: '9.8' },
  { name: 'MIT · AI Adoption', meta: '6 weeks · 4–6 hours a week', score: '9.7' },
  { name: 'Duke Fuqua · Applied Generative & Agentic AI', meta: 'Build GenAI apps, agents and RAG', score: '9.5' },
  { name: 'MIT · Enterprise AI', meta: '17 weeks · 6–8 hours a week', score: '8.9' },
];
const Programs: React.FC<{ len: number }> = ({ len }) => {
  const head = useEnter(0, len);
  const list = React.useContext(AdSafe) ? AD_PROGRAMS : PROGRAMS;
  return (
    <Pad>
      <div style={head}><Kicker>Built for</Kicker><Big size={86} style={{ marginTop: 14 }}>AI careers and enterprise strategy</Big></div>
      {list.map((p, i) => <ProgramCard key={p.name} {...p} delay={16 + i * 12} len={len} />)}
    </Pad>
  );
};
const ProgramCard: React.FC<{ name: string; meta: string; score: string; delay: number; len: number }> = ({ name, meta, score, delay, len }) => (
  <div style={{ ...useEnter(delay, len), background: C.card, border: `1px solid ${C.line}`, borderRadius: 28, padding: '30px 36px',
    display: 'flex', alignItems: 'center', gap: 28 }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 40, color: '#fff' }}>{name}</div>
      <div style={{ fontFamily: BODY, fontSize: 32, color: C.dim, marginTop: 8 }}>{meta}</div>
    </div>
    {score && <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: C.blue }}>{score}</div>}
  </div>
);

/* 3. Cost */
const Cost: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const grow = interpolate(f, [20, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const median = Math.round(9500 * grow);
  const W = 900;
  return (
    <Pad>
      <div style={useEnter(0, len)}><Kicker>What it costs</Kicker></div>
      <div style={useEnter(6, len)}>
        <div style={{ fontFamily: BODY, fontSize: 38, color: C.text }}>Median AI certification course</div>
        <Big size={150}>${median.toLocaleString('en-US')}</Big>
        <div style={{ height: 34, width: W * grow, borderRadius: 17, marginTop: 18, background: `linear-gradient(90deg,${C.violet},${C.pink})` }} />
      </div>
      <div style={{ ...useEnter(60, len), marginTop: 40 }}>
        <div style={{ fontFamily: BODY, fontSize: 38, color: C.text }}>AiRE Part One</div>
        <Big size={150}><Grad warm>$67</Grad></Big>
        <div style={{ height: 34, width: Math.max(10, W * (67 / 9500)), borderRadius: 17, marginTop: 18, background: C.amber }} />
        <div style={{ fontFamily: BODY, fontSize: 34, color: C.dim, marginTop: 22 }}>Lead to Keys: $97</div>
      </div>
      <Source>Median: Forbes Advisor research, Nov 2023. Claude subscription not included in AiRE&rsquo;s price.</Source>
    </Pad>
  );
};

/* 4. Claude Code */
const DOES = ['A drone-style listing video from one photo', 'A month of social posts in your voice', 'Comps, seller updates and follow-up'];
const Claude: React.FC<{ len: number }> = ({ len }) => (
  <Pad>
    <div style={useEnter(0, len)}><Kicker>Same tool, different job</Kicker></div>
    <div style={useEnter(8, len)}><Big size={92}>{React.useContext(AdSafe) ? 'Top AI programs now teach ' : 'Two top programs feature '}<Grad>Claude&nbsp;Code.</Grad></Big></div>
    <div style={useEnter(24, len)}><Big size={92} style={{ color: C.text }}>AiRE teaches it for <Grad warm>Real&nbsp;Estate.</Grad></Big></div>
    {DOES.map((d, i) => (
      <div key={d} style={{ ...useEnter(44 + i * 10, len), display: 'flex', gap: 22, alignItems: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 42, color: '#fff' }}>
        <span style={{ width: 18, height: 18, borderRadius: 9, background: C.blue, flex: 'none' }} />{d}
      </div>
    ))}
  </Pad>
);

/* 5. Honest comparison */
const ROWS: [string, string, string][] = [
  ['Who it’s for', 'Tech & business leaders', 'Real estate agents'],
  ['Time', '6–17 weeks', 'About an hour of lessons'],
  ['Depth', 'Deeper: AI engineering', 'Narrow: your daily work'],
];
const Honest: React.FC<{ len: number }> = ({ len }) => (
  <Pad>
    <div style={useEnter(0, len)}><Kicker>Straight talk</Kicker><Big size={92} style={{ marginTop: 14 }}>Not a bootcamp. A shortcut for agents.</Big></div>
    <div style={{ ...useEnter(14, len), display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, borderRadius: 28, overflow: 'hidden', border: `1px solid ${C.line}` }}>
      {['', 'Top AI programs', 'AiRE Estate'].map((h, i) => (
        <div key={i} style={{ background: '#111b2c', padding: '28px 22px', fontFamily: HEAD, fontWeight: 700, fontSize: 36, color: i === 2 ? C.amber : '#fff' }}>{h}</div>
      ))}
      {ROWS.flatMap((r, ri) => r.map((cell, ci) => (
        <div key={`${ri}${ci}`} style={{ background: C.card, borderTop: `1px solid ${C.line}`, padding: '26px 22px', fontFamily: BODY,
          fontWeight: ci === 0 ? 700 : 500, fontSize: 38, lineHeight: 1.25, color: ci === 0 ? C.dim : ci === 2 ? '#fff' : C.text }}>{cell}</div>
      )))}
    </div>
    <Source>{React.useContext(AdSafe) ? 'Program lengths from published course listings, Oct. 2026.' : <>Program lengths from Forbes Advisor&rsquo;s list.</>} AiRE lesson time from learn.aireestate.com.</Source>
  </Pad>
);

/* 6. Call to action */
const Cta: React.FC = () => (
  <Pad>
    <div style={useEnter(0)}><Big size={132}><Grad warm>AiRE</Grad> Estate</Big></div>
    <div style={useEnter(10)}><Big size={64} style={{ color: C.text }}>AI courses built for Real Estate agents.</Big></div>
    <div style={{ ...useEnter(22), fontFamily: BODY, fontWeight: 700, fontSize: 44, color: '#fff' }}>Part One $67 &middot; Lead to Keys $97</div>
    <div style={{ ...useEnter(32), alignSelf: 'flex-start', background: C.blue, color: C.bg, fontFamily: HEAD, fontWeight: 800, fontSize: 48,
      padding: '26px 44px', borderRadius: 999 }}>learn.aireestate.com</div>
    <Source>Claude subscription not included. {React.useContext(AdSafe) ? 'Not affiliated with any program described.' : 'Not affiliated with or endorsed by Forbes or any program shown.'}</Source>
  </Pad>
);

const ProgressBar: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: 'absolute', left: 0, top: 0, height: 8, width: `${(f / TOTAL) * 100}%`,
    background: `linear-gradient(90deg,${C.blue},${C.violet},${C.pink})` }} />;
};
const AiLabel: React.FC = () => (
  <div style={{ position: 'absolute', right: 50, top: 60, fontFamily: BODY, fontWeight: 700, fontSize: 24, letterSpacing: '.06em',
    color: '#e0f2fe', background: 'rgba(4,7,13,.6)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 999, padding: '10px 18px' }}>Made with AI</div>
);

export const AireVsBootcamps: React.FC<{ adSafe?: boolean }> = ({ adSafe = false }) => {
  const parts: Record<string, React.FC<{ len: number }>> = { hook: Hook, programs: Programs, cost: Cost, claude: Claude, honest: Honest, cta: Cta };
  let at = 0;
  return (
    <AdSafe.Provider value={adSafe}>
    <AbsoluteFill style={{ background: C.bg }}>
      <Backdrop />
      {SCENES.map(({ id, len }) => {
        const P = parts[id];
        const from = at;
        at += len;
        return <Sequence key={id} from={from} durationInFrames={len}><P len={len} /></Sequence>;
      })}
      <ProgressBar />
      <AiLabel />
    </AbsoluteFill>
    </AdSafe.Provider>
  );
};
