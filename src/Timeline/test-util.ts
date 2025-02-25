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

// WORKAROUND: the correct behavior is not simulated by JSDOM
export function pressArrowKey(
  input: HTMLElement,
  key: "ArrowUp" | "ArrowDown",
  currentValue: number,
  step: number
) {
  const value = key === "ArrowUp" ? currentValue + step : currentValue - step;
  fireEvent.keyDown(input, { key });
  fireEvent.change(input, { target: { value } });
}

// WORKAROUND: the correct behavior is not simulated by JSDOM
export function clickSpinner(
  spinner: HTMLElement,
  button: "increment" | "decrement",
  currentValue: number,
  step: number
) {
  const value =
    button === "increment" ? currentValue + step : currentValue - step;
  fireEvent.mouseDown(spinner, { button: 0 });
  fireEvent.change(spinner, { target: { value } });
}
