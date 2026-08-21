import React from 'react'
import { Composition } from 'remotion'
import { DogSnowRun } from './compositions/DogSnowRun'

export const RemotionRoot: React.FC = () => (
  <>
    {/* 10 seconds @ 30fps, vertical for Reels / TikTok / Shorts */}
    <Composition
      id="DogSnowRun"
      component={DogSnowRun}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
    {/* same scene, horizontal for web / LinkedIn */}
    <Composition
      id="DogSnowRunWide"
      component={DogSnowRun}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
)
