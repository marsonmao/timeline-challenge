import { forwardRef, memo, useCallback } from "react";
import { RenderTracker } from "./RenderTracker";
import { useTime } from "./useTime";
import { validateNumber } from "./NumberInput";
import { ScrollSyncElement } from "./useScroll";
import { useThrottleFn } from "./useThrottleFn";

export type RulerProps = ScrollSyncElement;

export const Ruler = forwardRef<HTMLDivElement, RulerProps>(
  ({ onScroll }, ref) => {
    const { setCurrentTime, currentTimeConfig, durationTime } = useTime();

    const handleClick = useCallback<
      NonNullable<React.DOMAttributes<HTMLDivElement>["onClick"]>
    >(
      (e) => {
        const { left } = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - left;
        const millisecond = validateNumber(clickX, currentTimeConfig);
        setCurrentTime(millisecond.result);
      },
      [currentTimeConfig]
    );

    const handleMouseMove = useCallback<
      NonNullable<React.DOMAttributes<HTMLDivElement>["onMouseMove"]>
    >(
      (e) => {
        if (e.buttons === 1) {
          const { left } = e.currentTarget.getBoundingClientRect();
          const mouseX = e.clientX - left;
          const millisecond = validateNumber(mouseX, currentTimeConfig);
          setCurrentTime(millisecond.result);
        }
      },
      [currentTimeConfig]
    );
    const [handleMouseMoveThrottled] = useThrottleFn(handleMouseMove, 32);

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
