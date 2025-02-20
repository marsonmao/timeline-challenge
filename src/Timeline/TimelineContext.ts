import { createContext } from 'react';

export type TimelineContext = {
    time: number;
    setTime: (v: number) => void;
}

export const TimelineContext = createContext<TimelineContext>({
    time: 0,
    setTime: () => {}
});

