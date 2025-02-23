import { memo, useCallback } from "react";
import { RenderTracker } from "./RenderTracker";
import { useTime } from "./useTime";
import { validateNumber } from "./NumberInput";

export const Ruler = () => {
  // TODO: implement mousedown and mousemove Playhead position
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

  return (
    <>
      <RenderTracker dataTestId="ruler-render-tracker" />
      <div
        className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
        data-testid="ruler"
      >
        <div
          className="h-6 rounded-md bg-white/25"
          data-testid="ruler-bar"
          style={{
            width: `${durationTime}px`,
          }}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
        ></div>
      </div>
    </>
  );
};

export const RulerMemoed = memo(Ruler);
