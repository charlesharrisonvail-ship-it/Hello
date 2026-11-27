import React from 'react';
import {AbsoluteFill, Audio, Composition, Easing, Sequence, interpolate, registerRoot, spring, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadDM} from '@remotion/google-fonts/DMSans';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadComic} from '@remotion/google-fonts/ComicNeue';
import {loadFont as loadMarker} from '@remotion/google-fonts/PermanentMarker';

const display = loadCormorant('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const displayI = loadCormorant('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;
const ui = loadDM('normal', {weights: ['500', '700'], subsets: ['latin']}).fontFamily;
const stamp = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const comic = loadComic('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const marker = loadMarker('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;

const c = {navy: '#0a1628', navyMid: '#0f1f3d', navyLight: '#172847', gold: '#c9a84c', goldBright: '#e8c66a', goldDim: '#8a6f2e', cream: '#f5f0e8', muted: '#7a8ba8'};
const FPS = 30;
const s = (t: number) => Math.round(t * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ── pieces ──
const Record: React.FC<{size: number; spin: number; label: React.ReactNode; labelBg: string}> = ({size, spin, label, labelBg}) => (
  <div style={{width: size, height: size, borderRadius: '50%', position: 'relative', transform: `rotate(${spin}deg)`,
    background: 'radial-gradient(circle, #222 0%, #111 38%, #1b1b1b 39%, #0c0c0c 60%, #1d1d1d 61%, #0a0a0a 100%)',
    boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 2px #2a2a2a'}}>
    {[0.46, 0.42, 0.38, 0.34, 0.3, 0.26].map((r) => (
      <div key={r} style={{position: 'absolute', inset: size * (0.5 - r), borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)'}} />
    ))}
    <div style={{position: 'absolute', inset: size * 0.3, borderRadius: '50%', background: labelBg, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden'}}>{label}</div>
    <div style={{position: 'absolute', left: '50%', top: '50%', width: size * 0.03, height: size * 0.03, marginLeft: -size * 0.015, marginTop: -size * 0.015, borderRadius: '50%', background: '#0a0a0a'}} />
    {/* sheen */}
    <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 20deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.10) 30deg, rgba(255,255,255,0) 60deg, rgba(255,255,255,0) 180deg, rgba(255,255,255,0.08) 210deg, rgba(255,255,255,0) 240deg)'}} />
  </div>
);

const OriginalLabel: React.FC<{size: number}> = ({size}) => (
  <div>
    <div style={{fontFamily: stamp, fontSize: size * 0.05, letterSpacing: '0.2em', color: c.navy}}>THE ORIGINALS</div>
    <div style={{fontFamily: display, fontSize: size * 0.085, color: c.navy, lineHeight: 1}}>EPIQUE</div>
    <div style={{fontFamily: stamp, fontSize: size * 0.032, letterSpacing: '0.2em', color: c.navy, opacity: 0.8}}>SIDE A · AGENTS FIRST</div>
  </div>
);
const CopyLabel: React.FC<{size: number}> = ({size}) => (
  <div style={{transform: 'rotate(-4deg)'}}>
    <div style={{fontFamily: comic, fontWeight: 700, fontSize: size * 0.05, color: '#d6246e'}}>The Copycats</div>
    <div style={{fontFamily: comic, fontWeight: 700, fontSize: size * 0.03, color: '#2a2a2a'}}>(cover versions)</div>
  </div>
);

// Cheap knockoff sleeve
const CopySleeve: React.FC<{w: number; stickers?: number}> = ({w, stickers = 2}) => (
  <div style={{width: w, height: w, position: 'relative', background: 'linear-gradient(135deg, #ff5fa2 0%, #ffd23f 45%, #3ec7ff 100%)', boxShadow: '0 30px 80px rgba(0,0,0,0.55)', overflow: 'hidden'}}>
    {/* clip-art stars */}
    {[[0.12, 0.1, 0.14], [0.78, 0.15, 0.1], [0.65, 0.72, 0.16], [0.08, 0.68, 0.09]].map(([x, y, r], i) => (
      <div key={i} style={{position: 'absolute', left: x * w, top: y * w, fontSize: r * w, color: '#fff', opacity: 0.8, transform: `rotate(${i * 17}deg)`}}>★</div>
    ))}
    <div style={{position: 'absolute', top: w * 0.2, width: '100%', textAlign: 'center'}}>
      <div style={{fontFamily: comic, fontWeight: 700, fontSize: w * 0.12, color: '#2b1055', lineHeight: 1, textShadow: '4px 4px 0 #fff'}}>THE COPYCATS</div>
      <div style={{fontFamily: comic, fontWeight: 700, fontSize: w * 0.06, color: '#2b1055', marginTop: w * 0.03}}>Epique's Greatest Hits</div>
      <div style={{fontFamily: comic, fontWeight: 700, fontSize: w * 0.045, color: '#2b1055'}}>(Cover Versions)</div>
    </div>
    {stickers >= 1 && (
      <div style={{position: 'absolute', right: w * 0.05, bottom: w * 0.08, width: w * 0.34, height: w * 0.34, borderRadius: '50%', background: '#e8202a', color: '#fff', transform: 'rotate(14deg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: comic, fontWeight: 700, fontSize: w * 0.037, lineHeight: 1.1, padding: w * 0.03, boxSizing: 'border-box'}}>
        NOW WITH 100% MORE "INSPIRATION"
      </div>
    )}
    {stickers >= 2 && (
      <div style={{position: 'absolute', left: w * 0.05, bottom: w * 0.1, background: '#fff', color: '#2b1055', transform: 'rotate(-8deg)', fontFamily: marker, fontSize: w * 0.04, padding: `${w * 0.015}px ${w * 0.03}px`, border: '3px dashed #2b1055'}}>
        "totally our idea"
      </div>
    )}
  </div>
);

const OriginalSleeve: React.FC<{w: number}> = ({w}) => (
  <div style={{width: w, height: w, position: 'relative', background: `radial-gradient(120% 90% at 30% 20%, ${c.navyLight}, ${c.navy})`, border: `3px solid ${c.gold}`, boxShadow: '0 30px 80px rgba(0,0,0,0.55)', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: w * 0.05, border: `1px solid ${c.goldDim}`}} />
    <div style={{position: 'absolute', top: w * 0.2, width: '100%', textAlign: 'center'}}>
      <div style={{fontFamily: stamp, fontSize: w * 0.06, letterSpacing: '0.3em', color: c.gold}}>THE ORIGINALS</div>
      <div style={{fontFamily: display, fontSize: w * 0.2, color: c.goldBright, lineHeight: 1}}>EPIQUE</div>
      <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: w * 0.06, color: c.cream, marginTop: w * 0.02}}>the first pressing</div>
    </div>
    <div style={{position: 'absolute', bottom: w * 0.09, width: '100%', textAlign: 'center', fontFamily: stamp, fontSize: w * 0.04, letterSpacing: '0.25em', color: c.gold}}>AGENTS FIRST · SINCE DAY ONE</div>
  </div>
);

const Pop: React.FC<{at: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties}> = ({at, children, dy = 40, style}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - s(at), fps: FPS, config: {damping: 200, stiffness: 160}});
  if (frame < s(at)) return null;
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style}}>{children}</div>;
};
const Window: React.FC<{a: number; b: number; children: React.ReactNode; style?: React.CSSProperties}> = ({a, b, children, style}) => {
  const frame = useCurrentFrame();
  if (frame < s(a) || frame >= s(b)) return null;
  const o = interpolate(frame, [s(a), s(a) + 10, s(b) - 10, s(b)], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{opacity: o, ...style}}>{children}</AbsoluteFill>;
};
const shadow = '0 4px 24px rgba(0,0,0,0.6)';
const Head: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 92, color = c.cream}) => (
  <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: size, color, lineHeight: 1.05, textShadow: shadow}}>{children}</div>
);
const Kick: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = c.goldBright, size = 48}) => (
  <div style={{fontFamily: stamp, fontSize: size, letterSpacing: '0.22em', color, textShadow: shadow}}>{children}</div>
);

const Bg: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background: `radial-gradient(110% 70% at ${50 + Math.sin(frame / 60) * 10}% 35%, #1d2f52 0%, ${c.navyMid} 50%, ${c.navy} 100%)`}} />;
};

// ── video ──
const T = {open: 0, copy: 4.5, tracks: 9.5, scratch: 16, original: 16.4, end: 21, total: 25};
const TRACKS = [
  ['Agent Healthcare', 0],
  ['Free Prescriptions', 1.3],
  ['Dental & Vision, $25', 2.6],
] as const;

const Video: React.FC = () => {
  const frame = useCurrentFrame();
  // record spins steadily; wobbles during the cover-band section
  const wobble = frame >= s(T.copy) && frame < s(T.scratch) ? Math.sin(frame / 3) * 4 : 0;
  const spin = frame * 6 + wobble;
  const recIn = spring({frame, fps: FPS, config: {damping: 200, stiffness: 80}});
  const copyIn = spring({frame: frame - s(T.copy), fps: FPS, config: {damping: 16, stiffness: 120}});
  const copyOut = interpolate(frame, [s(T.scratch), s(T.scratch) + 12], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const musicVol = (f: number) => {
    if (f >= s(T.copy) && f < s(T.scratch)) return 0.18; // the cover band sounds thin
    if (f >= s(T.scratch) && f < s(T.scratch) + 8) return 0;
    return interpolate(f, [0, 10, s(T.total) - 30, s(T.total)], [0, 0.4, 0.4, 0], clamp);
  };
  return (
    <AbsoluteFill style={{background: c.navy}}>
      <Audio src={staticFile('music.mp3')} volume={musicVol} />
      <Sequence from={s(0.2)}><Audio src={staticFile('sfx/vinyl-needle-drop.mp3')} volume={0.6} /></Sequence>
      <Sequence from={s(T.copy)}><Audio src={staticFile('sfx/cassette-stretch.mp3')} volume={0.45} /></Sequence>
      {TRACKS.map(([, d], i) => <Sequence key={i} from={s(T.tracks + 0.6 + d)}><Audio src={staticFile('sfx/typewriter-hit-hard.mp3')} volume={0.4} /></Sequence>)}
      <Sequence from={s(T.scratch)}><Audio src={staticFile('sfx/vinyl-scratch-small.mp3')} volume={0.8} /></Sequence>
      <Sequence from={s(T.original + 0.6)} durationInFrames={s(3)}><Audio src={staticFile('sfx/applause-rhythmic-loop.mp3')} volume={(f) => interpolate(f, [0, 10, 70, 90], [0, 0.35, 0.35, 0], clamp)} /></Sequence>
      <Sequence from={s(T.end + 1.2)}><Audio src={staticFile('sfx/sparkle-touch.mp3')} volume={0.4} /></Sequence>
      <Bg />

      {/* 1. the original spinning */}
      <Window a={T.open} b={T.copy}>
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 230, textAlign: 'center'}}>
          <Pop at={0.3}><Kick>NOW PLAYING</Kick></Pop>
          <Pop at={1.2}><Head size={96}>Some brokerages are out here…</Head></Pop>
        </AbsoluteFill>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 380, transform: `scale(${0.8 + recIn * 0.2})`, opacity: recIn}}>
          <Record size={760} spin={spin} labelBg={`radial-gradient(circle, ${c.goldBright}, ${c.gold})`} label={<OriginalLabel size={760} />} />
        </AbsoluteFill>
      </Window>

      {/* 2. the cover band arrives */}
      <Window a={T.copy} b={T.tracks}>
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 210, textAlign: 'center', padding: '210px 60px 0'}}>
          <Pop at={T.copy + 0.4}><Head size={84}>playing Epique's greatest hits…</Head></Pop>
          <Pop at={T.copy + 2.2}><Head size={84} color={c.goldBright}>and calling it their debut album.</Head></Pop>
        </AbsoluteFill>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 520}}>
          <div style={{transform: `translateY(${(1 - copyIn) * 900}px) rotate(${-6 + Math.sin(frame / 8) * 1.5}deg)`}}>
            <CopySleeve w={720} />
          </div>
        </AbsoluteFill>
      </Window>

      {/* 3. the tracklist on the back */}
      <Window a={T.tracks} b={T.scratch}>
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 230}}>
          <div style={{width: 900, background: '#fffaf0', padding: '50px 60px', transform: `rotate(-2deg) translateY(${(1 - copyOut) * 0}px)`, boxShadow: '0 30px 80px rgba(0,0,0,0.55)', border: '6px solid #ffd23f'}}>
            <div style={{fontFamily: comic, fontWeight: 700, fontSize: 64, color: '#d6246e', textAlign: 'center'}}>The Copycats</div>
            <div style={{fontFamily: comic, fontWeight: 700, fontSize: 40, color: '#2b1055', textAlign: 'center', marginBottom: 30}}>TRACK LISTING</div>
            {TRACKS.map(([name, d], i) => (
              <Pop key={i} at={T.tracks + 0.6 + d} dy={20}>
                <div style={{fontFamily: comic, fontWeight: 700, fontSize: 50, color: '#2a2a2a', margin: '18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                  <span>{i + 1}. {name}</span>
                  <span style={{fontFamily: marker, fontSize: 34, color: '#e8202a', transform: 'rotate(-6deg)', whiteSpace: 'nowrap', marginLeft: 20}}>(Epique cover)</span>
                </div>
              </Pop>
            ))}
            <Pop at={T.tracks + 4.4} dy={20}>
              <div style={{fontFamily: comic, fontWeight: 700, fontSize: 30, color: '#777', marginTop: 30, textAlign: 'center'}}>all songs originally performed by Epique</div>
            </Pop>
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 420, textAlign: 'center'}}>
          <Pop at={T.tracks + 5}><Head size={90}>We love a good cover band.</Head></Pop>
        </AbsoluteFill>
      </Window>

      {/* 4. scratch: the real thing */}
      <Window a={T.original} b={T.end}>
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 230, textAlign: 'center'}}>
          <Pop at={T.original + 0.2}><Kick size={56}>BUT IF YOU WANT THE REAL THING</Kick></Pop>
        </AbsoluteFill>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 120}}>
          <Pop at={T.original + 0.4} dy={80}><OriginalSleeve w={760} /></Pop>
        </AbsoluteFill>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 300, textAlign: 'center'}}>
          <Pop at={T.original + 1.8}><Head size={84} color={c.goldBright}>you know where the original plays.</Head></Pop>
        </AbsoluteFill>
      </Window>

      {/* 5. end card */}
      <Window a={T.end} b={T.total + 1}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 70}}>
          <Pop at={T.end + 0.2}><div style={{transform: `scale(0.55)`, marginBottom: -150, marginTop: -170}}><Record size={700} spin={spin} labelBg={`radial-gradient(circle, ${c.goldBright}, ${c.gold})`} label={<OriginalLabel size={700} />} /></div></Pop>
          <Pop at={T.end + 0.6}><div style={{fontFamily: display, fontSize: 120, color: c.goldBright}}>Accept no covers.</div></Pop>
          <Pop at={T.end + 1.2} style={{marginTop: 30}}>
            <div style={{background: c.gold, color: c.navy, fontFamily: stamp, fontSize: 54, letterSpacing: '0.12em', padding: '14px 40px', borderRadius: 999}}>COMMENT BELOW & FOLLOW FOR MORE</div>
          </Pop>
          <Pop at={T.end + 1.8} style={{marginTop: 50}}>
            <div style={{fontFamily: stamp, fontSize: 60, letterSpacing: '0.25em', color: c.goldBright}}>EPIVAIL</div>
            <div style={{fontFamily: ui, fontWeight: 700, fontSize: 32, color: c.cream, marginTop: 6}}>Charles Harrison, Epique Area/Growth Leader</div>
          </Pop>
        </AbsoluteFill>
      </Window>

      <div style={{position: 'absolute', top: 70, right: 60, fontFamily: stamp, fontSize: 46, letterSpacing: '0.2em', color: c.gold}}>EPIVAIL</div>
    </AbsoluteFill>
  );
};

// ── static feed graphic (4:5) ──
const Graphic: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(110% 70% at 50% 30%, #1d2f52 0%, ${c.navyMid} 50%, ${c.navy} 100%)`}}>
    <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', padding: '0 60px', boxSizing: 'border-box'}}>
      <Kick size={40}>NOW PLAYING</Kick>
      <Head size={66}>Some brokerages are playing Epique's greatest hits…</Head>
      <Head size={66} color={c.goldBright}>and calling it their debut album.</Head>
    </div>
    {/* the original, record peeking out */}
    <div style={{position: 'absolute', left: 70, top: 430}}>
      <div style={{position: 'absolute', left: 170, top: 20}}><Record size={420} spin={0} labelBg={`radial-gradient(circle, ${c.goldBright}, ${c.gold})`} label={<OriginalLabel size={420} />} /></div>
      <OriginalSleeve w={460} />
    </div>
    {/* the knockoff */}
    <div style={{position: 'absolute', right: 50, top: 520, transform: 'rotate(7deg)'}}>
      <CopySleeve w={420} />
    </div>
    <div style={{position: 'absolute', left: 120, top: 925, fontFamily: stamp, fontSize: 34, letterSpacing: '0.2em', color: c.gold}}>THE ORIGINAL</div>
    <div style={{position: 'absolute', right: 130, top: 990, fontFamily: marker, fontSize: 34, color: '#ff5fa2', transform: 'rotate(-4deg)'}}>the cover band</div>
    <div style={{position: 'absolute', bottom: 60, width: '100%', textAlign: 'center'}}>
      <div style={{fontFamily: display, fontSize: 76, color: c.cream}}>Accept no covers.</div>
      <div style={{fontFamily: stamp, fontSize: 40, letterSpacing: '0.25em', color: c.goldBright, marginTop: 10}}>EPIVAIL</div>
      <div style={{fontFamily: ui, fontWeight: 700, fontSize: 26, color: c.cream, marginTop: 4}}>Charles Harrison, Epique Area/Growth Leader</div>
    </div>
  </AbsoluteFill>
);

registerRoot(() => (
  <>
    <Composition id="CoverBand" component={Video} durationInFrames={s(T.total)} fps={FPS} width={1080} height={1920} />
    <Composition id="CoverBandGraphic" component={Graphic} durationInFrames={1} fps={FPS} width={1080} height={1350} />
  </>
));
