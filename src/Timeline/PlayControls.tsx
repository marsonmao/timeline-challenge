import React, { memo, useCallback, useContext } from "react";
import { TimelineContext } from "./TimelineContext";
import { RenderTracker } from "./RenderTracker";

export const PlayControls = () => {
  // TODO: implement time <= maxTime

  const { time, setTime } = useContext(TimelineContext);

  const onTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTime(Number(e.target.value));
    },
    [setTime]
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
          <input
            className="bg-gray-700 px-1 rounded"
            type="number"
            data-testid="current-time-input"
            min={0}
            max={2000}
            step={10}
            value={time}
            onChange={onTimeChange}
          />
        </fieldset>
        -
        <fieldset className="flex gap-1">
          <input
            className="bg-gray-700 px-1 rounded"
            type="number"
            data-testid="duration-input"
            min={100}
            max={2000}
            step={10}
            defaultValue={2000}
          />
          Duration
        </fieldset>
      </div>
    </>
  );
};

export const PlayControlsMemoed = memo(PlayControls);
