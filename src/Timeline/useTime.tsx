import { useCallback, useContext } from "react";
import { TimeContext } from "./TimeContext";

export const useTime = () => {
  const {
    currentTime,
    setCurrentTime,
    currentTimeConfig,
    setCurrentTimeConfig,
    durationTime,
    setDurationTime,
    durationTimeConfig,
  } = useContext(TimeContext);

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
