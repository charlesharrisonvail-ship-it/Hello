import React from 'react';
import { Composition } from 'remotion';
import { DowdReel } from './DowdReel';
import { H, W, brand } from './lib/brand';

export const Root: React.FC = () => (
  <Composition id="DowdReel" component={DowdReel} durationInFrames={900} fps={brand.timing.fps} width={W} height={H} />
);
