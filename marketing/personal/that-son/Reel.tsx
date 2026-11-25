import React from 'react';
import {AbsoluteFill, Composition, OffthreadVideo, Sequence, interpolate, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/google-fonts/RobotoCondensed';

const font = loadFont('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const FPS = 30;
const A_LEN = Math.round((7.26 / 0.85) * FPS); // clip A slowed to 0.85×
const B_LEN = Math.round(5.95 * FPS);
const XF = 18; // crossfade frames
const TOTAL = A_LEN + B_LEN - XF;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const BODY = [
  "Every family has that one son",
  "who's built a life, burned it down,",
  "rebuilt it, made every mistake",
  "the hard way, swears too much,",
  "loves too hard, will stand up",
  "to a man twice his size, somehow",
  "gives great advice he never",
  "follows, and has enough stories",
  "to make his parents question",
  "how he's still alive.",
].join(String.fromCharCode(10));

const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const bIn = interpolate(frame, [A_LEN - XF, A_LEN], [0, 1], clamp);
  const body = interpolate(frame, [8, 26], [0, 1], clamp);
  const punchAt = Math.round(10.2 * FPS);
  const punch = interpolate(frame, [punchAt, punchAt + 18], [0, 1], clamp);
  const drift = interpolate(frame, [0, TOTAL], [1.0, 1.06]);
  const text: React.CSSProperties = {fontFamily: font, color: 'rgba(255,255,255,0.93)', textAlign: 'center', textShadow: '0 2px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.45)'};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${drift})`, filter: 'contrast(0.86) saturate(0.8) brightness(0.92)'}}>
        <Sequence durationInFrames={A_LEN}><OffthreadVideo src={staticFile('a.mp4')} playbackRate={0.85} muted /></Sequence>
        <Sequence from={A_LEN - XF}><AbsoluteFill style={{opacity: bIn}}><OffthreadVideo src={staticFile('b.mp4')} muted /></AbsoluteFill></Sequence>
      </AbsoluteFill>
      {/* the soft, sun-washed haze of the original */}
      <AbsoluteFill style={{background: 'radial-gradient(80% 60% at 25% 20%, rgba(255,236,205,0.35), rgba(255,236,205,0) 70%)'}} />
      <AbsoluteFill style={{background: 'rgba(30,24,18,0.42)'}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 70px'}}>
        <div style={{...text, fontSize: 70, lineHeight: 1.17, opacity: body, marginTop: -60, whiteSpace: 'pre-line'}}>{BODY}</div>
        <div style={{...text, fontSize: 74, marginTop: 90, opacity: punch, transform: `translateY(${(1 - punch) * 14}px)`}}>I'm that son...</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

registerRoot(() => <Composition id="ThatSon" component={Reel} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />);
