import { useCallback, useContext } from "react";
import { TimeContext } from "./TimeContext";
import { useLatest } from "./useLatest";

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

  const currentTimeLatest = useLatest(currentTime);
  const currentTimeConfigLatest = useLatest(currentTimeConfig);
  const setDurationTimeAndCapCurrentTime = useCallback(
    (durationTimeValue: number) => {
      setDurationTime(durationTimeValue);
      setCurrentTime(Math.min(currentTimeLatest.current, durationTimeValue));
      setCurrentTimeConfig({
        ...currentTimeConfigLatest.current,
        max: durationTimeValue,
      });
    },
    []
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
