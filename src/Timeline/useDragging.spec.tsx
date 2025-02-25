import { fireEvent, render, screen } from "@testing-library/react";
import { useDragging } from "./useDragging";

describe("useDragging hook", () => {
  function TestComponent(): JSX.Element {
    const {
      isDragging,
      localStartPosition,
      globalStartPosition,
      localCurrentPosition,
      globalCurrentPosition,
      startDragging,
    } = useDragging({ fps: 60 });

    return (
      <div data-testid="drag-container" onMouseDown={startDragging}>
        <div data-testid="is-dragging">{isDragging ? "true" : "false"}</div>
        <div data-testid="local-start-position">
          {JSON.stringify(localStartPosition)}
        </div>
        <div data-testid="global-start-position">
          {JSON.stringify(globalStartPosition)}
        </div>
        <div data-testid="local-current-position">
          {JSON.stringify(localCurrentPosition)}
        </div>
        <div data-testid="global-current-position">
          {JSON.stringify(globalCurrentPosition)}
        </div>
      </div>
    );
  }

  const fakeBoundingRect = {
    left: 50,
    top: 50,
    right: 150,
    bottom: 150,
    width: 100,
    height: 100,
    x: 50,
    y: 50,
    toJSON: () => ({}),
  } as DOMRect;

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("onMouseDown starts dragging and sets start positions", async () => {
    render(<TestComponent />);
    const container = screen.getByTestId("drag-container");
    jest
      .spyOn(container, "getBoundingClientRect")
      .mockReturnValue(fakeBoundingRect);

    fireEvent.mouseDown(container, { clientX: 100, clientY: 200 });
    expect(screen.getByTestId("is-dragging").textContent).toBe("true");
    expect(
      JSON.parse(screen.getByTestId("local-start-position").textContent || "{}")
    ).toEqual({
      x: 50,
      y: 150,
    });
    expect(
      JSON.parse(
        screen.getByTestId("global-start-position").textContent || "{}"
      )
    ).toEqual({
      x: 100,
      y: 200,
    });
    expect(
      JSON.parse(
        screen.getByTestId("local-current-position").textContent || "{}"
      )
    ).toEqual({
      x: 50,
      y: 150,
    });
    expect(
      JSON.parse(
        screen.getByTestId("global-current-position").textContent || "{}"
      )
    ).toEqual({
      x: 100,
      y: 200,
    });
  });

  test("mouse move updates positions when dragging", async () => {
    render(<TestComponent />);
    const container = screen.getByTestId("drag-container");
    jest
      .spyOn(container, "getBoundingClientRect")
      .mockReturnValue(fakeBoundingRect);

    fireEvent.mouseDown(container, { clientX: 100, clientY: 200 });
    expect(screen.getByTestId("is-dragging").textContent).toBe("true");

    fireEvent.mouseMove(document, { clientX: 120, clientY: 220, buttons: 1 });
    jest.advanceTimersByTime(20);
    expect(
      JSON.parse(
        screen.getByTestId("local-current-position").textContent || "{}"
      )
    ).toEqual({
      x: 70,
      y: 170,
    });
    expect(
      JSON.parse(
        screen.getByTestId("global-current-position").textContent || "{}"
      )
    ).toEqual({
      x: 120,
      y: 220,
    });
  });

  test("mouse up stops dragging and updates positions", async () => {
    render(<TestComponent />);
    const container = screen.getByTestId("drag-container");
    jest
      .spyOn(container, "getBoundingClientRect")
      .mockReturnValue(fakeBoundingRect);

    fireEvent.mouseDown(container, { clientX: 100, clientY: 200 });
    expect(screen.getByTestId("is-dragging").textContent).toBe("true");

    fireEvent.mouseMove(document, { clientX: 120, clientY: 220, buttons: 1 });
    jest.advanceTimersByTime(20);
    fireEvent.mouseUp(document, { clientX: 120, clientY: 220, buttons: 0 });
    jest.advanceTimersByTime(20);
    expect(screen.getByTestId("is-dragging").textContent).toBe("false");
    expect(
      JSON.parse(
        screen.getByTestId("local-current-position").textContent || "{}"
      )
    ).toEqual({
      x: 70,
      y: 170,
    });
    expect(
      JSON.parse(
        screen.getByTestId("global-current-position").textContent || "{}"
      )
    ).toEqual({
      x: 120,
      y: 220,
    });
  });
});
