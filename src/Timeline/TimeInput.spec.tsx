import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { createContext, useContext, useState } from "react";
import { TimeInput, TimeInputProps, validateTime } from "./TimeInput";

type TimeContextValue = {
  value: number;
  setValue: (v: number) => void;
};

const TimeContext = createContext<TimeContextValue | undefined>(undefined);

const TimeProvider = ({
  children,
  initialValue,
}: React.PropsWithChildren<{ initialValue: number }>) => {
  const [value, setValue] = useState<number>(initialValue);
  return (
    <TimeContext.Provider value={{ value, setValue }}>
      {children}
    </TimeContext.Provider>
  );
};

const useGlobalTime = (): TimeContextValue => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error("useGlobalTime must be used within a TimeProvider");
  }
  return context;
};

const TimeInputWrapper = ({ config }: Pick<TimeInputProps, "config">) => {
  const { value, setValue } = useGlobalTime();
  return (
    <TimeInput
      value={value}
      onChange={setValue}
      min={config.minTime}
      max={config.maxTime}
      step={config.timeStep}
      config={config}
    />
  );
};

describe("TimeInput behavior", () => {
  const config = {
    timeStep: 10,
    minTime: 0,
    maxTime: 100,
  };

  test("Leading zeros are automatically removed", async () => {
    const { getByRole } = render(
      <TimeProvider initialValue={100}>
        <TimeInputWrapper config={config} />
      </TimeProvider>
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
      <TimeProvider initialValue={10}>
        <TimeInputWrapper config={config} />
      </TimeProvider>
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
      <TimeProvider initialValue={10}>
        <TimeInputWrapper config={config} />
      </TimeProvider>
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
      <TimeProvider initialValue={10}>
        <TimeInputWrapper config={config} />
      </TimeProvider>
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
      <TimeProvider initialValue={10}>
        <TimeInputWrapper config={config} />
      </TimeProvider>
    );
    const input = getByRole("spinbutton") as HTMLInputElement;

    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.type(input, "abc");
    await userEvent.tab();
    expect(input.value).toBe("0");
  });
});

describe("TimeInput validator edge cases", () => {
  const config = {
    timeStep: 20,
    minTime: 50,
    maxTime: 5000,
  };

  test("Infinity is adjusted to the maximum allowed value", async () => {
    const value = validateTime(Infinity, config);
    expect(value).toBe(config.maxTime);
  });

  test("-Infinity is adjusted to the minimum allowed value", async () => {
    const value = validateTime(-Infinity, config);
    expect(value).toBe(config.minTime);
  });

  test("NaN is adjusted to the minimum allowed value", async () => {
    const value = validateTime(NaN, config);
    expect(value).toBe(config.minTime);
  });
});
