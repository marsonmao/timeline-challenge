import { useCallback, useContext } from "react";
import { TimelineContext } from "./TimelineContext";

export const useTime = () => {
  const {
    currentTime,
    setCurrentTime,
    currentTimeConfig,
    setCurrentTimeConfig,
    durationTime,
    setDurationTime,
    durationTimeConfig,
  } = useContext(TimelineContext);

  const setDurationTimeAndCapCurrentTime = useCallback(
    (durationTimeValue: number) => {
      setDurationTime(durationTimeValue);
      setCurrentTime(Math.min(currentTime, durationTimeValue));
      setCurrentTimeConfig({
        ...currentTimeConfig,
        max: durationTimeValue,
      });
    },
    [currentTime, currentTimeConfig]
  );

  return {
    currentTime,
    setCurrentTime,
    currentTimeConfig,
    durationTime,
    setDurationTime: setDurationTimeAndCapCurrentTime,
    durationTimeConfig,
  };
};
