import { forwardRef, memo, useCallback } from "react";
import { RenderTracker } from "./RenderTracker";
import { useTime } from "./useTime";
import { validateNumber } from "./NumberInput";
import { ScrollSyncElement } from "./useScroll";
import { useThrottleFn } from "./useThrottleFn";
import { useLatest } from "./useLatest";

export type RulerProps = ScrollSyncElement;

export const Ruler = forwardRef<HTMLDivElement, RulerProps>(
  ({ onScroll }, ref) => {
    const { setCurrentTime, currentTimeConfig, durationTime } = useTime();
    const currentTimeConfigLatest = useLatest(currentTimeConfig);

    const handleClick = useCallback<
      NonNullable<React.DOMAttributes<HTMLDivElement>["onClick"]>
    >((e) => {
      const { left } = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - left;
      const millisecond = validateNumber(
        clickX,
        currentTimeConfigLatest.current
      );
      setCurrentTime(millisecond.result);
    }, []);

    const handleMouseMove = useCallback<
      NonNullable<React.DOMAttributes<HTMLDivElement>["onMouseMove"]>
    >((e) => {
      if (e.buttons === 1) {
        const { left } = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const millisecond = validateNumber(
          mouseX,
          currentTimeConfigLatest.current
        );
        setCurrentTime(millisecond.result);
      }
    }, []);
    const [handleMouseMoveThrottled] = useThrottleFn(handleMouseMove, 32); // 30FPS

    return (
      <>
        <RenderTracker dataTestId="ruler-render-tracker" />
        <div
          className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
          data-testid="ruler"
          ref={ref}
          onScroll={onScroll}
        >
          <div
            className="h-6 rounded-md bg-white/25"
            data-testid="ruler-bar"
            style={{
              width: `${durationTime}px`,
            }}
            onClick={handleClick}
            onMouseMove={handleMouseMoveThrottled}
          ></div>
        </div>
      </>
    );
  }
);

export const RulerMemoed = memo(Ruler);
