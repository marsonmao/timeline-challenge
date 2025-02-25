import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30 * 1000,
  expect: {
    timeout: 2000,
  },
  fullyParallel: true,
  projects: [
    {
      name: "Chromium",
      use: {
        browserName: "chromium",
      },
    },
    // NOTE: disabled for now because this is a homework assignment
    // {
    //   name: "Firefox",
    //   use: {
    //     browserName: "firefox",
    //   },
    // },
    // {
    //   name: "WebKit",
    //   use: {
    //     browserName: "webkit",
    //   },
    // },
  ],
  reporter: "html",
});
