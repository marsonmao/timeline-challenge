import { memo } from "react";
import { Segment } from "./Segment";
import { RenderTracker } from "./RenderTracker";

export const KeyframeList = () => {
  // TODO: implement scroll sync with `Ruler` and `TrackList`

  return (
    <>
      <RenderTracker dataTestId="keyframe-list-render-tracker" />
      <div className="px-4 min-w-0 overflow-auto" data-testid="keyframe-list">
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
      </div>
    </>
  );
};

export const KeyframeListMemoed = memo(KeyframeList);
