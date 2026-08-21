import React from 'react'
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  random,
  delayRender,
  continueRender,
} from 'remotion'
import { brand } from '../lib/brand'
import { fontCss } from '../lib/fonts'

const display = "'Cormorant Garamond', Georgia, serif"
const stamp = "'Bebas Neue', Impact, sans-serif"
const ui = "'DM Sans', system-ui, sans-serif"

/** Injects the inlined webfonts and holds the render until they are ready. */
const FontStyles: React.FC = () => {
  const [handle] = React.useState(() => delayRender('fonts'))
  React.useEffect(() => {
    Promise.all([
      document.fonts.load("400 92px 'Cormorant Garamond'"),
      document.fonts.load("italic 400 92px 'Cormorant Garamond'"),
      document.fonts.load("400 30px 'Bebas Neue'"),
      document.fonts.load("400 27px 'DM Sans'"),
    ])
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle))
  }, [handle])
  return <style dangerouslySetInnerHTML={{ __html: fontCss }} />
}

type Flake = { x: number; y: number; r: number; sp: number; dr: number }

const field = (count: number, seed: string): Flake[] =>
  new Array(count).fill(0).map((_, i) => ({
    x: random(seed + 'x' + i),
    y: random(seed + 'y' + i),
    r: random(seed + 'r' + i),
    sp: random(seed + 's' + i),
    dr: random(seed + 'd' + i),
  }))

const BACK = field(150, 'back')
const FRONT = field(55, 'front')
const SPRAY = field(30, 'spray')

/** Falling snow. `depth` drives size, speed, blur — front layers move fastest. */
const Snow: React.FC<{ flakes: Flake[]; depth: number }> = ({ flakes, depth }) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()
  const size = 3 + depth * 16
  return (
    <AbsoluteFill style={{ filter: `blur(${depth * 2.6}px)` }}>
      {flakes.map((p, i) => {
        const speed = 0.004 + p.sp * 0.007 + depth * 0.010
        const y = ((p.y + frame * speed) % 1.2) - 0.1
        const x = p.x + Math.sin(frame * 0.018 + p.dr * Math.PI * 2) * (0.02 + depth * 0.035)
        const r = size * (0.45 + p.r)
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x * width,
              top: y * height,
              width: r,
              height: r,
              borderRadius: '50%',
              background: brand.colors.white,
              opacity: 0.3 + p.r * 0.55,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

/** Repeating mountain ridge scrolling horizontally for parallax. */
const Ridge: React.FC<{ y: number; h: number; fill: string; speed: number; pts: number[] }> = ({
  y, h, fill, speed, pts,
}) => {
  const frame = useCurrentFrame()
  const { width } = useVideoConfig()
  const shift = -((frame * speed) % width)
  const path = (ox: number) => {
    const step = width / (pts.length - 1)
    let d = `M ${ox} ${h} `
    pts.forEach((p, i) => { d += `L ${ox + i * step} ${h - p * h} ` })
    d += `L ${ox + width} ${h} Z`
    return d
  }
  return (
    <div style={{ position: 'absolute', left: 0, top: y, width, height: h, overflow: 'hidden' }}>
      <svg width={width * 2} height={h} style={{ position: 'absolute', left: shift }}>
        <path d={path(0)} fill={fill} />
        <path d={path(width)} fill={fill} />
      </svg>
    </div>
  )
}

/** Soft blurred snow drifts scrolling past — sells forward travel across the ground. */
const Drifts: React.FC<{
  top: number; speed: number; scale: number; blur: number; fill: string; seed: string; count?: number
}> = ({ top, speed, scale, blur, fill, seed, count = 8 }) => {
  const frame = useCurrentFrame()
  const { width } = useVideoConfig()
  const span = width * 2
  return (
    <div style={{ position: 'absolute', left: 0, top, width, height: scale * 1.6, filter: `blur(${blur}px)` }}>
      {new Array(count * 2).fill(0).map((_, i) => {
        const b = i % count
        const w = scale * (1.8 + random(seed + 'w' + b) * 1.8)
        const h = scale * (0.55 + random(seed + 'h' + b) * 0.5)
        const lane = (b / count) * span + random(seed + 'x' + b) * (span / count)
        const start = lane + (i >= count ? span : 0)
        const x = (((start - frame * speed) % (span * 2)) + span * 2) % (span * 2) - span * 0.5
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: random(seed + 'y' + b) * scale * 0.35,
            width: w, height: h, borderRadius: '50%', background: fill,
          }} />
        )
      })}
    </div>
  )
}

export const DogSnowRun: React.FC = () => {
  const frame = useCurrentFrame()
  const { width, height, durationInFrames } = useVideoConfig()

  const horizon = height * 0.54

  // --- bounding rhythm: one bound every ~20 frames -------------------
  const t = frame * 0.30
  const arc = Math.abs(Math.sin(t))
  const bob = -arc * 44
  const squash = 1 + (1 - arc) * 0.05   // widen on contact
  const stretch = 1 - (1 - arc) * 0.04  // flatten on contact
  const tilt = Math.sin(t * 0.5) * 1.5

  const push = interpolate(frame, [0, durationInFrames], [0.95, 1.07])
  const entry = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' })

  const dogH = 760 * push
  const dogW = dogH * (427 / 988)
  const paws = height * 0.775

  const tIn = (start: number) => ({
    opacity: interpolate(frame, [start, start + brand.timing.slideUp], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
    transform: `translateY(${interpolate(frame, [start, start + brand.timing.slideUp], [24, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })}px)`,
  })
  const ruleX = interpolate(frame, [96, 122], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.navy }}>
      <FontStyles />

      {/* sky: deep navy overhead easing to cold alpine blue at the ridgeline */}
      <AbsoluteFill style={{
        background: `linear-gradient(180deg, ${brand.colors.navy} 0%, ${brand.colors.navyMid} 26%, #24406e 42%, #4a6c9c 54%)`,
      }} />

      {/* low sun glow behind the peaks */}
      <div style={{
        position: 'absolute', left: width * 0.5 - 500, top: horizon - 560,
        width: 1000, height: 1000, borderRadius: '50%',
        background: `radial-gradient(circle, ${brand.colors.goldBright}66 0%, ${brand.colors.gold}2b 36%, transparent 66%)`,
      }} />

      {/* parallax ridges — far layer drifts slowest */}
      <Ridge y={horizon - 320} h={320} fill="#1d3054" speed={0.10}
        pts={[0.35, 0.62, 0.44, 0.78, 0.5, 0.7, 0.38, 0.6, 0.35]} />
      <Ridge y={horizon - 225} h={225} fill="#2a4571" speed={0.26}
        pts={[0.45, 0.3, 0.7, 0.42, 0.85, 0.4, 0.6, 0.35, 0.45]} />
      <Ridge y={horizon - 130} h={130} fill="#3d5f8f" speed={0.58}
        pts={[0.5, 0.75, 0.4, 0.66, 0.8, 0.45, 0.7, 0.55, 0.5]} />

      {/* snowfield */}
      <div style={{
        position: 'absolute', left: 0, top: horizon, width, height: height - horizon,
        background: `linear-gradient(180deg, #b9cee6 0%, #dbe8f7 18%, #f2f7fd 46%, ${brand.colors.white} 78%)`,
      }} />

      {/* drifts: far/slow behind her, near/fast in front — parallax across the ground */}
      <Drifts top={horizon - 14} speed={2.2} scale={62} blur={7} fill="#eef5fd" seed="d1" count={9} />
      <Drifts top={horizon + 96} speed={4.6} scale={92} blur={9} fill="#ffffff" seed="d2" count={7} />

      <Snow flakes={BACK} depth={0.22} />

      {/* contact shadow — tightest and darkest at the moment she lands */}
      <div style={{
        position: 'absolute',
        left: width / 2 - (dogW * 0.44) / 2,
        top: paws - 30,
        width: dogW * 0.44,
        height: 38,
        borderRadius: '50%',
        background: 'rgba(42,69,113,0.38)',
        filter: `blur(${9 + arc * 14}px)`,
        opacity: (0.8 - arc * 0.4) * entry,
      }} />

      {/* the dog */}
      <div style={{
        position: 'absolute',
        left: width / 2 - dogW / 2,
        top: paws - dogH + bob,
        width: dogW,
        height: dogH,
        opacity: entry,
        transform: `rotate(${tilt}deg) scaleX(${squash}) scaleY(${stretch})`,
        transformOrigin: '50% 100%',
      }}>
        <Img src={staticFile('dog.png')} style={{
          width: '100%', height: '100%', objectFit: 'contain',
          filter: 'drop-shadow(0 20px 28px rgba(20,40,70,0.40)) saturate(1.06) contrast(1.04)',
        }} />
      </div>

      {/* near drift crossing in front of her paws so she sits *in* the snow, not on it */}
      <Drifts top={paws - 34} speed={6.4} scale={78} blur={6} fill="#ffffff" seed="d3" count={6} />

      {/* snow kicked up on each landing */}
      {SPRAY.map((p, i) => {
        const life = ((frame + p.dr * 20) % 20) / 20
        const burst = 1 - arc
        const dir = p.x < 0.5 ? -1 : 1
        const sx = width / 2 + dir * (14 + p.sp * 170) * life
        const sy = paws - life * (46 + p.r * 100) + life * life * 80
        return (
          <div key={i} style={{
            position: 'absolute', left: sx, top: sy,
            width: 5 + p.r * 11, height: 5 + p.r * 11, borderRadius: '50%',
            background: brand.colors.white,
            opacity: (1 - life) * 0.8 * burst * entry,
          }} />
        )
      })}

      <Snow flakes={FRONT} depth={0.85} />

      {/* vignette */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 46%, transparent 46%, ${brand.colors.navy}59 100%)`,
      }} />

      {/* bottom scrim keeps the lockup legible over bright snow */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: height * 0.44,
        background: `linear-gradient(180deg, transparent 0%, ${brand.colors.navy}7a 42%, ${brand.colors.navy}ed 100%)`,
      }} />

      {/* brand lockup */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: height * 0.055, textAlign: 'center' }}>
        <div style={{
          ...tIn(10), fontFamily: stamp, color: brand.colors.gold,
          letterSpacing: '0.28em', fontSize: 30, opacity: 0.92,
        }}>EPIVAIL · COLORADO MOUNTAIN REGION</div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: height * 0.07, textAlign: 'center' }}>
        <div style={{
          ...tIn(72), fontFamily: display, color: brand.colors.white, fontSize: 88, lineHeight: 1.05,
          textShadow: '0 4px 30px rgba(10,22,40,0.75)',
        }}>
          Built for the <span style={{ color: brand.colors.gold, fontStyle: 'italic' }}>mountains.</span>
        </div>
        <div style={{
          margin: '28px auto 0', width: 260, height: 1,
          background: brand.colors.gold, transform: `scaleX(${ruleX})`, transformOrigin: 'center',
        }} />
        <div style={{
          ...tIn(140), marginTop: 24, fontFamily: ui, color: brand.colors.cream,
          fontSize: 26, letterSpacing: '0.06em', opacity: 0.9,
          textShadow: '0 2px 18px rgba(10,22,40,0.8)',
        }}>LEADERSHIP. PURPOSE. PEOPLE.</div>
      </div>
    </AbsoluteFill>
  )
}
