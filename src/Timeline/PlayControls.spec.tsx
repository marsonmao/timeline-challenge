import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropsWithChildren, useState } from "react";
import { PlayControls } from "./PlayControls";
import { TimelineContext } from "./TimelineContext";

describe("PlayControls requirements", () => {
  const TimelineProvider = ({
    initialTime,
    children,
  }: PropsWithChildren<{ initialTime: number }>) => {
    const [time, setTime] = useState(initialTime);
    return (
      <TimelineContext.Provider value={{ time, setTime }}>
        {children}
      </TimelineContext.Provider>
    );
  };

  test("Current Time is always between 0ms and the Duration", async () => {
    render(
      <TimelineProvider initialTime={0}>
        <PlayControls />
      </TimelineProvider>
    );
    const currentInput = screen.getByTestId(
      "current-time-input"
    ) as HTMLInputElement;

    await userEvent.clear(currentInput);
    await userEvent.type(currentInput, "-50");
    await userEvent.tab();
    expect(parseInt(currentInput.value, 10)).toBeGreaterThanOrEqual(0);

    await userEvent.clear(currentInput);
    await userEvent.type(currentInput, "7000");
    await userEvent.tab();
    expect(parseInt(currentInput.value, 10)).toBeLessThanOrEqual(6000);
  });

  test("Current Time adjusts if it exceeds the newly set Duration", async () => {
    render(
      <TimelineProvider initialTime={5000}>
        <PlayControls />
      </TimelineProvider>
    );

    const currentInput = screen.getByTestId(
      "current-time-input"
    ) as HTMLInputElement;
    const durationInput = screen.getByTestId(
      "duration-input"
    ) as HTMLInputElement;

    await userEvent.clear(durationInput);
    await userEvent.type(durationInput, "4000");
    await userEvent.tab();
    expect(parseInt(currentInput.value, 10)).toBe(4000);
  });

  test("Duration is always between 100ms and 6000ms", async () => {
    render(
      <TimelineProvider initialTime={0}>
        <PlayControls />
      </TimelineProvider>
    );
    const durationInput = screen.getByTestId(
      "duration-input"
    ) as HTMLInputElement;

    await userEvent.clear(durationInput);
    await userEvent.type(durationInput, "50");
    await userEvent.tab();
    expect(parseInt(durationInput.value, 10)).toBeGreaterThanOrEqual(100);

    await userEvent.clear(durationInput);
    await userEvent.type(durationInput, "7000");
    await userEvent.tab();
    expect(parseInt(durationInput.value, 10)).toBeLessThanOrEqual(6000);
  });

  test("Current Time and Duration are always multiples of 10ms and positive integers", async () => {
    render(
      <TimelineProvider initialTime={0}>
        <PlayControls />
      </TimelineProvider>
    );
    const currentInput = screen.getByTestId(
      "current-time-input"
    ) as HTMLInputElement;
    const durationInput = screen.getByTestId(
      "duration-input"
    ) as HTMLInputElement;

    const fillThis = async (input: HTMLInputElement, value: string) => {
      await userEvent.clear(input);
      await userEvent.type(input, value);
      await userEvent.tab();
    };

    const expectThese = (value: number) => {
      expect(value % 10).toBe(0);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
    };

    await fillThis(currentInput, "123");
    expectThese(parseInt(currentInput.value, 10));

    await fillThis(durationInput, "157");
    expectThese(parseInt(currentInput.value, 10));

    await fillThis(currentInput, "-123");
    expectThese(parseInt(currentInput.value, 10));

    await fillThis(durationInput, "-157");
    expectThese(parseInt(currentInput.value, 10));
  });
});
