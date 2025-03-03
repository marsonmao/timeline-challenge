import { memo } from "react";
import { NumberInput, validateNumber } from "./NumberInput";
import { RenderTracker } from "./RenderTracker";
import {
  useCurrentTime,
  useCurrentTimeConfig,
  useDurationTime,
  useDurationTimeConfig,
} from "./useTime";

export const PlayControls = () => {
  const { currentTime, setCurrentTime } = useCurrentTime();
  const { currentTimeConfig } = useCurrentTimeConfig();
  const { durationTime, setDurationTime } = useDurationTime();
  const { durationTimeConfig } = useDurationTimeConfig();

  return (
    <>
      <RenderTracker dataTestId="play-controls-render-tracker" />
      <div
        className="flex items-center justify-between border-b border-r border-solid border-gray-700 
 px-2"
        data-testid="play-controls"
      >
        <fieldset className="flex gap-1">
          <span className=" select-none">Current</span>
          <NumberInput
            value={currentTime}
            onChange={setCurrentTime}
            data-testid="current-time-input"
            validator={validateNumber}
            config={currentTimeConfig}
          />
        </fieldset>
        <span className=" select-none">-</span>
        <fieldset className="flex gap-1">
          <NumberInput
            value={durationTime}
            onChange={setDurationTime}
            data-testid="duration-input"
            validator={validateNumber}
            config={durationTimeConfig}
          />
          <span className=" select-none">Duration</span>
        </fieldset>
      </div>
    </>
  );
};

export const PlayControlsMemoed = memo(PlayControls);
