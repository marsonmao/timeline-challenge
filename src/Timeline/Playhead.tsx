import { forwardRef, memo, useContext } from "react";
import { RenderTracker } from "./RenderTracker";
import { TimeContext } from "./TimeContext";

export const Playhead = forwardRef<HTMLDivElement>((_props, ref) => {
  const { currentTime, durationTime } = useContext(TimeContext);

  return (
    <>
      <RenderTracker dataTestId="playhead-render-tracker" />
      <div
        className="min-w-0 h-full pointer-events-none px-4 absolute left-[300px] top-0 right-0 bottom-0 overflow-x-auto overflow-y-hidden"
        ref={ref}
      >
        <div
          style={{
            width: `${durationTime}px`,
            height: "100%",
          }}
        ></div>
        <div
          className="absolute top-0 h-full border-l-2 border-solid border-yellow-600 z-10"
          data-testid="playhead"
          style={{ transform: `translateX(calc(${currentTime}px - 50%))` }}
          ref={ref}
        >
          <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
        </div>
      </div>
    </>
  );
});

export const PlayheadMemoed = memo(Playhead);
