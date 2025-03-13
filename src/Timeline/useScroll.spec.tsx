import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { useScroll } from "./useScroll";

const DummyScrollSync = ({ mode }: { mode: "x" | "y" | "both" }) => {
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);

  const scrollXElements =
    mode === "x" || mode === "both"
      ? [() => div1Ref.current, () => div2Ref.current]
      : [];
  const scrollYElements =
    mode === "y" || mode === "both"
      ? [() => div1Ref.current, () => div2Ref.current]
      : [];

  const { syncScrollX, syncScrollY, syncBothScroll } = useScroll({
    scrollXElements,
    scrollYElements,
  });

  const handler =
    mode === "both" ? syncBothScroll : mode === "x" ? syncScrollX : syncScrollY;

  return (
    <div>
      <div
        ref={div1Ref}
        onScroll={handler}
        data-testid="div1"
        style={{
          overflow: "auto",
          width: "100px",
          height: "100px",
          border: "1px solid blue",
        }}
      >
        {/* Content larger than container to enable scrolling */}
        <div style={{ width: "500px", height: "500px" }}>Content 1</div>
      </div>
      <div
        ref={div2Ref}
        onScroll={handler}
        data-testid="div2"
        style={{
          overflow: "auto",
          width: "100px",
          height: "100px",
          border: "1px solid red",
        }}
      >
        <div style={{ width: "500px", height: "500px" }}>Content 2</div>
      </div>
    </div>
  );
};

describe("useScroll behavior", () => {
  const fakeBoundingRect = {
    left: 0,
    top: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect;

  test("syncScrollX: horizontal scroll sync", () => {
    render(<DummyScrollSync mode="x" />);
    const div1 = screen.getByTestId("div1") as HTMLDivElement;
    const div2 = screen.getByTestId("div2") as HTMLDivElement;
    jest.spyOn(div1, "getBoundingClientRect").mockReturnValue(fakeBoundingRect);
    jest.spyOn(div2, "getBoundingClientRect").mockReturnValue(fakeBoundingRect);

    div1.scrollLeft = 50;
    fireEvent.scroll(div1);
    expect(div2.scrollLeft).toBe(50);
  });

  test("syncScrollY: vertical scroll sync", () => {
    render(<DummyScrollSync mode="y" />);
    const div1 = screen.getByTestId("div1") as HTMLDivElement;
    const div2 = screen.getByTestId("div2") as HTMLDivElement;
    jest.spyOn(div1, "getBoundingClientRect").mockReturnValue(fakeBoundingRect);
    jest.spyOn(div2, "getBoundingClientRect").mockReturnValue(fakeBoundingRect);

    div1.scrollTop = 80;
    fireEvent.scroll(div1);
    expect(div2.scrollTop).toBe(80);
  });

  test("syncBothScroll: syncs both horizontal and vertical scroll positions", () => {
    render(<DummyScrollSync mode="both" />);
    const div1 = screen.getByTestId("div1") as HTMLDivElement;
    const div2 = screen.getByTestId("div2") as HTMLDivElement;
    jest.spyOn(div1, "getBoundingClientRect").mockReturnValue(fakeBoundingRect);
    jest.spyOn(div2, "getBoundingClientRect").mockReturnValue(fakeBoundingRect);

    div1.scrollLeft = 30;
    div1.scrollTop = 90;
    fireEvent.scroll(div1);
    expect(div2.scrollLeft).toBe(30);
    expect(div2.scrollTop).toBe(90);
  });
});
