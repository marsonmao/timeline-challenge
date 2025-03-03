import { atom, createStore, useAtom } from "jotai";
import { useState } from "react";

export type TimeConfig = {
  step: number;
  min: number;
  max: number;
};

const currentTimeAtom = atom(0);
const currentTimeConfigAtom = atom<TimeConfig>({
  step: 1,
  min: 0,
  max: 100,
});
const durationTimeAtom = atom(0);
const durationTimeConfigAtom = atom<TimeConfig>({
  step: 1,
  min: 0,
  max: 100,
});
const durationTimeAtomExpanded = atom(
  (get) => get(durationTimeAtom),
  (get, set, newDurationTime: number) => {
    set(durationTimeAtom, newDurationTime);
    set(currentTimeAtom, Math.min(get(currentTimeAtom), newDurationTime));
    set(currentTimeConfigAtom, {
      ...get(currentTimeConfigAtom),
      max: newDurationTime,
    });
  }
);

/**
 * This should only be used once inthe root of the component tree
 */
export const useTimeStore = ({
  initialDurationTimeConfig,
  initialCurrentTimeConfig,
  initialDurationTime,
  initialCurrentTime,
}: {
  initialDurationTimeConfig: TimeConfig;
  initialCurrentTimeConfig: TimeConfig;
  initialDurationTime?: number;
  initialCurrentTime?: number;
}) => {
  const [timeStore] = useState(() => {
    const store = createStore();
    store.set(
      durationTimeAtom,
      initialDurationTime ?? initialDurationTimeConfig.max
    );
    store.set(durationTimeConfigAtom, initialDurationTimeConfig);
    store.set(
      currentTimeAtom,
      initialCurrentTime ?? initialCurrentTimeConfig.min
    );
    store.set(currentTimeConfigAtom, initialCurrentTimeConfig);
    return store;
  });
  return timeStore;
};

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  return {
    currentTime,
    setCurrentTime,
  };
};

export const useDurationTime = () => {
  const [durationTime, setDurationTime] = useAtom(durationTimeAtomExpanded);
  return {
    durationTime,
    setDurationTime,
  };
};

export const useCurrentTimeConfig = () => {
  const [currentTimeConfig, setCurrentTimeConfig] = useAtom(
    currentTimeConfigAtom
  );
  return {
    currentTimeConfig,
    setCurrentTimeConfig,
  };
};

export const useDurationTimeConfig = () => {
  const [durationTimeConfig, setDurationTimeConfig] = useAtom(
    durationTimeConfigAtom
  );
  return {
    durationTimeConfig,
    setDurationTimeConfig,
  };
};
