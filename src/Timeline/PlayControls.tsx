import { memo, useContext } from "react";
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
  const { time: globalTime, setTime: setGlobalTime } =
    useContext(TimelineContext);

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
            value={globalTime}
            onChange={setGlobalTime}
            data-testid="current-time-input"
            validator={validateNumber}
            config={{
              step: currentTimeConfig.step,
              min: currentTimeConfig.min,
              max: 2000, // TODO should be the current duration and defined in a Context
            }}
          />
        </fieldset>
        -
        <fieldset className="flex gap-1">
          {/* TODO create a DurationTimeInput */}
          <input
            className="bg-gray-700 px-1 rounded"
            type="number"
            data-testid="duration-input"
            min={durationTimeConfig.min}
            max={durationTimeConfig.max}
            step={durationTimeConfig.step}
            defaultValue={durationTimeConfig.max}
          />
          Duration
        </fieldset>
      </div>
    </>
  );
};

export const PlayControlsMemoed = memo(PlayControls);
