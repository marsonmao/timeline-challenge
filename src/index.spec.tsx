import { render, screen } from "@testing-library/react";
import App from "./App";

it.skip("renders welcome message", () => {
  render(<App />);
  expect(screen.getByText("Time")).toBeInTheDocument();
});
