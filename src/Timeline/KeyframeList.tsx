import { memo } from "react";
import { Segment } from "./Segment";

export const KeyframeList = () => {
  // TODO: implement scroll sync with `Ruler` and `TrackList`

  return (
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
  );
};

export const KeyframeListMemoed = memo(KeyframeList)
