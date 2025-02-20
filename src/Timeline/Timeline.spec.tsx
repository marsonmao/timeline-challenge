import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timeline } from "./Timeline";


test("the value should reflect user input", async () => {
  const { getByTestId } = render(<Timeline />);

  const currentTimeInput = getByTestId(
    "current-time-input"
  ) as HTMLInputElement;

  expect(currentTimeInput.value).toBe("0");

  await userEvent.type(currentTimeInput, "20");

  expect(currentTimeInput.value).toBe("20");
});
