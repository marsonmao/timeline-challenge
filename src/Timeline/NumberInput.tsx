import React, { useCallback, useRef, useState } from "react";
import { useLatest } from "./useLatest";

export type NumberConfig = {
  step: number;
  min: number;
  max: number;
};

export function validateNumber(rawTime: number, config: NumberConfig) {
  let hasError = false;
  let result = rawTime;

  hasError =
    hasError ||
    Number.isNaN(result) ||
    result === -Infinity ||
    result === Infinity;
  if (hasError) {
    if (Number.isNaN(result) || result === -Infinity) {
      result = config.min;
    } else {
      result = config.max;
    }
  }

  hasError = hasError || result < config.min || result > config.max;
  if (hasError) {
    result = Math.min(config.max, Math.max(config.min, result));
  }

  hasError = hasError || result % config.step !== 0;
  if (hasError) {
    result = Math.round(result / config.step) * config.step;
  }

  return {
    hasError,
    result,
  };
}

export type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  validator: (
    rawTime: number,
    config: NumberConfig
  ) => {
    hasError: boolean;
    result: number;
  };
  config: NumberConfig;
  "data-testid"?: string;
};

export function NumberInput({
  value,
  onChange,
  validator,
  config,
  ...rest
}: NumberInputProps) {
  const inputElement = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const valueString = value.toString(); // Remove leading zeroes
  const [localValue, setLocalValue] = React.useState<string>(valueString);
  const isSpinnerClicked = useRef(false);
  const isArrowKeyDown = useRef(false);
  const blurTriggerKey = useRef<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const configLatest = useLatest(config);
  const onChangeLatest = useLatest(onChange);

  const confirmLocalValue = useCallback((localValue: string) => {
    const { result: validatedValue } = validator(
      parseFloat(localValue),
      configLatest.current
    );
    setLocalValue(validatedValue.toString());
    setHasError(false);
    onChangeLatest.current(validatedValue);
  }, []);

  const selectInputText = useCallback(() => {
    inputElement.current?.select();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isSpinnerClicked.current || isArrowKeyDown.current) {
        confirmLocalValue(e.target.value);
        selectInputText();
      } else if (e.target.value === "") {
        // Empty target value means the current input is not a valid number
        setLocalValue(configLatest.current.min.toString());
        setHasError(false);
      } else {
        setLocalValue(e.target.value);

        const { hasError } = validator(
          parseFloat(e.target.value),
          configLatest.current
        );
        setHasError(hasError);
      }
    },
    [selectInputText, confirmLocalValue]
  );

  const handleFocus = useCallback(() => {
    setIsEditing(true);
    setLocalValue(valueString);
    selectInputText();
  }, [valueString, selectInputText]);

  const handleBlur = () => {
    if (blurTriggerKey.current === "Escape") {
      setLocalValue(valueString);
    } else {
      confirmLocalValue(localValue);
    }

    setIsEditing(false);
    blurTriggerKey.current = null;
    setHasError(false);
  };

  const handleKeyDown = useCallback(
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

  const handleKeyUp = useCallback(
    (_e: React.KeyboardEvent<HTMLInputElement>) => {
      isArrowKeyDown.current = false;
    },
    []
  );

  const handleMouseDown = useCallback(
    (_e: React.MouseEvent<HTMLInputElement>) => {
      /**
       * The goal is to report to onChange when the spinners are clicked.
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

  const handleMouseUp = useCallback(
    (_e: React.MouseEvent<HTMLInputElement>) => {
      isSpinnerClicked.current = false;
    },
    []
  );

  const inputValue = isEditing ? localValue : valueString;
  const displayError = hasError && isEditing;

  return (
    <input
      {...rest}
      data-invalid={displayError ? "true" : undefined}
      className="bg-gray-700 px-1 rounded data-[invalid=true]:text-red-500"
      type="number"
      ref={inputElement}
      min={config.min}
      max={config.max}
      step={config.step}
      value={inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
}
