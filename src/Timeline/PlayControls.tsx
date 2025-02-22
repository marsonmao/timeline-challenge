import React, { memo, useCallback, useContext, useRef } from "react";
import { TimelineContext } from "./TimelineContext";
import { RenderTracker } from "./RenderTracker";

const config = {
  /**
   * In unit of Milliseconds
   */
  timeStep: 10,
  minEndTime: 100,
  maxEndTime: 2000,
};

export function validateTime(time: number): number {
  // TODO handle NaN
  return Math.min(config.maxEndTime, Math.max(0, time));
}

/**
    How this component work:

    Entry (focus)
    1. click on the input area
    2. click on the spinners
    3. tab

    Change local time only
    1. type in the input

    Change global time directly
    1. press enter
    2. click outside (blur)
    3. click on the spinners

    Revert to global time
    1. press escape
 */
export const PlayControls = () => {
  // TODO: implement time <= maxTime

  const inputElement = useRef<HTMLInputElement>(null);
  const [isEditingTime, setIsEditingTime] = React.useState(false);
  const { time: globalTime, setTime: setGlobalTime } =
    useContext(TimelineContext);
  const [inputTime, setInputTime] = React.useState(globalTime);
  const isSpinnerClicked = useRef(false);
  const isArrowKeyDown = useRef(false);
  const blurTriggerKey = useRef<string|null>(null);

  const selectInputText = () => {
    inputElement.current?.select();
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = Number(e.target.value);
    const validatedValue = validateTime(rawValue);

    if (isSpinnerClicked.current || isArrowKeyDown.current) {
      setGlobalTime(validatedValue);
      selectInputText();
    }

    setInputTime(validatedValue);
  };

  const onInputFocus = useCallback(() => {
    setIsEditingTime(true);
    selectInputText();
  }, []);

  const onInputBlur = () => {
    if (blurTriggerKey.current === "Escape") {
      setInputTime(globalTime);
    } else if (
      blurTriggerKey.current === "Enter" ||
      blurTriggerKey.current === null
    ) {
      setGlobalTime(inputTime);
    }

    setIsEditingTime(false);
    blurTriggerKey.current = null;
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    /**
     * If any key is pressed, it would break the spinner event chain, so we clear the flag.
     */
    isSpinnerClicked.current = false;

    if (e.key === "Enter" || e.key === "Escape") {
      blurTriggerKey.current = e.key;
      e.currentTarget.blur();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      isArrowKeyDown.current = true;
    }
  };

  const onInputKeyUp = (_e: React.KeyboardEvent<HTMLInputElement>) => {
    isArrowKeyDown.current = false;
  };

  const onInputMouseDown = useCallback(
    (_e: React.MouseEvent<HTMLInputElement>) => {
      /**
       * The goal is to change the global time when the spinners are clicked.
       * 
       * However, we cannot know if they are clicked due to the limitation of browser implementation.
       * The browser can only tell us that the input element was clicked, but it could be any pixel.
       * 
       * The workaround is to detect a chain of consecutive events: [mouse down, change].
       * When a spinner was clicked, it would form this event chain.
       * 
       * So that in this handler, we firstly set the flag to true, 
       * and then we check if the chain is formed in the other handlers.
       */
      isSpinnerClicked.current = true;
    },
    []
  );

  const onInputMouseUp = useCallback(
    (_e: React.MouseEvent<HTMLInputElement>) => {
      isSpinnerClicked.current = false;
    },
    []
  );

  const timeInputValue = isEditingTime ? inputTime : globalTime;

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
            ref={inputElement}
            min={0}
            max={config.maxEndTime}
            step={config.timeStep}
            value={timeInputValue}
            onChange={onInputChange}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            onKeyDown={onInputKeyDown}
            onKeyUp={onInputKeyUp}
            onMouseDown={onInputMouseDown}
            onMouseUp={onInputMouseUp}
          />
        </fieldset>
        -
        <fieldset className="flex gap-1">
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
