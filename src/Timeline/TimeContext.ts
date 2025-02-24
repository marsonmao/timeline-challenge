import { createContext } from "react";

export type TimeConfig = {
  step: number;
  min: number;
  max: number;
};

export type TimeContext = {
  currentTime: number;
  setCurrentTime: (v: number) => void;
  currentTimeConfig: TimeConfig;
  setCurrentTimeConfig: (v: TimeConfig) => void;
  durationTime: number;
  setDurationTime: (v: number) => void;
  durationTimeConfig: TimeConfig;
};

export const TimeContext = createContext<TimeContext>({
  currentTime: 0,
  setCurrentTime: () => {},
  currentTimeConfig: { step: 1, min: 0, max: 100 },
  setCurrentTimeConfig: () => {},
  durationTime: 0,
  setDurationTime: () => {},
  durationTimeConfig: { step: 1, min: 0, max: 100 },
});
