import React from 'react';
import {AbsoluteFill, Composition, Img, registerRoot, staticFile} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';

const display = loadCormorant('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
const displayI = loadCormorant('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;
const stamp = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const c = {navy: '#0a1628', gold: '#c9a84c', goldBright: '#e8c66a', cream: '#f5f0e8'};

const Stamp: React.FC<{size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size, color = c.cream, children, style}) => (
  <div style={{fontFamily: stamp, fontSize: size, letterSpacing: '0.16em', color, textShadow: '0 3px 16px rgba(0,0,0,0.7)', ...style}}>{children}</div>
);

const Cover: React.FC<{square: boolean}> = ({square}) => {
  const k = square ? 0.82 : 1;
  return (
    <AbsoluteFill style={{background: c.navy, overflow: 'hidden'}}>
      {/* photo: 1080x1920 source; in square, crop around Olaf */}
      <Img src={staticFile('olaf-still.jpg')} style={{position: 'absolute', width: square ? 1296 : 1080, height: square ? 2304 : 1920, left: square ? 330 : 0, top: square ? -470 : 90}} />
      <AbsoluteFill style={{background: square
        ? 'linear-gradient(90deg, rgba(10,22,40,1) 0%, rgba(10,22,40,1) 33%, rgba(10,22,40,0.6) 52%, rgba(10,22,40,0) 68%)'
        : 'linear-gradient(180deg, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.75) 22%, rgba(10,22,40,0) 40%, rgba(10,22,40,0) 70%, rgba(10,22,40,0.9) 88%)'}} />
      <div style={{position: 'absolute', top: square ? 40 : 70, right: square ? 44 : 60}}><Stamp size={48 * k} color={c.gold}>EPIVAIL</Stamp></div>

      {square ? (
        <div style={{position: 'absolute', left: 60, top: 150, width: 560}}>
          <Stamp size={46}>YOUR LANDLORD GETS</Stamp>
          <div style={{fontFamily: display, fontSize: 196, color: c.goldBright, lineHeight: 0.95, textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>$43,200</div>
          <Stamp size={58} style={{marginTop: 6}}>EVERY. YEAR.</Stamp>
          <div style={{height: 3, width: 300, background: c.gold, margin: '36px 0'}} />
          <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: 74, color: c.cream, lineHeight: 1.05, textShadow: '0 4px 20px rgba(0,0,0,0.7)'}}>Olaf wants<br />his own yard.</div>
          <Stamp size={36} color={c.gold} style={{marginTop: 40}}>VAIL VALLEY · RENT VS. OWN</Stamp>
        </div>
      ) : (
        <>
          <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center'}}>
            <Stamp size={56}>YOUR LANDLORD GETS</Stamp>
            <div style={{fontFamily: display, fontSize: 250, color: c.goldBright, lineHeight: 0.95, textShadow: '0 8px 40px rgba(0,0,0,0.6)'}}>$43,200</div>
            <Stamp size={72}>EVERY. SINGLE. YEAR.</Stamp>
          </div>
          <div style={{position: 'absolute', bottom: 210, width: '100%', textAlign: 'center'}}>
            <div style={{fontFamily: displayI, fontStyle: 'italic', fontSize: 104, color: c.cream, lineHeight: 1, textShadow: '0 4px 24px rgba(0,0,0,0.8)'}}>Olaf wants his own yard.</div>
            <div style={{display: 'inline-block', marginTop: 34, background: c.gold, color: c.navy, fontFamily: stamp, fontSize: 52, letterSpacing: '0.14em', padding: '12px 36px', borderRadius: 999}}>
              VAIL VALLEY · RENT VS. OWN
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <>
    <Composition id="CoverTall" component={Cover} defaultProps={{square: false}} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="CoverSquare" component={Cover} defaultProps={{square: true}} durationInFrames={1} fps={30} width={1080} height={1080} />
  </>
));
