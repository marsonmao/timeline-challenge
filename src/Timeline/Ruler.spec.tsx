import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Ruler } from "./Ruler";

const mockSetCurrentTime = jest.fn();
const currentTimeConfig = { step: 10, min: 0, max: 600 };
const durationTime = 600;

jest.mock("./useTime", () => ({
  useCurrentTime: () => ({
    setCurrentTime: mockSetCurrentTime,
  }),
  useCurrentTimeConfig: () => ({
    currentTimeConfig,
  }),
  useDurationTime: () => ({
    durationTime,
  }),
}));

describe("Ruler component", () => {
  beforeEach(() => {
    mockSetCurrentTime.mockClear();
  });

  test("clicking on the ruler sets current time based on click position", async () => {
    render(<Ruler />);
    const rulerBar = screen.getByTestId("ruler-bar");
    jest.spyOn(rulerBar, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 0,
      right: 700,
      bottom: 20,
      width: 600,
      height: 20,
      x: 100,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    await userEvent.pointer({
      target: rulerBar,
      keys: "[MouseLeft]",
      coords: { x: 252, y: 10 },
    });
    expect(mockSetCurrentTime).toHaveBeenCalledWith(150);
  });

  test("mouse move with left button pressed sets current time", async () => {
    render(<Ruler />);
    const rulerBar = screen.getByTestId("ruler-bar");
    jest.spyOn(rulerBar, "getBoundingClientRect").mockReturnValue({
      left: 50,
      top: 0,
      right: 650,
      bottom: 20,
      width: 600,
      height: 20,
      x: 50,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    await userEvent.pointer({
      target: rulerBar,
      keys: "[MouseLeft>]",
      coords: { x: 52, y: 10 },
    });
    fireEvent.mouseMove(rulerBar, { clientX: 222, clientY: 10, buttons: 1 });
    await userEvent.pointer({ target: rulerBar, keys: "[/MouseLeft]" });
    expect(mockSetCurrentTime).toHaveBeenCalledWith(170);
  });

  test("mouse click without left button pressed does not update current time", async () => {
    render(<Ruler />);
    const rulerBar = screen.getByTestId("ruler-bar");
    jest.spyOn(rulerBar, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 600,
      bottom: 20,
      width: 600,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    await userEvent.pointer({
      target: rulerBar,
      keys: "[MouseRight]",
      coords: { x: 102, y: 10 },
    });
    expect(mockSetCurrentTime).not.toHaveBeenCalled();

    await userEvent.pointer({
      target: rulerBar,
      keys: "[MouseLeft]",
      coords: { x: 98, y: 10 },
    });
    expect(mockSetCurrentTime).toHaveBeenCalledWith(100);
  });
});
