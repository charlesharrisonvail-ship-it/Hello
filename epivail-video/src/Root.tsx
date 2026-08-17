import React from 'react'
import { Composition } from 'remotion'
import { EquityVsCommission } from './compositions/EquityVsCommission'
import { FontGate } from './components/FontGate'
import { brand } from './lib/brand'

const Gated: React.FC = () => (
  <FontGate>
    <EquityVsCommission />
  </FontGate>
)

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="EquityVsCommission"
      component={Gated}
      durationInFrames={1800}
      fps={brand.timing.fps}
      width={1080}
      height={1920}
    />
  </>
)
