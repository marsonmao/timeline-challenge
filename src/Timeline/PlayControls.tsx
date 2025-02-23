import { memo, useCallback, useContext, useMemo, useState } from "react";
import { NumberInput, validateNumber } from "./NumberInput";
import { RenderTracker } from "./RenderTracker";
import { TimelineContext } from "./TimelineContext";

export const PlayControls = () => {
  const durationTimeConfig = useMemo(
    () => ({
      /**
       * In unit of Milliseconds
       */
      step: 10,
      min: 100,
      max: 6000,
    }),
    []
  );
  const [durationTime, setDurationTime] = useState(durationTimeConfig.max);
  const currentTimeConfig = useMemo(
    () => ({
      /**
       * In unit of Milliseconds
       */
      step: 10,
      min: 0,
      max: durationTime,
    }),
    [durationTime]
  );
  const { time: currentTime, setTime: setCurrentTime } =
    useContext(TimelineContext);
  const setDurationTimeAndCapCurrentTime = useCallback(
    (durationTimeValue: number) => {
      setDurationTime(durationTimeValue);
      setCurrentTime(Math.min(currentTime, durationTimeValue));
    },
    [currentTime]
  );

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
            config={currentTimeConfig}
          />
        </fieldset>
        -
        <fieldset className="flex gap-1">
          <NumberInput
            value={durationTime}
            onChange={setDurationTimeAndCapCurrentTime}
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
