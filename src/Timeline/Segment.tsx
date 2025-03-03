import { useDurationTime } from "./useTime";

export const Segment = () => {
  const { durationTime } = useDurationTime();

  return (
    <div
      className="py-2"
      data-testid="segment"
      style={{
        width: `${durationTime}px`,
      }}
    >
      <div className="h-6 rounded-md bg-white/10"></div>
    </div>
  );
};
