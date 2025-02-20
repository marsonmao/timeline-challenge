import { useState } from "react";
import { PlayheadMemoed as Playhead } from "./Playhead";
import { RulerMemoed as Ruler } from "./Ruler";
import { TrackListMemoed as TrackList } from "./TrackList";
import { KeyframeListMemoed as KeyframeList } from "./KeyframeList";
import { PlayControlsMemoed as PlayControls } from "./PlayControls";
import { TimelineContext } from "./TimelineContext";

export const Timeline = () => {
  const [time, setTime] = useState(0);
  const timelineContextValue = { time, setTime };

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <TimelineContext.Provider value={timelineContextValue}>
        <PlayControls />
        <Ruler />
        <TrackList />
        <KeyframeList />
        <Playhead />
      </TimelineContext.Provider>
    </div>
  );
};
