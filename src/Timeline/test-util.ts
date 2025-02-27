import { fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

export const clickAndType = async (input: HTMLInputElement, value: string) => {
  await userEvent.click(input);

  // Seems that even if handleFocus of NumberInput.tsx did called input.select(),
  // it won't work in the test environment.
  // Therefore, explicitly setting the selection range is needed.
  await userEvent.type(input, value, {
    initialSelectionStart: 0,
    initialSelectionEnd: input.value.length,
  });
};

function roundToNearestMultipleOfStep(
  direction: "up" | "down",
  currentValue: number,
  step: number
) {
  let value = currentValue;
  if (direction === "up") {
    value = (Math.floor(currentValue / step) + 1) * step;
  } else {
    value =
      Math.floor(currentValue / step) * step -
      (currentValue % step === 0 ? step : 0);
  }
  return value;
}

// WORKAROUND: the correct behavior is not simulated by JSDOM
export function pressArrowKey(
  input: HTMLElement,
  key: "ArrowUp" | "ArrowDown",
  currentValue: number,
  step: number
) {
  const value = roundToNearestMultipleOfStep(
    key === "ArrowUp" ? "up" : "down",
    currentValue,
    step
  );
  fireEvent.keyDown(input, { key });
  fireEvent.change(input, { target: { value } });
  fireEvent.keyUp(input, { key });
}

// WORKAROUND: the correct behavior is not simulated by JSDOM
export function clickSpinner(
  spinner: HTMLElement,
  button: "increment" | "decrement",
  currentValue: number,
  step: number
) {
  const value = roundToNearestMultipleOfStep(
    button === "increment" ? "up" : "down",
    currentValue,
    step
  );
  fireEvent.mouseDown(spinner, { button: 0 });
  fireEvent.change(spinner, { target: { value } });
  fireEvent.mouseUp(spinner, { button: 0 });
}
