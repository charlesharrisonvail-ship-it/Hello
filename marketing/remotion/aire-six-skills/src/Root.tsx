import React from 'react';
import { Composition } from 'remotion';
import { AireSixSkills, TOTAL } from './AireSixSkills';
import { H, W, brand } from './lib/brand';

export const Root: React.FC = () => (
  <Composition id="AireSixSkills" component={AireSixSkills} durationInFrames={TOTAL} fps={brand.timing.fps} width={W} height={H} />
);
