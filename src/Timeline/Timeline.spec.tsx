import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timeline } from "./Timeline";
import { clickAndType } from "./test-util";

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
  expect(playheadRenderTracker.textContent).toBe("2"); // useInView created 2 render
  expect(trackListRenderTracker.textContent).toBe("1");
  expect(keyframeListRenderTracker.textContent).toBe("1");

  await clickAndType(currentTimeInput, "20");
  await userEvent.keyboard("{Enter}");
  expect(playControlsRenderTracker.textContent).toBe("2");
  expect(playheadRenderTracker.textContent).toBe("3");
  expect(rulerRenderTracker.textContent).toBe("2");
  expect(trackListRenderTracker.textContent).toBe("1");
  expect(keyframeListRenderTracker.textContent).toBe("1");
});

test("syncs scroll positions across timeline components", () => {
  const { getByTestId } = render(<Timeline />);

  const ruler = getByTestId("ruler") as HTMLElement;
  const keyframeList = getByTestId("keyframe-list") as HTMLElement;
  const playheadRoot = getByTestId("playhead-root") as HTMLElement; // playheadRoot is the parent of playhead
  const trackList = getByTestId("track-list") as HTMLElement;

  // --- Vertical sync ---
  keyframeList.scrollTop = 50;
  fireEvent.scroll(keyframeList);
  expect(trackList.scrollTop).toBe(50);

  // --- Horizontal sync ---
  ruler.scrollLeft = 100;
  fireEvent.scroll(ruler);
  expect(keyframeList.scrollLeft).toBe(100);
  expect(playheadRoot.scrollLeft).toBe(100);
});
