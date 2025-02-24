import { useMemo, useRef, useState } from "react";
import { KeyframeListMemoed as KeyframeList } from "./KeyframeList";
import { PlayControlsMemoed as PlayControls } from "./PlayControls";
import { PlayheadMemoed as Playhead } from "./Playhead";
import { RulerMemoed as Ruler } from "./Ruler";
import { TimeConfig, TimeContext } from "./TimeContext";
import { TrackListMemoed as TrackList } from "./TrackList";
import { useScroll } from "./useScroll";

export const Timeline = () => {
  /**
   * Time context
   */
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
  const timeContextValue = {
    currentTime,
    setCurrentTime,
    currentTimeConfig,
    setCurrentTimeConfig,
    durationTime,
    setDurationTime,
    durationTimeConfig,
  };

  /**
   * Scroll behavior
   */
  const rulerRef = useRef<HTMLDivElement>(null);
  const keyframeListRef = useRef<HTMLDivElement>(null);
  const trackListRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const { syncScrollX, syncScrollY, syncBothScroll } = useScroll({
    scrollXElements: [
      () => rulerRef.current,
      () => keyframeListRef.current,
      () => playheadRef.current,
    ],
    scrollYElements: [
      () => keyframeListRef.current,
      () => trackListRef.current,
    ],
  });

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <TimeContext.Provider value={timeContextValue}>
        <PlayControls />
        <Ruler ref={rulerRef} onScroll={syncScrollX} />
        <TrackList ref={trackListRef} onScroll={syncScrollY} />
        <KeyframeList ref={keyframeListRef} onScroll={syncBothScroll} />
        <Playhead ref={playheadRef} />
      </TimeContext.Provider>
    </div>
  );
};
