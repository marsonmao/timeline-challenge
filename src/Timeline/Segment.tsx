import { RenderTracker } from "./RenderTracker";
import { useDurationTime } from "./useTime";

export const Segment = () => {
  const { durationTime } = useDurationTime();

  return (
    <>
      <RenderTracker dataTestId="segment-render-tracker" />
      <div
        className="py-2"
        data-testid="segment"
        style={{
          width: `${durationTime}px`,
        }}
      >
        <div className="h-6 rounded-md bg-white/10"></div>
      </div>
    </>
  );
};
