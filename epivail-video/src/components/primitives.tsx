import React from 'react'
import { interpolate, useCurrentFrame } from 'remotion'
import { brand } from '../lib/brand'

/** Slow gold "ember" drift over navy — the ambient bed under every scene. */
export const AmbientBed: React.FC = () => {
  const frame = useCurrentFrame()
  const motes = React.useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        seed: i * 137.5,
        x: (i * 61) % 100,
        baseY: (i * 43) % 100,
        size: 2 + (i % 4),
        speed: 0.006 + (i % 5) * 0.0018,
        alpha: 0.1 + (i % 4) * 0.06,
      })),
    []
  )
  return (
    <>
      {motes.map((m, i) => {
        const y = (m.baseY - frame * m.speed * 8 + 200) % 120
        const drift = Math.sin(frame * 0.012 + m.seed) * 14
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${m.x}%`,
              top: `${y}%`,
              width: m.size,
              height: m.size,
              marginLeft: drift,
              borderRadius: '50%',
              background: brand.colors.gold,
              opacity: m.alpha,
            }}
          />
        )
      })}
    </>
  )
}

/** Bebas eyebrow — all caps, letter-spaced, gold. */
export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame - delay, [0, brand.timing.fadeIn], [0, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <div
      style={{
        fontFamily: brand.fonts.stamp,
        fontSize: 40,
        letterSpacing: '0.25em',
        color: brand.colors.gold,
        opacity,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  )
}

/** Gold rule that draws in from the left. */
export const GoldRule: React.FC<{ delay?: number; width?: number }> = ({
  delay = 0,
  width = 180,
}) => {
  const frame = useCurrentFrame()
  const scaleX = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <div
      style={{
        width,
        height: 5,
        background: brand.colors.gold,
        transform: `scaleX(${scaleX})`,
        transformOrigin: 'left',
        margin: '28px 0 40px',
      }}
    />
  )
}

/** Signature reveal: slide up + fade. */
export const TextReveal: React.FC<{
  children: React.ReactNode
  delay?: number
  size?: number
  font?: string
  color?: string
  weight?: number
  lineHeight?: number
  italic?: boolean
  letterSpacing?: string
}> = ({
  children,
  delay = 0,
  size = 96,
  font = brand.fonts.display,
  color = brand.colors.white,
  weight = 600,
  lineHeight = 1.12,
  italic = false,
  letterSpacing = 'normal',
}) => {
  const frame = useCurrentFrame()
  const t = frame - delay
  const translateY = interpolate(t, [0, 15], [28, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const opacity = interpolate(t, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <div
      style={{
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal',
        color,
        lineHeight,
        letterSpacing,
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      {children}
    </div>
  )
}

/** Scene shell: navy ground, ambient motes, generous vertical padding. */
export const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(165deg, ${brand.colors.navyMid} 0%, ${brand.colors.navy} 55%, #060e1a 100%)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 110px',
      overflow: 'hidden',
    }}
  >
    <AmbientBed />
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
)
