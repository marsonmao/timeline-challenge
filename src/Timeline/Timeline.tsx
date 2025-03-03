import { useRef } from "react";
import { KeyframeListMemoed as KeyframeList } from "./KeyframeList";
import { PlayControlsMemoed as PlayControls } from "./PlayControls";
import { PlayheadMemoed as Playhead } from "./Playhead";
import { RulerMemoed as Ruler } from "./Ruler";
import { Provider } from "jotai";
import { TrackListMemoed as TrackList } from "./TrackList";
import { useScroll } from "./useScroll";
import { useTimeStore } from "./useTime";

export const Timeline = () => {
  /**
   * Time store
   */
  const timeStore = useTimeStore({
    initialDurationTimeConfig: {
      /**
       * In unit of Milliseconds
       */
      step: 10,
      min: 100,
      max: 6000,
    },
    initialCurrentTimeConfig: {
      /**
       * In unit of Milliseconds
       */
      step: 10,
      min: 0,
      max: 6000,
    },
  });

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
      className="
        relative 
        h-[300px] w-full 
        grid grid-cols-[theme('spacing.timeline-column-1')_1fr] grid-rows-[40px_1fr] 
      bg-gray-800 border-t-2 border-solid border-gray-700
      "
      data-testid="timeline"
    >
      <Provider store={timeStore}>
        <PlayControls />
        <Ruler ref={rulerRef} onScroll={syncScrollX} />
        <TrackList ref={trackListRef} onScroll={syncScrollY} />
        <KeyframeList ref={keyframeListRef} onScroll={syncBothScroll} />
        <Playhead ref={playheadRef} />
      </Provider>
    </div>
  );
};
