import React from 'react';
import { Composition } from 'remotion';
import { AireVsBootcamps, TOTAL } from './AireVsBootcamps';

export const Root: React.FC = () => (
  <Composition
    id="AireVsBootcamps"
    component={AireVsBootcamps}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
