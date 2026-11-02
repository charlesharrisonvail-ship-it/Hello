import React from "react";
import { Composition } from "remotion";
import { ListingFlight, LISTING_FLIGHT_FRAMES } from "./ListingFlight";

export const Root: React.FC = () => (
  <Composition
    id="ListingFlight"
    component={ListingFlight}
    durationInFrames={LISTING_FLIGHT_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);
