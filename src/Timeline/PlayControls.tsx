import { memo, useContext, useState } from "react";
import { NumberInput, validateNumber } from "./NumberInput";
import { RenderTracker } from "./RenderTracker";
import { TimelineContext } from "./TimelineContext";

const currentTimeConfig = {
  /**
   * In unit of Milliseconds
   */
  step: 10,
  min: 0,
};

const durationTimeConfig = {
  /**
   * In unit of Milliseconds
   */
  step: 10,
  min: 100,
  max: 6000,
};

export const PlayControls = () => {
  const { time: currentTime, setTime: setCurrentTime } =
    useContext(TimelineContext);
  const [durationTime, setDurationTime] = useState(durationTimeConfig.max);

  return (
    <>
      <RenderTracker dataTestId="play-controls-render-tracker" />
      <div
        className="flex items-center justify-between border-b border-r border-solid border-gray-700 
 px-2"
        data-testid="play-controls"
      >
        <fieldset className="flex gap-1">
          Current
          <NumberInput
            value={currentTime}
            onChange={setCurrentTime}
            data-testid="current-time-input"
            validator={validateNumber}
            config={{
              step: currentTimeConfig.step,
              min: currentTimeConfig.min,
              max: durationTime,
            }}
          />
        </fieldset>
        -
        <fieldset className="flex gap-1">
          <NumberInput
            value={durationTime}
            onChange={setDurationTime}
            data-testid="duration-input"
            validator={validateNumber}
            config={{
              step: durationTimeConfig.step,
              min: durationTimeConfig.min,
              max: durationTimeConfig.max,
            }}
          />
          Duration
        </fieldset>
      </div>
    </>
  );
};

export const PlayControlsMemoed = memo(PlayControls);
