import { forwardRef, memo, useCallback, useEffect } from "react";
import { validateNumber } from "./NumberInput";
import { RenderTracker } from "./RenderTracker";
import { useDragging } from "./useDragging";
import { useLatest } from "./useLatest";
import { ScrollSyncElement } from "./useScroll";
import { useTime } from "./useTime";

export type RulerProps = ScrollSyncElement;

export const Ruler = forwardRef<HTMLDivElement, RulerProps>(
  ({ onScroll }, ref) => {
    const { setCurrentTime, currentTimeConfig, durationTime } = useTime();
    const currentTimeConfigLatest = useLatest(currentTimeConfig);
    const { isDragging, startDragging, localCurrentPosition } = useDragging({
      fps: 30,
    });

    const startDragginfIfMouseLeft = useCallback<
      React.MouseEventHandler<HTMLDivElement>
    >(
      (e) => {
        if (e.button === 0) {
          startDragging(e);
        }
      },
      [startDragging]
    );

    useEffect(() => {
      if (isDragging) {
        const millisecond = validateNumber(
          localCurrentPosition.x,
          currentTimeConfigLatest.current
        );
        setCurrentTime(millisecond.result);
      }
    }, [isDragging, localCurrentPosition]);

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
            onMouseDown={startDragginfIfMouseLeft}
          ></div>
        </div>
      </>
    );
  }
);

export const RulerMemoed = memo(Ruler);
