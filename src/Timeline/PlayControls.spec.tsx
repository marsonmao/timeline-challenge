import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { PropsWithChildren } from "react";
import { PlayControls } from "./PlayControls";
import { clickAndType } from "./test-util";
import { useTimeStore } from "./useTime";

describe("PlayControls requirements", () => {
  const TimelineProvider = ({
    initialCurrentTime,
    initialDurationTime,
    children,
  }: PropsWithChildren<{
    initialCurrentTime: number;
    initialDurationTime: number;
  }>) => {
    const currentTimeConfig = { step: 10, min: 0, max: 6000 };
    const durationTimeConfig = { step: 10, min: 100, max: 6000 };
    const timeStore = useTimeStore({
      initialDurationTimeConfig: durationTimeConfig,
      initialCurrentTimeConfig: currentTimeConfig,
      initialDurationTime,
      initialCurrentTime,
    });
    return <Provider store={timeStore}>{children}</Provider>;
  };

  test("Current Time is always between 0ms and the Duration", async () => {
    render(
      <TimelineProvider initialCurrentTime={0} initialDurationTime={6000}>
        <PlayControls />
      </TimelineProvider>
    );
    const currentInput = screen.getByTestId(
      "current-time-input"
    ) as HTMLInputElement;
    const durationInput = screen.getByTestId(
      "duration-input"
    ) as HTMLInputElement;
    const durationTime = parseInt(durationInput.value);
    expect(parseInt(currentInput.value, 10)).toBeGreaterThanOrEqual(0);
    expect(parseInt(currentInput.value, 10)).toBeLessThanOrEqual(durationTime);

    await clickAndType(currentInput, "-50");
    await userEvent.tab();
    expect(parseInt(currentInput.value, 10)).toBeGreaterThanOrEqual(0);
    expect(parseInt(currentInput.value, 10)).toBeLessThanOrEqual(durationTime);

    await clickAndType(currentInput, "7000");
    await userEvent.tab();
    expect(parseInt(currentInput.value, 10)).toBeGreaterThanOrEqual(0);
    expect(parseInt(currentInput.value, 10)).toBeLessThanOrEqual(durationTime);
  });

  test("Current Time adjusts if it exceeds the newly set Duration", async () => {
    render(
      <TimelineProvider initialCurrentTime={5000} initialDurationTime={6000}>
        <PlayControls />
      </TimelineProvider>
    );

    const currentInput = screen.getByTestId(
      "current-time-input"
    ) as HTMLInputElement;
    const durationInput = screen.getByTestId(
      "duration-input"
    ) as HTMLInputElement;

    await clickAndType(durationInput, "4000");
    await userEvent.tab();
    expect(parseInt(durationInput.value, 10)).toBe(4000);
    expect(parseInt(currentInput.value, 10)).toBe(4000);
  });

  test("Duration is always between 100ms and 6000ms", async () => {
    render(
      <TimelineProvider initialCurrentTime={0} initialDurationTime={6000}>
        <PlayControls />
      </TimelineProvider>
    );
    const durationInput = screen.getByTestId(
      "duration-input"
    ) as HTMLInputElement;
    expect(parseInt(durationInput.value, 10)).toBeGreaterThanOrEqual(100);
    expect(parseInt(durationInput.value, 10)).toBeLessThanOrEqual(6000);

    await clickAndType(durationInput, "50");
    await userEvent.tab();
    expect(parseInt(durationInput.value, 10)).toBe(100);
    expect(parseInt(durationInput.value, 10)).toBeGreaterThanOrEqual(100);
    expect(parseInt(durationInput.value, 10)).toBeLessThanOrEqual(6000);

    await clickAndType(durationInput, "7000");
    await userEvent.tab();
    expect(parseInt(durationInput.value, 10)).toBeGreaterThanOrEqual(100);
    expect(parseInt(durationInput.value, 10)).toBeLessThanOrEqual(6000);
  });

  test("Current Time and Duration are always multiples of 10ms and positive integers", async () => {
    render(
      <TimelineProvider initialCurrentTime={0} initialDurationTime={6000}>
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
      await clickAndType(input, value);
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
