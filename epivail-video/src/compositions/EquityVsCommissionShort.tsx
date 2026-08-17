import React from 'react'
import { AbsoluteFill, interpolate, Series, useCurrentFrame } from 'remotion'
import { brand } from '../lib/brand'
import { Eyebrow, GoldRule, Scene, TextReveal } from '../components/primitives'

/**
 * Fast-drawing version of the two curves: commission as a sawtooth that keeps
 * resetting, equity as a compounding rise. Unlabeled by design — this shows
 * the shape of the two models, not a projection of returns.
 */
const CompoundingChartFast: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame()
  const t = frame - delay
  const progress = interpolate(t, [0, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const W = 860
  const H = 340
  const steps = 60
  const shown = Math.max(2, Math.floor(steps * progress))

  const flat: string[] = []
  const curve: string[] = []
  for (let i = 0; i < shown; i++) {
    const x = (i / (steps - 1)) * W
    const saw = (i % 12) / 12
    flat.push(`${x},${H - 80 - saw * 40}`)
    curve.push(`${x},${H - 55 - Math.pow(i / (steps - 1), 2.15) * (H - 95)}`)
  }

  const labelOpacity = interpolate(t, [40, 58], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div style={{ position: 'relative', marginTop: 30 }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        <line x1={0} y1={H - 35} x2={W} y2={H - 35} stroke={brand.colors.navyLight} strokeWidth={3} />
        <polyline
          points={flat.join(' ')}
          fill="none"
          stroke={brand.colors.textMuted}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <polyline
          points={curve.join(' ')}
          fill="none"
          stroke={brand.colors.gold}
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          display: 'flex',
          gap: 56,
          marginTop: 20,
          opacity: labelOpacity,
          fontFamily: brand.fonts.ui,
          fontSize: 34,
        }}
      >
        <span style={{ color: brand.colors.textMuted }}>
          <span style={{ fontSize: 42, lineHeight: 0 }}>—</span> Commission
        </span>
        <span style={{ color: brand.colors.gold, fontWeight: 600 }}>
          <span style={{ fontSize: 42, lineHeight: 0 }}>—</span> Equity
        </span>
      </div>
    </div>
  )
}

/** 15 seconds / 450 frames at 30fps. Four beats, no dead air. */
export const EquityVsCommissionShort: React.FC = () => (
  <AbsoluteFill style={{ background: brand.colors.navy }}>
    <Series>
      {/* 1 — HOOK (3s) */}
      <Series.Sequence durationInFrames={90}>
        <Scene>
          <Eyebrow delay={0}>Agent Growth</Eyebrow>
          <GoldRule delay={4} />
          <TextReveal delay={6} size={110}>
            Your commission split
          </TextReveal>
          <TextReveal delay={16} size={110} italic color={brand.colors.goldBright}>
            isn't the problem.
          </TextReveal>
        </Scene>
      </Series.Sequence>

      {/* 2 — INCOME (3s) */}
      <Series.Sequence durationInFrames={90}>
        <Scene>
          <Eyebrow delay={0}>The math nobody runs</Eyebrow>
          <GoldRule delay={4} />
          <TextReveal delay={6} size={102}>
            A commission is
          </TextReveal>
          <TextReveal delay={14} size={102} italic color={brand.colors.goldBright}>
            income.
          </TextReveal>
          <div style={{ height: 36 }} />
          <TextReveal
            delay={38}
            size={56}
            font={brand.fonts.ui}
            weight={600}
            color={brand.colors.white}
            lineHeight={1.4}
          >
            It stops when you stop.
          </TextReveal>
        </Scene>
      </Series.Sequence>

      {/* 3 — EQUITY (5s) */}
      <Series.Sequence durationInFrames={150}>
        <Scene>
          <Eyebrow delay={0}>The other column</Eyebrow>
          <GoldRule delay={4} />
          <TextReveal delay={6} size={102}>
            Equity is
          </TextReveal>
          <TextReveal delay={14} size={102} italic color={brand.colors.goldBright}>
            ownership.
          </TextReveal>
          <CompoundingChartFast delay={34} />
          <TextReveal
            delay={104}
            size={52}
            font={brand.fonts.ui}
            weight={600}
            color={brand.colors.white}
            lineHeight={1.4}
          >
            It keeps working after you close.
          </TextReveal>
        </Scene>
      </Series.Sequence>

      {/* 4 — THE LINE + CTA (4s) */}
      <Series.Sequence durationInFrames={120}>
        <Scene>
          <Eyebrow delay={0}>Epique Mountain Collective</Eyebrow>
          <GoldRule delay={4} />
          <TextReveal delay={6} size={86} lineHeight={1.18}>
            They're not leaving
          </TextReveal>
          <TextReveal delay={14} size={86} lineHeight={1.18}>
            brokerages.
          </TextReveal>
          <div style={{ height: 30 }} />
          <TextReveal delay={40} size={86} lineHeight={1.18} color={brand.colors.cream}>
            They're leaving a
          </TextReveal>
          <TextReveal delay={48} size={96} italic color={brand.colors.goldBright} lineHeight={1.18}>
            model.
          </TextReveal>
          <div style={{ height: 44 }} />
          <TextReveal
            delay={74}
            size={44}
            font={brand.fonts.ui}
            weight={600}
            color={brand.colors.white}
          >
            Charles Harrison
          </TextReveal>
          <TextReveal
            delay={80}
            size={36}
            font={brand.fonts.ui}
            weight={400}
            color={brand.colors.gold}
          >
            Epique Area/Growth Leader
          </TextReveal>
        </Scene>
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
)
