import { test, expect, Page } from "@playwright/test";

test.describe("Timeline - Current Time Input", () => {
  const url = "http://localhost:3000";

  test("Complete number representation is accepted: 1e+2 --> 100", async ({
    page,
  }) => {
    await page.goto(url);
    const input = page.getByTestId("current-time-input");
    await expect(input).toHaveValue("0");

    await input.click();
    await input.fill("1e+2"); // This simulates pasting "1e+2" into the input element.
    await expect(input).toHaveValue("1e+2");
    await expect(input).not.toHaveAttribute("data-invalid", "true");

    await page.keyboard.press("Enter");
    await expect(input).toHaveValue("100");
    await expect(input).not.toHaveAttribute("data-invalid", "true");
  });

  test.skip("1e+2 --> 100 [Initial and failed attempt]", async ({ page }) => {
    await page.goto(url);
    const input = page.getByTestId("current-time-input");
    await expect(input).toHaveValue("0");

    await input.click();
    /**
     * PlayWright cannot simulate the paste event properly, so we have to use evaluate() to set the value of the input element.
     * This is a workaround to simulate pasting "1e+2" into the input element.
     * However...except this also does not work as expected.
     * Therefore the case is skipped.
     */
    await input.evaluate((el, pastedText) => {
      const inputEl = el as HTMLInputElement;
      inputEl.value = pastedText;
      inputEl.dispatchEvent(new Event("input", { bubbles: true }));
    }, "1e+2");
    await expect(input).toHaveValue("1e+2");
    await expect(input).not.toHaveAttribute("data-invalid", "true");

    await page.keyboard.press("Enter");
    await expect(input).toHaveValue("100"); // Failed...still "0"
    await expect(input).not.toHaveAttribute("data-invalid", "true");
  });

  test.describe("Invalid inputs change to the minimum allowed value", () => {
    async function testInvalidInput({
      page,
      invalidInputValue,
      expectedValue = "0",
      finalValue = "0",
    }: {
      page: Page;
      invalidInputValue: string;
      expectedValue?: string;
      finalValue?: string;
    }) {
      await page.goto(url);
      const input = page.getByTestId("current-time-input");
      await expect(input).toHaveValue("0");

      await input.click();
      await input.pressSequentially("199");
      await page.keyboard.press("Enter");
      await expect(input).toHaveValue("200");

      await input.click();
      await input.pressSequentially(invalidInputValue);
      await expect(input).toHaveValue(expectedValue);

      await page.keyboard.press("Enter");
      await expect(input).toHaveValue(finalValue);
    }

    const invalidInputs = [
      {
        invalidInputValue: "abc",
      },
      {
        invalidInputValue: "-",
      },
      {
        invalidInputValue: "+",
      },
      {
        invalidInputValue: "e",
      },
      {
        invalidInputValue: "1e",
      },
      {
        invalidInputValue: "-1",
        expectedValue: "01",
        finalValue: "0",
      },
    ];
    for (const { invalidInputValue, expectedValue = "0" } of invalidInputs) {
      test(`${invalidInputValue} should results in ${expectedValue}`, async ({
        page,
      }) => {
        await testInvalidInput({ page, invalidInputValue, expectedValue });
      });
    }
  });
});
