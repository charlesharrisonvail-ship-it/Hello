import React from 'react';
import {AbsoluteFill, Composition, Img, registerRoot, staticFile} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadDM} from '@remotion/google-fonts/DMSans';
const displayI = loadCormorant('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;
const stamp = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const ui = loadDM('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const c = {gold: '#c9a84c', goldBright: '#e8c66a', cream: '#f5f0e8'};
const sh = '0 6px 30px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)';
const Pin = () => <svg width="26" height="34" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0zm0 16a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" fill={c.goldBright} /></svg>;
const Thumb: React.FC<{square: boolean}> = ({square}) => (
  <AbsoluteFill style={{background: '#0a1628'}}>
    <Img src={staticFile('kthumb.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: square ? '50% 55%' : '50% 50%'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.2) 30%, rgba(10,22,40,0) 55%, rgba(10,22,40,0.88) 100%)'}} />
    <div style={{position: 'absolute', top: square ? 40 : 70, right: square ? 44 : 60, fontFamily: stamp, fontSize: 44, letterSpacing: '0.2em', color: c.gold, textShadow: sh}}>EPIVAIL</div>
    <div style={{position: 'absolute', top: square ? 110 : 180, width: '100%', textAlign: 'center'}}>
      <div style={{fontFamily: stamp, fontSize: square ? 42 : 58, letterSpacing: '0.22em', color: c.goldBright, textShadow: sh}}>SCHLOSS KIRCHBERG AN DER JAGST</div>
    </div>
    <div style={{position: 'absolute', bottom: square ? 60 : 210, width: '100%', textAlign: 'center'}}>
      <div style={{fontFamily: stamp, fontSize: square ? 116 : 140, lineHeight: 0.95, color: c.cream, textShadow: sh}}>KAFFEE UND KUCHEN</div>
      <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: square ? 64 : 80, color: c.goldBright, textShadow: sh}}>coffee & cake in a castle</div>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 16, fontFamily: ui, fontSize: square ? 30 : 36, color: c.cream, textShadow: sh}}><Pin />Kirchberg an der Jagst, Germany</div>
    </div>
  </AbsoluteFill>
);
registerRoot(() => (<>
  <Composition id="ThumbTall" component={Thumb} defaultProps={{square: false}} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="ThumbSquare" component={Thumb} defaultProps={{square: true}} durationInFrames={1} fps={30} width={1080} height={1080} />
</>));
