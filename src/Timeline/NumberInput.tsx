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
    } else if (result === Infinity) {
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
} & {
  // TODO extract to a separate type
  [key: `data-${string}`]: string | number | boolean | undefined;
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

  const selectInputText = useCallback(() => {
    inputElement.current?.select();
  }, []);

  const configLatest = useLatest(config);
  const onChangeLatest = useLatest(onChange);
  const handleValueChange = useCallback((localValue: string) => {
    const rawValue = parseFloat(localValue);
    const { result: validatedValue } = validator(
      rawValue,
      configLatest.current
    );
    onChangeLatest.current(validatedValue);
    setLocalValue(validatedValue.toString());
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isSpinnerClicked.current || isArrowKeyDown.current) {
        handleValueChange(e.target.value);
        selectInputText();
      }
      // TODO this messes up the entering of "-" and "." etc.
      // Need to find a better way to handle typing of e.g. A,B,C.
      // else if (e.target.value === "") {
      //   setLocalValue(min?.toString() ?? "0");
      // }
      else {
        setLocalValue(e.target.value);

        const { hasError } = validator(parseFloat(e.target.value), config);
        setHasError(hasError);
      }
    },
    [selectInputText, handleValueChange]
  );

  const handleFocus = useCallback(() => {
    setIsEditing(true);
    setLocalValue(valueString);
    selectInputText();
  }, [valueString, selectInputText]);

  const handleBlur = () => {
    if (blurTriggerKey.current === "Escape") {
      setLocalValue(valueString);
    } else if (
      blurTriggerKey.current === "Enter" ||
      blurTriggerKey.current === null
    ) {
      handleValueChange(localValue);
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
