/**
 * https://github.com/streamich/react-use/blob/master/src/useLatest.ts
 */
import { useRef } from "react";

export const useLatest = <T extends unknown>(
  value: T
): { readonly current: T } => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
