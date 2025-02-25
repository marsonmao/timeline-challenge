import { render, screen } from "@testing-library/react";
import { RenderTracker } from "./RenderTracker";

describe("RenderTracker", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test("renders the render count when NODE_ENV is 'test'", () => {
    process.env.NODE_ENV = "test";
    const {rerender} = render(<RenderTracker dataTestId="tracker" />);
    const tracker = screen.getByTestId("tracker");
    expect(tracker).toHaveTextContent("1");

    rerender(<RenderTracker dataTestId="tracker" />);
    expect(tracker).toHaveTextContent("2");
  });

  test("returns null when NODE_ENV is not 'test'", () => {
    process.env.NODE_ENV = "production";
    const { container } = render(<RenderTracker dataTestId="tracker" />);
    
    expect(container.firstChild).toBeNull();
  });
});
