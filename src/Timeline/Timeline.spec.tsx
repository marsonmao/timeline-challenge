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
