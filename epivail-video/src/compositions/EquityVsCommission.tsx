import React from 'react'
import { AbsoluteFill, interpolate, Series, useCurrentFrame } from 'remotion'
import { brand } from '../lib/brand'
import { Eyebrow, GoldRule, Scene, TextReveal } from '../components/primitives'

/**
 * Two conceptual curves: commission (flat, resets) vs equity (compounding).
 * Deliberately unlabeled on the y-axis — this illustrates the shape of the
 * two models, not a projection of returns.
 */
const CompoundingChart: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame()
  const t = frame - delay
  const progress = interpolate(t, [0, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const W = 860
  const H = 420
  const steps = 60
  const shown = Math.max(2, Math.floor(steps * progress))

  const flat: string[] = []
  const curve: string[] = []
  for (let i = 0; i < shown; i++) {
    const x = (i / (steps - 1)) * W
    // Commission: sawtooth — earn, spend, restart. Net stays flat.
    const saw = (i % 12) / 12
    const yFlat = H - 90 - saw * 46
    // Equity: exponential accumulation.
    const yCurve = H - 60 - Math.pow(i / (steps - 1), 2.15) * (H - 110)
    flat.push(`${x},${yFlat}`)
    curve.push(`${x},${yCurve}`)
  }

  const labelOpacity = interpolate(t, [60, 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div style={{ position: 'relative', marginTop: 40 }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        <line x1={0} y1={H - 40} x2={W} y2={H - 40} stroke={brand.colors.navyLight} strokeWidth={3} />
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
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          display: 'flex',
          gap: 56,
          marginTop: 26,
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

export const EquityVsCommission: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: brand.colors.navy }}>
      <Series>
        {/* 1 — HOOK (5s) */}
        <Series.Sequence durationInFrames={150}>
          <Scene>
            <Eyebrow delay={4}>Agent Growth</Eyebrow>
            <GoldRule delay={12} />
            <TextReveal delay={16} size={104}>
              Your commission split
            </TextReveal>
            <TextReveal delay={28} size={104}>
              isn't your biggest
            </TextReveal>
            <TextReveal delay={40} size={104} italic color={brand.colors.goldBright}>
              problem.
            </TextReveal>
          </Scene>
        </Series.Sequence>

        {/* 2 — INCOME (15s) */}
        <Series.Sequence durationInFrames={450}>
          <Scene>
            <Eyebrow delay={4}>The math nobody runs</Eyebrow>
            <GoldRule delay={12} />
            <TextReveal delay={18} size={92}>
              A commission is
            </TextReveal>
            <TextReveal delay={30} size={92} italic color={brand.colors.goldBright}>
              income.
            </TextReveal>
            <div style={{ height: 44 }} />
            <TextReveal
              delay={90}
              size={52}
              font={brand.fonts.ui}
              weight={400}
              color={brand.colors.textMuted}
              lineHeight={1.45}
            >
              You earn it. You spend it.
            </TextReveal>
            <TextReveal
              delay={150}
              size={52}
              font={brand.fonts.ui}
              weight={400}
              color={brand.colors.cream}
              lineHeight={1.45}
            >
              Then you start over at zero.
            </TextReveal>
            <TextReveal
              delay={260}
              size={52}
              font={brand.fonts.ui}
              weight={600}
              color={brand.colors.white}
              lineHeight={1.45}
            >
              Income stops when you stop.
            </TextReveal>
          </Scene>
        </Series.Sequence>

        {/* 3 — EQUITY (20s) */}
        <Series.Sequence durationInFrames={600}>
          <Scene>
            <Eyebrow delay={4}>The other column</Eyebrow>
            <GoldRule delay={12} />
            <TextReveal delay={18} size={92}>
              Equity is
            </TextReveal>
            <TextReveal delay={30} size={92} italic color={brand.colors.goldBright}>
              ownership.
            </TextReveal>
            <CompoundingChart delay={110} />
            <TextReveal
              delay={330}
              size={50}
              font={brand.fonts.ui}
              weight={400}
              color={brand.colors.textMuted}
              lineHeight={1.45}
            >
              Stock. Revenue share. A stake that
            </TextReveal>
            <TextReveal
              delay={360}
              size={50}
              font={brand.fonts.ui}
              weight={600}
              color={brand.colors.white}
              lineHeight={1.45}
            >
              keeps working after you close.
            </TextReveal>
          </Scene>
        </Series.Sequence>

        {/* 4 — THE LINE (15s) */}
        <Series.Sequence durationInFrames={450}>
          <Scene>
            <Eyebrow delay={4}>What I keep hearing</Eyebrow>
            <GoldRule delay={12} />
            <TextReveal delay={20} size={88} lineHeight={1.2}>
              The agents joining us
            </TextReveal>
            <TextReveal delay={34} size={88} lineHeight={1.2}>
              aren't leaving
            </TextReveal>
            <TextReveal delay={48} size={88} lineHeight={1.2}>
              brokerages.
            </TextReveal>
            <div style={{ height: 52 }} />
            <TextReveal delay={190} size={88} lineHeight={1.2} color={brand.colors.cream}>
              They're leaving a
            </TextReveal>
            <TextReveal
              delay={205}
              size={98}
              italic
              color={brand.colors.goldBright}
              lineHeight={1.2}
            >
              model.
            </TextReveal>
          </Scene>
        </Series.Sequence>

        {/* 5 — CTA (5s) */}
        <Series.Sequence durationInFrames={150}>
          <Scene>
            <Eyebrow delay={4}>Epique Mountain Collective</Eyebrow>
            <GoldRule delay={10} />
            <TextReveal delay={14} size={78} lineHeight={1.2}>
              Follow for the numbers
            </TextReveal>
            <TextReveal delay={26} size={78} lineHeight={1.2} italic color={brand.colors.goldBright}>
              nobody shows you.
            </TextReveal>
            <div style={{ height: 56 }} />
            <TextReveal
              delay={52}
              size={46}
              font={brand.fonts.ui}
              weight={600}
              color={brand.colors.white}
            >
              Charles Harrison
            </TextReveal>
            <TextReveal
              delay={62}
              size={38}
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
}
