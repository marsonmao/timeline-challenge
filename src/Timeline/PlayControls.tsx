import { memo, useContext } from "react";
import { TimeInput } from "./TimeInput";
import { RenderTracker } from "./RenderTracker";
import { TimelineContext } from "./TimelineContext";

const config = {
  /**
   * In unit of Milliseconds
   */
  timeStep: 10,
  minStartTime: 0,
  minEndTime: 100,
  maxEndTime: 2000,
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
          <TimeInput
            value={globalTime}
            onChange={setGlobalTime}
            data-testid="current-time-input"
            min={config.minStartTime}
            max={config.maxEndTime} // TODO dynamic, should be the current duration
            step={config.timeStep}
            config={{
              timeStep: config.timeStep,
              minTime: config.minStartTime,
              maxTime: config.maxEndTime, // TODO dynamic, should be the current duration
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
            min={config.minEndTime}
            max={config.maxEndTime}
            step={config.timeStep}
            defaultValue={config.maxEndTime}
          />
          Duration
        </fieldset>
      </div>
    </>
  );
};

export const PlayControlsMemoed = memo(PlayControls);
