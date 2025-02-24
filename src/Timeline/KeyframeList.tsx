import { forwardRef, memo } from "react";
import { Segment } from "./Segment";
import { RenderTracker } from "./RenderTracker";
import { ScrollSyncElement } from "./useScroll";

export type KeyframeListProps = ScrollSyncElement;

export const KeyframeList = forwardRef<HTMLDivElement, KeyframeListProps>(
  ({ onScroll }, ref) => {
    return (
      <>
        <RenderTracker dataTestId="keyframe-list-render-tracker" />
        <div
          className="px-4 min-w-0 overflow-auto"
          data-testid="keyframe-list"
          ref={ref}
          onScroll={onScroll}
        >
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
  }
);

export const KeyframeListMemoed = memo(KeyframeList);
