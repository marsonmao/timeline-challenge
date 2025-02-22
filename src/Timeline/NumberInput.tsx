import React, { useCallback, useRef } from "react";

export type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  validateTime: (rawTime: number) => number;
} & Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "min" | "max" | "step"
> & {
    // TODO extract to a separate type
    [key: `data-${string}`]: string | number | boolean | undefined;
  };

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
export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  validateTime,
  ...rest
}: NumberInputProps) {
  const inputElement = useRef<HTMLInputElement>(null);
  const [isEditingTime, setIsEditingTime] = React.useState(false);
  const valueString = value.toString(); // Remove leading zeroes
  const [inputTime, setInputTime] = React.useState<string>(valueString);
  const isSpinnerClicked = useRef(false);
  const isArrowKeyDown = useRef(false);
  const blurTriggerKey = useRef<string | null>(null);

  const selectInputText = useCallback(() => {
    inputElement.current?.select();
  }, []);

  const handleTimeChange = useCallback((inputTime: string) => {
    const rawValue = parseFloat(inputTime);
    const validatedValue = validateTime(rawValue);
    onChange(validatedValue);
    setInputTime(validatedValue.toString());
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isSpinnerClicked.current || isArrowKeyDown.current) {
        handleTimeChange(e.target.value);
        selectInputText();
      } else {
        setInputTime(e.target.value);
        // TODO make invalid text red
      }
    },
    [selectInputText, handleTimeChange]
  );

  const onInputFocus = useCallback(() => {
    setIsEditingTime(true);
    selectInputText();
  }, [selectInputText]);

  const onInputBlur = () => {
    if (blurTriggerKey.current === "Escape") {
      setInputTime(valueString);
    } else if (
      blurTriggerKey.current === "Enter" ||
      blurTriggerKey.current === null
    ) {
      handleTimeChange(inputTime);
    }

    setIsEditingTime(false);
    blurTriggerKey.current = null;
  };

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const onInputKeyUp = useCallback(
    (_e: React.KeyboardEvent<HTMLInputElement>) => {
      isArrowKeyDown.current = false;
    },
    []
  );

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

  const timeInputValue = isEditingTime ? inputTime : valueString;

  return (
    <input
      {...rest}
      className="bg-gray-700 px-1 rounded"
      type="number"
      ref={inputElement}
      min={min}
      max={max}
      step={step}
      value={timeInputValue}
      onChange={onInputChange}
      onFocus={onInputFocus}
      onBlur={onInputBlur}
      onKeyDown={onInputKeyDown}
      onKeyUp={onInputKeyUp}
      onMouseDown={onInputMouseDown}
      onMouseUp={onInputMouseUp}
    />
  );
}
