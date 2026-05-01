import React from "react";
import { Composition } from "remotion";
import { PayWatchDemo } from "./PayWatchDemo";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="PayWatchDemo"
        component={PayWatchDemo}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Short preview for testing */}
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
