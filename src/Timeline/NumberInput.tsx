import React, { useCallback, useRef } from "react";

export type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  validator: (rawValue: number) => number;
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

    Change local value only
    1. type in the input

    Report to onChange (confirm local value)
    1. press enter
    2. click outside (blur)
    3. click on the spinners

    Revert to initial value
    1. press escape (blur)
*/
export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  validator,
  ...rest
}: NumberInputProps) {
  const inputElement = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const valueString = value.toString(); // Remove leading zeroes
  const [localValue, setLocalValue] = React.useState<string>(valueString);
  const isSpinnerClicked = useRef(false);
  const isArrowKeyDown = useRef(false);
  const blurTriggerKey = useRef<string | null>(null);

  const selectInputText = useCallback(() => {
    inputElement.current?.select();
  }, []);

  const handleValueChange = useCallback(
    (localValue: string) => {
      const rawValue = parseFloat(localValue);
      const validatedValue = validator(rawValue);
      onChange(validatedValue);
      setLocalValue(validatedValue.toString());
    },
    [onChange]
  );

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
        // TODO make invalid text red
      }
    },
    [selectInputText, handleValueChange]
  );

  const handleFocus = useCallback(() => {
    setIsEditing(true);
    selectInputText();
  }, [selectInputText]);

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

  return (
    <input
      {...rest}
      className="bg-gray-700 px-1 rounded"
      type="number"
      ref={inputElement}
      min={min}
      max={max}
      step={step}
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
