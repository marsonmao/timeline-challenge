import userEvent from "@testing-library/user-event";

export const clickAndType = async (input: HTMLInputElement, value: string) => {
  await userEvent.click(input);

  // Seems that even if handleFocus of NumberInput.tsx did called input.select(),
  // it won't work in the test environment.
  // Therefore, explicitly setting the selection range is needed.
  await userEvent.type(input, value, {
    initialSelectionStart: 0,
    initialSelectionEnd: input.value.length,
  });
};
