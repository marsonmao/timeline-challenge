import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timeline } from "./Timeline";

test("the input field value should reflect user input", async () => {
  const { getByTestId } = render(<Timeline />);
  const currentTimeInput = getByTestId(
    "current-time-input"
  ) as HTMLInputElement;

  // Initial render
  expect(currentTimeInput.value).toBe("0");

  // After user input
  await userEvent.type(currentTimeInput, "20");
  expect(currentTimeInput.value).toBe("20");
});

test("the components subscribed to the time state should render accordingly, while the rest should not rerender", async () => {
  const { getByTestId } = render(<Timeline />);
  const currentTimeInput = getByTestId(
    "current-time-input"
  ) as HTMLInputElement;
  const playControlsRenderTracker = getByTestId("play-controls-render-tracker");
  const playheadRenderTracker = getByTestId("playhead-render-tracker");
  const rulerRenderTracker = getByTestId("ruler-render-tracker");
  const trackListRenderTracker = getByTestId("track-list-render-tracker");
  const keyframeListRenderTracker = getByTestId("keyframe-list-render-tracker");

  // Initial render
  expect(playControlsRenderTracker.textContent).toBe("1");
  expect(rulerRenderTracker.textContent).toBe("1");
  expect(playheadRenderTracker.textContent).toBe("1");
  expect(trackListRenderTracker.textContent).toBe("1");
  expect(keyframeListRenderTracker.textContent).toBe("1");

  await userEvent.click(currentTimeInput);
  await userEvent.type(currentTimeInput, "20");
  await userEvent.keyboard("{Enter}");
  expect(playControlsRenderTracker.textContent).toBe("2");
  expect(playheadRenderTracker.textContent).toBe("2");
  expect(rulerRenderTracker.textContent).toBe("1");
  expect(trackListRenderTracker.textContent).toBe("1");
  expect(keyframeListRenderTracker.textContent).toBe("1");
});
