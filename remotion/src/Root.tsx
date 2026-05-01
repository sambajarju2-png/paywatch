import React from "react";
import { Composition } from "remotion";
import { PayWatchDemo } from "./PayWatchDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main 90-second promo — 1080×1920 vertical (9:16) */}
      <Composition
        id="PayWatchDemo"
        component={PayWatchDemo}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Short preview — first 30 seconds only */}
      <Composition
        id="PayWatchPreview"
        component={PayWatchDemo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
