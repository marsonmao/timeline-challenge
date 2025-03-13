import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timeline } from "./Timeline";
import { clickAndType, clickSpinner, pressArrowKey } from "./test-util";

describe("Timeline component behavior", () => {
  describe("Ensure optimized render performance", () => {
    test("the components subscribed to the time state render accordingly", async () => {
      render(<Timeline />);
      const currentTimeInput = screen.getByTestId(
        "current-time-input"
      ) as HTMLInputElement;
      const playControlsRenderTracker = screen.getByTestId(
        "play-controls-render-tracker"
      );
      const playheadRenderTracker = screen.getByTestId(
        "playhead-render-tracker"
      );
      const rulerRenderTracker = screen.getByTestId("ruler-render-tracker");
      const trackListRenderTracker = screen.getByTestId(
        "track-list-render-tracker"
      );
      const keyframeListRenderTracker = screen.getByTestId(
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

    test("When adjusting current time, all the Segments should not need to rerender", async () => {
      render(<Timeline />);
      const currentTimeInput = screen.getByTestId(
        "current-time-input"
      ) as HTMLInputElement;
      const segmentRenderTrackers = screen.getAllByTestId(
        "segment-render-tracker"
      );

      await clickAndType(currentTimeInput, "20");
      await userEvent.keyboard("{Enter}");
      segmentRenderTrackers.forEach((t) => {
        expect(t.textContent).toBe("1");
      });

      await clickAndType(currentTimeInput, "30");
      await userEvent.keyboard("{Enter}");
      segmentRenderTrackers.forEach((t) => {
        expect(t.textContent).toBe("1");
      });
    });
  });

  describe("Scroll sync", () => {
    test("syncs horizontal scroll positions across Ruler, KeyframeList, and Playhead", () => {
      render(<Timeline />);
      const ruler = screen.getByTestId("ruler") as HTMLElement;
      const keyframeList = screen.getByTestId("keyframe-list") as HTMLElement;
      const playheadRoot = screen.getByTestId("playhead-root") as HTMLElement;

      ruler.scrollLeft = 100;
      fireEvent.scroll(ruler);
      expect(keyframeList.scrollLeft).toBe(100);
      expect(playheadRoot.scrollLeft).toBe(100);
    });

    test("syncs vertical scroll positions between KeyframeList and TrackList", () => {
      render(<Timeline />);
      const keyframeList = screen.getByTestId("keyframe-list") as HTMLElement;
      const trackList = screen.getByTestId("track-list") as HTMLElement;

      keyframeList.scrollTop = 50;
      fireEvent.scroll(keyframeList);
      expect(trackList.scrollTop).toBe(50);
    });
  });

  describe("Components interactions", () => {
    test("Playhead position updates only after current time input is committed", async () => {
      render(<Timeline />);
      const currentTimeInput = screen.getByTestId(
        "current-time-input"
      ) as HTMLInputElement;
      const playhead = screen.getByTestId("playhead") as HTMLElement;

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
      render(<Timeline />);
      const rulerBar = screen.getByTestId("ruler-bar") as HTMLElement;

      expect(rulerBar.style.width).toBe("6000px");
    });

    test("Ruler updates its length only after Duration input is committed", async () => {
      render(<Timeline />);
      const durationInput = screen.getByTestId(
        "duration-input"
      ) as HTMLInputElement;
      const rulerBar = screen.getByTestId("ruler-bar") as HTMLElement;

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
      render(<Timeline />);
      const allSegments = await screen.findAllByTestId("segment");
      const firstSegment = allSegments[0] as HTMLElement;

      expect(firstSegment.style.width).toBe("6000px");
    });

    test("Segment updates its length only after Duration input is committed", async () => {
      render(<Timeline />);
      const allSegments = await screen.findAllByTestId("segment");
      const firstSegment = allSegments[0] as HTMLElement;
      const durationInput = screen.getByTestId(
        "duration-input"
      ) as HTMLInputElement;

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
