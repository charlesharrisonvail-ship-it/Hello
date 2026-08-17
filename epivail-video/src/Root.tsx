import React from 'react'
import { Composition } from 'remotion'
import { EquityVsCommission } from './compositions/EquityVsCommission'
import { EquityVsCommissionShort } from './compositions/EquityVsCommissionShort'
import { FontGate } from './components/FontGate'
import { brand } from './lib/brand'

const gate = (Inner: React.FC): React.FC =>
  function Gated() {
    return (
      <FontGate>
        <Inner />
      </FontGate>
    )
  }

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="EquityVsCommissionShort"
      component={gate(EquityVsCommissionShort)}
      durationInFrames={450}
      fps={brand.timing.fps}
      width={1080}
      height={1920}
    />
    <Composition
      id="EquityVsCommission"
      component={gate(EquityVsCommission)}
      durationInFrames={1800}
      fps={brand.timing.fps}
      width={1080}
      height={1920}
    />
  </>
)
