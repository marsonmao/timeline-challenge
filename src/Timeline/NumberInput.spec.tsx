import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { createContext, useContext, useState } from "react";
import {
  NumberConfig,
  NumberInput,
  NumberInputProps,
  validateNumber,
} from "./NumberInput";

type NumberContextValue = {
  value: number;
  setValue: (v: number) => void;
};

const NumberContext = createContext<NumberContextValue | undefined>(undefined);

const NumberProvider = ({
  children,
  initialValue,
}: React.PropsWithChildren<{ initialValue: number }>) => {
  const [value, setValue] = useState<number>(initialValue);
  return (
    <NumberContext.Provider value={{ value, setValue }}>
      {children}
    </NumberContext.Provider>
  );
};

const useNumber = (): NumberContextValue => {
  const context = useContext(NumberContext);
  if (!context) {
    throw new Error("useNumber must be used within a NumberProvider");
  }
  return context;
};

const NumberInputWrapper = ({
  validator,
  config,
}: Pick<NumberInputProps, "validator" | "config">) => {
  const { value, setValue } = useNumber();
  return (
    <NumberInput
      value={value}
      onChange={setValue}
      validator={validator}
      config={config}
    />
  );
};

describe("NumberInput requirements", () => {
  let validator: jest.Mock<number, [number, NumberConfig]>;
  const config = {
    step: 10,
    min: 0,
    max: 100,
  };

  // WORKAROUND: the correct behavior is not simulated by JSDOM
  function clickSpinner(
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

  // WORKAROUND: the correct behavior is not simulated by JSDOM
  function pressArrowKey(
    input: HTMLElement,
    key: "ArrowUp" | "ArrowDown",
    currentValue: number,
    step: number
  ) {
    const value = key === "ArrowUp" ? currentValue + step : currentValue - step;
    fireEvent.keyDown(input, { key });
    fireEvent.change(input, { target: { value } });
  }

  beforeEach(() => {
    validator = jest.fn(validateNumber);
  });

  describe("The displayed value updates immediately while typing, but onChange is not triggered until input is confirmed", () => {
    test("Clicking outside the input field removes focus and changes the value", async () => {
      const { getByRole, container } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      expect(document.activeElement).toBe(input);

      await userEvent.clear(input);
      await userEvent.type(input, "25");
      await userEvent.click(container);
      expect(validator).toHaveBeenCalledWith(25, config);
      expect(input.value).toBe("30");
      expect(document.activeElement).not.toBe(input);
    });

    test("Clicking on the native step buttons immediately changes the value", async () => {
      const step = 1;
      const customConfig = {
        ...config,
        step,
      };
      const { getByRole } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validator} config={customConfig} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);

      clickSpinner(input, "increment", 10, step);
      expect(validator).toHaveBeenCalledWith(11, customConfig);
      expect(input.value).toBe("11");
      fireEvent.mouseUp(input, { button: 0 });
      expect(document.activeElement).toBe(input);

      clickSpinner(input, "decrement", 11, step);
      expect(validator).toHaveBeenCalledWith(10, customConfig);
      expect(input.value).toBe("10");
      fireEvent.mouseUp(input, { button: 0 });
      expect(document.activeElement).toBe(input);
    });

    test("Pressing up arrow or down arrow keys immediately changes the value", async () => {
      const step = 1;
      const customConfig = {
        ...config,
        step,
      };
      const { getByRole } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validator} config={customConfig} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);

      pressArrowKey(input, "ArrowUp", 10, step);
      expect(validator).toHaveBeenCalledWith(11, customConfig);
      expect(input.value).toBe("11");
      fireEvent.keyUp(input, { key: "ArrowUp" });
      expect(document.activeElement).toBe(input);

      pressArrowKey(input, "ArrowDown", 11, step);
      expect(validator).toHaveBeenCalledWith(10, customConfig);
      expect(input.value).toBe("10");
      fireEvent.keyUp(input, { key: "ArrowDown" });
      expect(document.activeElement).toBe(input);
    });

    test("Pressing Enter confirms the new value and removes focus", async () => {
      const { getByRole } = render(
        <NumberProvider initialValue={40}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      expect(document.activeElement).toBe(input);

      await userEvent.clear(input);
      await userEvent.type(input, "45");
      await userEvent.keyboard("{Enter}");
      expect(validator).toHaveBeenCalledWith(45, config);
      expect(input.value).toBe("50");
      expect(document.activeElement).not.toBe(input);
    });

    test("Move the focus away with tab should confirm the value", async () => {
      const { getByRole } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      expect(document.activeElement).toBe(input);

      await userEvent.clear(input);
      await userEvent.type(input, "15");
      expect(input.value).toBe("15");

      await userEvent.tab();
      expect(validator).toHaveBeenCalledWith(15, config);
      expect(input.value).toBe("20");
      expect(document.activeElement).not.toBe(input);
    });
  });

  describe("When to select the entire texts", () => {
    test("entire text is selected when the input field gains focus", async () => {
      const { getByRole } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;
      const selectSpy = jest.spyOn(input, "select");

      await userEvent.click(input);
      expect(selectSpy).toHaveBeenCalledTimes(1);
    });

    test("Entire text is selected after using the native step buttons", async () => {
      const { getByRole } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;
      const selectSpy = jest.spyOn(input, "select");

      await userEvent.click(input);
      expect(selectSpy).toHaveBeenCalledTimes(1);

      clickSpinner(input, "increment", 10, 10);
      expect(selectSpy).toHaveBeenCalledTimes(2);
      fireEvent.mouseUp(input, { button: 0 });

      clickSpinner(input, "decrement", 20, 10);
      expect(selectSpy).toHaveBeenCalledTimes(3);
      fireEvent.mouseUp(input, { button: 0 });
    });

    test("Entire text is selected after using the up arrow or down arrow keys", async () => {
      const { getByRole } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;
      const selectSpy = jest.spyOn(input, "select");

      await userEvent.click(input);
      expect(selectSpy).toHaveBeenCalledTimes(1);

      pressArrowKey(input, "ArrowUp", 10, 10);
      expect(selectSpy).toHaveBeenCalledTimes(2);
      fireEvent.keyUp(input, { key: "ArrowUp" });

      pressArrowKey(input, "ArrowDown", 20, 10);
      expect(selectSpy).toHaveBeenCalledTimes(3);
      fireEvent.keyUp(input, { key: "ArrowDown" });
    });
  });

  describe("When to discard the local value and revert to the global value", () => {
    test("Pressing Escape reverts to the original value and removes focus", async () => {
      const { getByRole } = render(
        <NumberProvider initialValue={50}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;
      await userEvent.click(input);
      expect(document.activeElement).toBe(input);

      await userEvent.clear(input);
      await userEvent.type(input, "55");
      await userEvent.keyboard("{Escape}");
      expect(input.value).toBe("50");
      expect(document.activeElement).not.toBe(input);
    });
  });

  describe("Validation requirements", () => {
    test("Leading zeros are automatically removed", async () => {
      const { getByRole } = render(
        <NumberProvider initialValue={100}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "00100");
      await userEvent.tab();
      expect(input.value).toBe("100");
    });

    test("Negative values are automatically adjusted to the minimum allowed value (with direct pasting)", async () => {
      const { getByRole } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      await userEvent.paste("-5");
      expect(input.value).toBe("-5");

      await userEvent.tab();
      expect(input.value).toBe("0");
    });

    test("Negative values are automatically adjusted to the minimum allowed value (with typing)", async () => {
      const { getByRole } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "-5");
      expect(input.value).toBe("-5");

      await userEvent.tab();
      expect(input.value).toBe("0");
    });

    test("Decimal values are automatically rounded to the nearest integer", async () => {
      const { getByRole } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "15.6");
      await userEvent.tab();
      expect(input.value).toBe("20");
    });

    test("Invalid inputs (non-numeric) revert to the previous valid value", async () => {
      const { getByRole } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validator} config={config} />
        </NumberProvider>
      );
      const input = getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "abc");
      await userEvent.tab();
      expect(input.value).toBe("0");
    });
  });

  describe("validateNumber edge cases", () => {
    test("Infinity is adjusted to the maximum allowed value", async () => {
      const value = validateNumber(Infinity, config);
      expect(value).toBe(config.max);
    });

    test("-Infinity is adjusted to the minimum allowed value", async () => {
      const value = validateNumber(-Infinity, config);
      expect(value).toBe(config.min);
    });

    test("NaN is adjusted to the minimum allowed value", async () => {
      const value = validateNumber(NaN, config);
      expect(value).toBe(config.min);
    });
  });
});
