import { forwardRef, memo } from "react";
import { RenderTracker } from "./RenderTracker";
import { ScrollSyncElement } from "./useScroll";

const Track = ({ name }: { name: string }) => {
  return (
    <div className="p-2 select-none">
      <div>{name}</div>
    </div>
  );
};

export type TrackListProps = ScrollSyncElement;

export const TrackList = forwardRef<HTMLDivElement, TrackListProps>(
  ({ onScroll }, ref) => {
    return (
      <>
        <RenderTracker dataTestId="track-list-render-tracker" />
        <div
          className="grid grid-flow-row auto-rows-[40px]
      border-r border-solid border-r-gray-700 
      overflow-auto"
          data-testid="track-list"
          ref={ref}
          onScroll={onScroll}
        >
          <Track name="Track A" />
          <Track name="Track B" />
          <Track name="Track C" />
          <Track name="Track D" />
          <Track name="Track E" />
          <Track name="Track F" />
          <Track name="Track G" />
          <Track name="Track H" />
          <Track name="Track I" />
          <Track name="Track J" />
        </div>
      </>
    );
  }
);

TrackList.displayName = "TrackList";

export const TrackListMemoed = memo(TrackList);
