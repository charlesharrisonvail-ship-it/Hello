import React from 'react';
import { Composition } from 'remotion';
import { RmrReel } from './RmrReel';
import { H, W, brand } from './lib/brand';

export const Root: React.FC = () => (
  <Composition id="RmrReel" component={RmrReel} durationInFrames={900} fps={brand.timing.fps} width={W} height={H} />
);
