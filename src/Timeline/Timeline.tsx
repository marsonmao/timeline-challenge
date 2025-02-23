import { useMemo, useState } from "react";
import { PlayheadMemoed as Playhead } from "./Playhead";
import { RulerMemoed as Ruler } from "./Ruler";
import { TrackListMemoed as TrackList } from "./TrackList";
import { KeyframeListMemoed as KeyframeList } from "./KeyframeList";
import { PlayControlsMemoed as PlayControls } from "./PlayControls";
import { TimeConfig, TimelineContext } from "./TimelineContext";

export const Timeline = () => {
  const durationTimeConfig = useMemo<TimeConfig>(
    () => ({
      /**
       * In unit of Milliseconds
       */
      step: 10,
      min: 100,
      max: 6000,
    }),
    []
  );
  const [currentTimeConfig, setCurrentTimeConfig] = useState<TimeConfig>({
    /**
     * In unit of Milliseconds
     */
    step: 10,
    min: 0,
    max: 6000,
  });
  const [currentTime, setCurrentTime] = useState(currentTimeConfig.min);
  const [durationTime, setDurationTime] = useState(durationTimeConfig.max);
  const timelineContextValue = {
    currentTime,
    setCurrentTime,
    currentTimeConfig,
    setCurrentTimeConfig,
    durationTime,
    setDurationTime,
    durationTimeConfig,
  };

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
