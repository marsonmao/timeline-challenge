import { memo } from "react";
import { RenderTracker } from "./RenderTracker";

const Track = ({ name }: { name: string }) => {
  return (
    <div className="p-2 select-none">
      <div>{name}</div>
    </div>
  );
};

export const TrackList = () => {
  // TODO: implement scroll sync with `KeyframeList`

  return (
    <>
      <RenderTracker dataTestId="track-list-render-tracker" />
      <div
        className="grid grid-flow-row auto-rows-[40px]
      border-r border-solid border-r-gray-700 
      overflow-auto"
        data-testid="track-list"
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
};

export const TrackListMemoed = memo(TrackList);
