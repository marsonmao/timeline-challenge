import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { createContext, useContext, useRef, useState } from "react";
import { NumberInput, NumberInputProps, validateNumber } from "./NumberInput";
import { clickAndType, clickSpinner, pressArrowKey } from "./test-util";

describe("NumberInput requirements", () => {
  type NumberContextValue = {
    value: number;
    setValue: (v: number) => void;
  };

  const NumberContext = createContext<NumberContextValue | undefined>(
    undefined
  );

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
    onChange,
    "data-testid": dataTestId,
  }: Pick<NumberInputProps, "validator" | "config"> & {
    onChange?: jest.Mock<void, [number]>;
    "data-testid"?: string;
  }) => {
    const { value, setValue } = useNumber();
    const onChangeLatest = useRef(onChange);
    onChangeLatest.current = onChange;
    const handleChange = useRef((value: number) => {
      onChangeLatest.current?.(value);
      setValue(value);
    });

    return (
      <NumberInput
        value={value}
        onChange={handleChange.current}
        validator={validator}
        config={config}
        data-testid={dataTestId}
      />
    );
  };

  const config = {
    step: 10,
    min: 0,
    max: 100,
  };
  let validatorSpy: jest.Mock<
    ReturnType<NumberInputProps["validator"]>,
    Parameters<NumberInputProps["validator"]>
  >;
  let onChangeSpy: jest.Mock<void, [number]>;

  beforeEach(() => {
    validatorSpy = jest.fn(validateNumber);
    onChangeSpy = jest.fn();
  });

  describe("The displayed value updates immediately while typing, but onChange is not triggered until input is confirmed", () => {
    test("Clicking outside the input field removes focus and changes the value", async () => {
      const { container } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper
            validator={validatorSpy}
            config={config}
            onChange={onChangeSpy}
          />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      expect(input).toHaveFocus();

      await clickAndType(input, "25");
      expect(onChangeSpy).toHaveBeenCalledTimes(0);

      await userEvent.click(container);
      expect(validatorSpy).toHaveBeenCalledWith(25, config);
      expect(input.value).toBe("30");
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(input).not.toHaveFocus();
    });

    test("Clicking on the native step buttons immediately changes the value", async () => {
      const step = 1;
      const customConfig = {
        ...config,
        step,
      };
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper
            validator={validatorSpy}
            config={customConfig}
            onChange={onChangeSpy}
          />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);

      clickSpinner(input, "increment", 10, step);
      expect(validatorSpy).toHaveBeenCalledWith(11, customConfig);
      expect(input.value).toBe("11");
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      fireEvent.mouseUp(input, { button: 0 });
      expect(input).toHaveFocus();

      clickSpinner(input, "decrement", 11, step);
      expect(validatorSpy).toHaveBeenCalledWith(10, customConfig);
      expect(input.value).toBe("10");
      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      fireEvent.mouseUp(input, { button: 0 });
      expect(input).toHaveFocus();
    });

    test("Pressing up arrow or down arrow keys immediately changes the value", async () => {
      const step = 1;
      const customConfig = {
        ...config,
        step,
      };
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper
            validator={validatorSpy}
            config={customConfig}
            onChange={onChangeSpy}
          />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      expect(onChangeSpy).toHaveBeenCalledTimes(0);

      pressArrowKey(input, "ArrowUp", 10, step);
      expect(validatorSpy).toHaveBeenCalledWith(11, customConfig);
      expect(input.value).toBe("11");
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      fireEvent.keyUp(input, { key: "ArrowUp" });
      expect(input).toHaveFocus();

      pressArrowKey(input, "ArrowDown", 11, step);
      expect(validatorSpy).toHaveBeenCalledWith(10, customConfig);
      expect(input.value).toBe("10");
      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      fireEvent.keyUp(input, { key: "ArrowDown" });
      expect(input).toHaveFocus();
    });

    test("Pressing Enter confirms the new value and removes focus", async () => {
      render(
        <NumberProvider initialValue={40}>
          <NumberInputWrapper
            validator={validatorSpy}
            config={config}
            onChange={onChangeSpy}
          />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      expect(input).toHaveFocus();
      expect(onChangeSpy).toHaveBeenCalledTimes(0);

      await clickAndType(input, "45");
      expect(onChangeSpy).toHaveBeenCalledTimes(0);

      await userEvent.keyboard("{Enter}");
      expect(validatorSpy).toHaveBeenCalledWith(45, config);
      expect(input.value).toBe("50");
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(input).not.toHaveFocus();
    });

    test("Move the focus away with tab should confirm the value", async () => {
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper
            validator={validatorSpy}
            config={config}
            onChange={onChangeSpy}
          />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      expect(input).toHaveFocus();
      expect(onChangeSpy).toHaveBeenCalledTimes(0);

      await clickAndType(input, "15");
      expect(input.value).toBe("15");
      expect(onChangeSpy).toHaveBeenCalledTimes(0);

      await userEvent.tab();
      expect(validatorSpy).toHaveBeenCalledWith(15, config);
      expect(input.value).toBe("20");
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(input).not.toHaveFocus();
    });
  });

  describe("When to select the entire texts", () => {
    test("entire text is selected when the input field gains focus", async () => {
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validatorSpy} config={config} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;
      const selectSpy = jest.spyOn(input, "select");

      await userEvent.click(input);
      expect(selectSpy).toHaveBeenCalledTimes(1);
    });

    test("Entire text is selected after using the native step buttons", async () => {
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validatorSpy} config={config} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;
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
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validatorSpy} config={config} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;
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
      render(
        <NumberProvider initialValue={50}>
          <NumberInputWrapper validator={validatorSpy} config={config} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;
      await userEvent.click(input);
      expect(input).toHaveFocus();

      await clickAndType(input, "55");
      await userEvent.keyboard("{Escape}");
      expect(input.value).toBe("50");
      expect(input).not.toHaveFocus();
    });
  });

  describe("Edge cases", () => {
    test("If global value is changed when blurred, the local value should be reset when focused next time", async () => {
      render(
        <NumberProvider initialValue={50}>
          <NumberInputWrapper
            validator={validatorSpy}
            config={config}
            data-testid={"input-1"}
          />
          <NumberInputWrapper
            validator={validatorSpy}
            config={config}
            data-testid={"input-2"}
          />
        </NumberProvider>
      );

      const input1 = screen.getByTestId("input-1") as HTMLInputElement;
      const input2 = screen.getByTestId("input-2") as HTMLInputElement;
      expect(input1.value).toBe("50");
      expect(input2.value).toBe("50");

      await userEvent.click(input1);
      expect(input1.value).toBe("50");

      await userEvent.click(input2);
      expect(input1.value).toBe("50");

      await clickAndType(input1, "100");
      await userEvent.keyboard("{Enter}");
      expect(input1.value).toBe("100");
      expect(input2.value).toBe("100");

      await userEvent.click(input2);
      expect(input2.value).toBe("100");
    });
  });

  describe("Validation requirements", () => {
    test("Leading zeros are automatically removed", async () => {
      render(
        <NumberProvider initialValue={100}>
          <NumberInputWrapper validator={validatorSpy} config={config} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      await clickAndType(input, "00100");
      expect(input).not.toHaveAttribute("data-invalid"); // Currently count as valid because this can represent a number

      await userEvent.tab();
      expect(input.value).toBe("100");
      expect(input).not.toHaveAttribute("data-invalid");
    });

    test("Negative values are automatically adjusted to the minimum allowed value (with direct pasting)", async () => {
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validatorSpy} config={config} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      await userEvent.paste("-5");
      expect(input.value).toBe("-5");
      expect(input).toHaveAttribute("data-invalid", "true");

      await userEvent.tab();
      expect(input.value).toBe("0");
      expect(input).not.toHaveAttribute("data-invalid");
    });

    test("Negative values are automatically adjusted to the minimum allowed value (with typing)", async () => {
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validatorSpy} config={config} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      await clickAndType(input, "-4");
      expect(input.value).toBe("4"); // Because typing "-" is non effective
      expect(input).toHaveAttribute("data-invalid", "true");

      await userEvent.tab();
      expect(input.value).toBe("0");
      expect(input).not.toHaveAttribute("data-invalid");
    });

    test("Clearing the input completely would reset to the minimum allowed value", async () => {
      render(
        <NumberProvider initialValue={50}>
          <NumberInputWrapper
            validator={validatorSpy}
            config={config}
            onChange={onChangeSpy}
          />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      await userEvent.click(input);
      await userEvent.clear(input);
      expect(input.value).toBe("0");
      expect(input).not.toHaveAttribute("data-invalid");

      await userEvent.tab();
      expect(input.value).toBe("0");
      expect(input).not.toHaveAttribute("data-invalid");
    });

    test("Decimal values are automatically rounded to the nearest integer", async () => {
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validatorSpy} config={config} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      await clickAndType(input, "15.6");
      expect(input).toHaveAttribute("data-invalid", "true");

      await userEvent.tab();
      expect(input.value).toBe("20");
      expect(input).not.toHaveAttribute("data-invalid");
    });

    test.skip("Invalid inputs (non-numeric) changes to the to the minimum allowed value", async () => {
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validatorSpy} config={config} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;
      expect(input.value).toBe("10");

      await clickAndType(input, "abc"); // All these keys are non-effective
      // NOTE should be "0", but seems that JSDOM is not simulating the correct behavior so it is still "10"
      expect(input.value).toBe("0");
      expect(input).not.toHaveAttribute("data-invalid");

      await userEvent.tab();
      expect(input.value).toBe("0");
      expect(input).not.toHaveAttribute("data-invalid");
    });

    test("Incomplete number representation changes to to the minimum allowed value", async () => {
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validatorSpy} config={config} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;
      expect(input.value).toBe("10");

      await clickAndType(input, "1e");
      expect(input.value).toBe("0");
      expect(input).not.toHaveAttribute("data-invalid");

      await userEvent.tab();
      expect(input.value).toBe("0");
      expect(input).not.toHaveAttribute("data-invalid");
    });

    test.skip("Complete number representation is accepted", async () => {
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validatorSpy} config={config} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;
      expect(input.value).toBe("10");

      await userEvent.click(input);
      await userEvent.paste("1e+2");
      expect(input.value).toBe("1e+2");
      expect(input).not.toHaveAttribute("data-invalid");

      await userEvent.tab();
      expect(input.value).toBe("100");
      expect(input).not.toHaveAttribute("data-invalid");
    });

    test("If an invalid number is corrected by spinner or arrow key, the invalid status should be removed", async () => {
      render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper
            validator={validatorSpy}
            config={{
              step: 10,
              min: 0,
              max: 300,
            }}
          />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;
      expect(input.value).toBe("10");

      async function initTheInput() {
        await clickAndType(input, "123");
        expect(input.value).toBe("123");
        expect(input).toHaveAttribute("data-invalid");
      }

      await initTheInput();
      clickSpinner(input, "increment", 123, 10);
      expect(input.value).toBe("130");
      expect(input).not.toHaveAttribute("data-invalid");

      await initTheInput();
      clickSpinner(input, "decrement", 123, 10);
      expect(input.value).toBe("120");
      expect(input).not.toHaveAttribute("data-invalid");

      await initTheInput();
      pressArrowKey(input, "ArrowUp", 123, 10);
      expect(input.value).toBe("130");
      expect(input).not.toHaveAttribute("data-invalid");

      await initTheInput();
      pressArrowKey(input, "ArrowDown", 123, 10);
      expect(input.value).toBe("120");
      expect(input).not.toHaveAttribute("data-invalid");
    });

    test("If config.max changes, the validation result should reflect it accordingly", async () => {
      const config1 = {
        step: 1,
        min: 0,
        max: 300,
      };
      const config2 = {
        step: 1,
        min: 0,
        max: 100,
      };
      const { rerender } = render(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validatorSpy} config={config1} />
        </NumberProvider>
      );
      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      await clickAndType(input, "300");
      await userEvent.keyboard("{Enter}");
      expect(input.value).toBe("300");

      rerender(
        <NumberProvider initialValue={10}>
          <NumberInputWrapper validator={validatorSpy} config={config2} />
        </NumberProvider>
      );

      await userEvent.click(input);
      expect(input.value).toBe("300");

      await userEvent.keyboard("{Enter}");
      expect(input.value).toBe("100");
    });
  });

  test("If config.min changes, the validation result should reflect it accordingly", async () => {
    const config1 = {
      step: 1,
      min: 0,
      max: 300,
    };
    const config2 = {
      step: 1,
      min: 100,
      max: 300,
    };
    const { rerender } = render(
      <NumberProvider initialValue={10}>
        <NumberInputWrapper validator={validatorSpy} config={config1} />
      </NumberProvider>
    );
    const input = screen.getByRole("spinbutton") as HTMLInputElement;

    await clickAndType(input, "40");
    await userEvent.keyboard("{Enter}");
    expect(input.value).toBe("40");

    rerender(
      <NumberProvider initialValue={10}>
        <NumberInputWrapper validator={validatorSpy} config={config2} />
      </NumberProvider>
    );

    await userEvent.click(input);
    expect(input.value).toBe("40");

    await userEvent.keyboard("{Enter}");
    expect(input.value).toBe("100");
  });

  describe("validateNumber edge cases", () => {
    test("Infinity is adjusted to the maximum allowed value", async () => {
      const { result, hasError } = validateNumber(Infinity, config);
      expect(result).toBe(config.max);
      expect(hasError).toBe(true);
    });

    test("-Infinity is adjusted to the minimum allowed value", async () => {
      const { result, hasError } = validateNumber(-Infinity, config);
      expect(result).toBe(config.min);
      expect(hasError).toBe(true);
    });

    test("NaN is adjusted to the minimum allowed value", async () => {
      const { result, hasError } = validateNumber(NaN, config);
      expect(result).toBe(config.min);
      expect(hasError).toBe(true);
    });
  });
});
