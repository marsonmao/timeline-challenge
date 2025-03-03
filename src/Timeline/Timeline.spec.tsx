import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timeline } from "./Timeline";
import { clickAndType, clickSpinner, pressArrowKey } from "./test-util";

describe("Timeline component behavior", () => {
  test("the components subscribed to the time state render accordingly", async () => {
    const { getByTestId } = render(<Timeline />);
    const currentTimeInput = getByTestId(
      "current-time-input"
    ) as HTMLInputElement;
    const playControlsRenderTracker = getByTestId(
      "play-controls-render-tracker"
    );
    const playheadRenderTracker = getByTestId("playhead-render-tracker");
    const rulerRenderTracker = getByTestId("ruler-render-tracker");
    const trackListRenderTracker = getByTestId("track-list-render-tracker");
    const keyframeListRenderTracker = getByTestId(
      "keyframe-list-render-tracker"
    );

    // Initial render
    expect(playControlsRenderTracker.textContent).toBe("1");
    expect(rulerRenderTracker.textContent).toBe("1");
    expect(playheadRenderTracker.textContent).toBe("2"); // useInView created 2 renders
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

  describe("Scroll sync", () => {
    test("syncs horizontal scroll positions across Ruler, KeyframeList, and Playhead", () => {
      const { getByTestId } = render(<Timeline />);
      const ruler = getByTestId("ruler") as HTMLElement;
      const keyframeList = getByTestId("keyframe-list") as HTMLElement;
      const playheadRoot = getByTestId("playhead-root") as HTMLElement;

      ruler.scrollLeft = 100;
      fireEvent.scroll(ruler);
      expect(keyframeList.scrollLeft).toBe(100);
      expect(playheadRoot.scrollLeft).toBe(100);
    });

    test("syncs vertical scroll positions between KeyframeList and TrackList", () => {
      const { getByTestId } = render(<Timeline />);
      const keyframeList = getByTestId("keyframe-list") as HTMLElement;
      const trackList = getByTestId("track-list") as HTMLElement;

      keyframeList.scrollTop = 50;
      fireEvent.scroll(keyframeList);
      expect(trackList.scrollTop).toBe(50);
    });
  });

  describe("Components interactions", () => {
    test("Playhead position updates only after current time input is committed", async () => {
      const { getByTestId } = render(<Timeline />);
      const currentTimeInput = getByTestId(
        "current-time-input"
      ) as HTMLInputElement;
      const playhead = getByTestId("playhead") as HTMLElement;

      await clickAndType(currentTimeInput, "100");
      await userEvent.tab();
      expect(playhead.style.transform).toBe("translateX(calc(100px - 50%))");

      await clickAndType(currentTimeInput, "200");
      await userEvent.keyboard("{Enter}");
      expect(playhead.style.transform).toBe("translateX(calc(200px - 50%))");

      await clickAndType(currentTimeInput, "300");
      pressArrowKey(currentTimeInput, "ArrowUp", 300, 10);
      expect(playhead.style.transform).toBe("translateX(calc(310px - 50%))");

      clickSpinner(currentTimeInput, "increment", 310, 10);
      expect(playhead.style.transform).toBe("translateX(calc(320px - 50%))");
    });

    test("Ruler length visually represents the total Duration", () => {
      const { getByTestId } = render(<Timeline />);
      const rulerBar = getByTestId("ruler-bar") as HTMLElement;

      expect(rulerBar.style.width).toBe("6000px");
    });

    test("Ruler updates its length only after Duration input is committed", async () => {
      const { getByTestId } = render(<Timeline />);
      const durationInput = getByTestId("duration-input") as HTMLInputElement;
      const rulerBar = getByTestId("ruler-bar") as HTMLElement;

      expect(rulerBar.style.width).toBe("6000px");

      await clickAndType(durationInput, "3000");
      await userEvent.tab();
      expect(rulerBar.style.width).toBe("3000px");

      await clickAndType(durationInput, "4000");
      await userEvent.keyboard("{Enter}");
      expect(rulerBar.style.width).toBe("4000px");

      await clickAndType(durationInput, "4050");
      pressArrowKey(durationInput, "ArrowUp", 4050, 10);
      expect(rulerBar.style.width).toBe("4060px");

      clickSpinner(durationInput, "increment", 4060, 10);
      expect(rulerBar.style.width).toBe("4070px");
    });

    test("Segment (KeyframeList) length visually represents the total Duration", async () => {
      const { findAllByTestId } = render(<Timeline />);
      const allSegments = await findAllByTestId("segment");
      const firstSegment = allSegments[0] as HTMLElement;

      expect(firstSegment.style.width).toBe("6000px");
    });

    test("Segment updates its length only after Duration input is committed", async () => {
      const { getByTestId, findAllByTestId } = render(<Timeline />);
      const allSegments = await findAllByTestId("segment");
      const firstSegment = allSegments[0] as HTMLElement;
      const durationInput = getByTestId("duration-input") as HTMLInputElement;

      expect(firstSegment.style.width).toBe("6000px");

      await clickAndType(durationInput, "3000");
      await userEvent.tab();
      expect(firstSegment.style.width).toBe("3000px");

      await clickAndType(durationInput, "4000");
      await userEvent.keyboard("{Enter}");
      expect(firstSegment.style.width).toBe("4000px");

      await clickAndType(durationInput, "4050");
      pressArrowKey(durationInput, "ArrowUp", 4050, 10);
      expect(firstSegment.style.width).toBe("4060px");

      clickSpinner(durationInput, "increment", 4060, 10);
      expect(firstSegment.style.width).toBe("4070px");
    });
  });
});
