import { forwardRef, memo, useContext } from "react";
import { useInView } from "react-intersection-observer";
import { RenderTracker } from "./RenderTracker";
import { TimeContext } from "./TimeContext";

export const Playhead = forwardRef<HTMLDivElement>((_props, ref) => {
  const { currentTime, durationTime } = useContext(TimeContext);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
  });
  const playheadStyle: React.HTMLAttributes<HTMLDivElement>["style"] = {
    transform: `translateX(calc(${currentTime}px - 50%))`,
    transition: "transform 0.1s",
  };

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
          className="absolute top-0 h-[2px] w-[2px] bg-transparent"
          ref={inViewRef}
          style={playheadStyle}
        ></div>
        <div
          className="absolute top-0 h-full border-l-2 border-solid border-yellow-600 z-10"
          data-testid="playhead"
          style={playheadStyle}
          ref={ref}
          hidden={!inView}
        >
          <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
        </div>
      </div>
    </>
  );
});

export const PlayheadMemoed = memo(Playhead);
