import React from 'react';
import {AbsoluteFill, Composition, Img, registerRoot, staticFile} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadDM} from '@remotion/google-fonts/DMSans';
const displayI = loadCormorant('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;
const stamp = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const ui = loadDM('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const c = {navy: '#0a1628', gold: '#c9a84c', goldBright: '#e8c66a', cream: '#f5f0e8'};
const sh = '0 6px 30px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5)';
const Cover: React.FC<{square: boolean}> = ({square}) => (
  <AbsoluteFill style={{background: c.navy, overflow: 'hidden'}}>
    <Img src={staticFile('gate.jpg')} style={{position: 'absolute', width: 1080, height: 1920, top: square ? -330 : 0}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.25) 35%, rgba(10,22,40,0.1) 60%, rgba(10,22,40,0.85) 100%)'}} />
    <div style={{position: 'absolute', top: square ? 40 : 70, right: square ? 44 : 60, fontFamily: stamp, fontSize: 44, letterSpacing: '0.2em', color: c.gold, textShadow: sh}}>EPIVAIL</div>
    <div style={{position: 'absolute', top: square ? 90 : 230, width: '100%', textAlign: 'center'}}>
      <div style={{fontFamily: stamp, fontSize: square ? 50 : 60, letterSpacing: '0.22em', color: c.goldBright, textShadow: sh}}>GERMANY · WEIHNACHTSMÄRKTE</div>
      <div style={{fontFamily: stamp, fontSize: square ? 140 : 150, lineHeight: 0.95, color: c.cream, textShadow: sh}}>3 MARKETS. 3 MUGS.</div>
    </div>
    <div style={{position: 'absolute', bottom: square ? 60 : 230, width: '100%', textAlign: 'center'}}>
      <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: square ? 80 : 104, color: c.cream, textShadow: sh}}>which mug wins?</div>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 20, fontFamily: ui, fontSize: square ? 30 : 36, color: c.cream, textShadow: sh}}>
        <svg width="26" height="34" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0zm0 16a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" fill={c.goldBright} /></svg>
        Heidelberg · Mannheim · Rothenburg
      </div>
    </div>
  </AbsoluteFill>
);
registerRoot(() => (<>
  <Composition id="CoverTall" component={Cover} defaultProps={{square: false}} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="CoverSquare" component={Cover} defaultProps={{square: true}} durationInFrames={1} fps={30} width={1080} height={1080} />
</>));
