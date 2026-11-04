import React from 'react';
import { Composition } from 'remotion';
import { AireVsBootcamps, TOTAL } from './AireVsBootcamps';

export const Root: React.FC = () => (
  <>
  <Composition
    id="AireVsBootcamps"
    component={AireVsBootcamps}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="AireVsBootcampsAd"
    component={AireVsBootcamps}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{ adSafe: true }}
  />
  {/* Reddit video ads take 1:1 or 4:5, not 9:16 */}
  <Composition
    id="AireVsBootcampsAdReddit"
    component={AireVsBootcamps}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1350}
    defaultProps={{ adSafe: true }}
  />
  </>
);
