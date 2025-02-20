import { memo, useContext } from "react";
import { TimelineContext } from "./TimelineContext";
import { RenderTracker } from "./RenderTracker";

export const Playhead = () => {
  const { time } = useContext(TimelineContext);

  return (
    <>
      <RenderTracker dataTestId="playhead-render-tracker" />
      <div
        className="absolute left-[316px] h-full border-l-2 border-solid border-yellow-600 z-10"
        data-testid="playhead"
        style={{ transform: `translateX(calc(${time}px - 50%))` }}
      >
        <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
      </div>
    </>
  );
};

export const PlayheadMemoed = memo(Playhead);
