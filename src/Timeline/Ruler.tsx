import { memo } from "react";
import { RenderTracker } from "./RenderTracker";

export const Ruler = () => {
  // TODO: implement mousedown and mousemove to update time and Playhead position

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
          className="w-[2000px] h-6 rounded-md bg-white/25"
          data-testid="ruler-bar"
        ></div>
      </div>
    </>
  );
};

export const RulerMemoed = memo(Ruler);
