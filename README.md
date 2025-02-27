# Phase Timeline Challenge

## 📝 Notes to the review team 📝

### Technical decisions

1. **Project structure:** The files are flattened in `/src/Timeline` and `/e2e` because I'd like to keep it simple in this challenge. In a real world codebase we surely would manage them in dedicated folders like `/lib/hooks` etc.
1. **Eslint:** I tried to setup a complete Eslint config file with recommended plugins, but it produced many errors and I did not have enough time to fix them all, so I left the codebase without a config file and rely on the default setup from react-scripts.
1. **useInView:** In order to control the `hidden` attribute, I leveraged the familiar and popular library.
1. **useLatest:** In order to optimize the dependency arrays of e.g. `useCallback`, I copied a single file from the tool set `react-use`. Some of these optimizations could be replaced by `useEvent` in React 19.
1. **useDragging:** In order to provide better user experience when dragging, I added this hook to support a full screen dragging. This was created based on my former expereience in a similar complex music editor.
1. **ChatGPT and Copilot:** I leveraged these AI tools for creating test cases and setting up PlayWright. Everything is reviewed, of course.
1. **Workarounds for tests:** There are two workarounds in `test-util` because it seems that those behaviors are not correctly simulated in jsdom.
1. **DOM structure change in Playhead:** I added extra elements in this component because I'd like to leverage the native scrolling behavior to sync its position with Ruler. I'm not sure if the expected implementation is to control the transform of `playhead`. I left the test id unchanged and I hope my DOM structure would not fail the automated assesment.
1. **Regarding a requirement:** "Invalid inputs (non-numeric) revert to the previous valid value". Although it says "previous" value, after viewing the demo video multiple times, I feel it actually refers to the mimimum allowed value. This also simplifies the implementation since I don't need an extra state, so I decided to make it this way. Please let me know if we indeed want it to revert to the previous valid value.
1. **React context**: in this challenge, initially I tried to avoid using external libraries so I started with React context for managing global states. However, regarding the fact that I still added some dependencies, maybe I should also replace it with one of the popular state management libraries to achieve a better render performance. Afterall, in the real world case, we definitely use one.

### Commands

1. `yarn start` run the app in http://localhost:3000/
1. `yarn test /src` run all test cases and display the coverage report
1. `yarn test:e2e` run all e2e test cases; if you haven't installed it before, you might need `yarn playwright install --with-deps`; read here for more details https://playwright.dev/docs/intro#updating-playwright

**Happy to attend the challange! 😃** 2025/02/26

## Overview

Implement interactive features for a Timeline component. We will provide a basic Timeline component scaffold, and your task is to implement the functionality that meets the user behavior requirements outlined below.

![component-overview](./readme-assets/component-overview.jpg)

## Glossary

- **Timeline**: The main component that visually represents the duration of a sequence of events or changes over time.
- **Playhead**: The visual indicator that shows the current time position on the Timeline.
- **Current Time**: The specific time point indicated by the Playhead's position.
- **Duration**: The total length of time represented by the Timeline.
- **Ruler**: The component showing time measurements and increments along the Timeline.
- **Track**: A horizontal lane on the Timeline that can contain multiple Keyframes, often used to group related events or changes.
- **Track List**: The component that displays and manages multiple Tracks.
- **Keyframe**: A marked point on the Timeline representing a significant event, change, or state.
- **Keyframe List**: The component that shows the Keyframes across all Tracks, synchronized with the Ruler.
- **Segment**: The visual representation of the Timeline's duration in the Keyframe List.

## User Behavior Requirements

### 1. Number Input Field

#### Interface

| Prop       | Type               | Description                                      |
| ---------- | ------------------ | ------------------------------------------------ |
| `value`    | `number`           | The current value of the input field             |
| `onChange` | `(number) => void` | The callback to be called when the value changes |

#### Behavior

https://github.com/user-attachments/assets/8dd5ef2b-6b57-43dc-91b3-0d322d148781

- [x] The displayed value updates immediately while typing, but `onChange` is not triggered until input is confirmed
- [x] Clicking outside the input field removes focus and changes the value
- [x] Clicking on the native step buttons immediately changes the value
- [x] Pressing up arrow or down arrow keys immediately changes the value
- [x] Entire text is selected when the input field gains focus
- [x] Entire text is selected after using the native step buttons
- [x] Entire text is selected after using the up arrow or down arrow keys
- [x] Pressing Enter confirms the new value and removes focus
- [x] Pressing Escape reverts to the original value and removes focus
- [x] Leading zeros are automatically removed
- [x] Negative values are automatically adjusted to the minimum allowed value
- [x] Decimal values are automatically rounded to the nearest integer
- [x] Invalid inputs (non-numeric) revert to the previous valid value

### 2. Play Controls Behavior

https://github.com/user-attachments/assets/9a669854-e0c5-4950-8364-10fe0b40d16b

- [x] Current Time is always between `0ms` and the Duration
- [x] Current Time adjusts if it exceeds the newly set Duration
- [x] Duration is always between `100ms` and `6000ms`
- [x] Current Time and Duration are always multiples of `10ms`
- [x] Current Time and Duration are always positive integers
- [x] Playhead position updates only after specific actions on Current Time input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 3. Ruler Behavior

https://github.com/user-attachments/assets/42190ade-f708-45a1-8168-2be779c66390

- [x] Clicking or dragging on the Ruler updates the Current Time and Playhead position
- [x] Horizontal scrolling of the Ruler is synchronized with the Keyframe List
- [x] Ruler length visually represents the total Duration (`1ms = 1px`)
- [x] Ruler length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 4. Track List Behavior

https://github.com/user-attachments/assets/94b5e2c8-ef32-488e-97e4-d53036bbf2f7

- [x] Vertical scrolling of the Track List is synchronized with the Keyframe List

### 5. Keyframe List Behavior

https://github.com/user-attachments/assets/99826161-f821-4e4d-b9a8-b59c16d9894e

- [x] Vertical scrolling is synchronized with the Track List
- [x] Horizontal scrolling is synchronized with the Ruler
- [x] Segment length visually represents the total Duration (`1ms = 1px`)
- [x] Segment length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 6. Playhead Behavior

https://github.com/user-attachments/assets/3940cd0d-dd9d-4331-9172-592462ad65d3

- [x] Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling
- [x] Playhead maintains its relative position during horizontal scrolling
- [x] Playhead is visible only when within the Timeline's visible area, using the `hidden` attribute when completely out of view

## Implementation Guidelines

- Implement the required behaviors in the appropriate child components of the provided Timeline
- Write comprehensive tests to ensure that the implementation meets the user behavior requirements, including edge cases
- Consider performance implications, such as minimizing unnecessary re-renders
- Pay attention to user experience and interface design
- Write clean, well-documented, and maintainable code

## Important Notes

⚠️ **Warning**: Do not change any `data-testid` attribute names in the provided components. These are used for automated assessment of your assignment. Modifying these names may result in failing the assessment criteria.

## Submission

- Share your code repository (GitHub or GitLab) containing the implemented solution
- Ensure the repository includes all necessary code, tests, and documentation
- Provide any additional setup or running instructions in the repository's README file
- Be prepared to answer follow-up questions about your implementation if requested

Good luck with the Phase Timeline Challenge!
