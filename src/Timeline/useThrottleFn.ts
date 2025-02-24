/**
 * https://github.com/afiiif/react-power-ups/blob/main/src/use-throttle-fn.ts
 * And modified...
 */
import { useCallback, useEffect, useRef } from "react";

/**
 * Throttles a function.
 *
 * •
 *
 * @param {Function} fn Function to be throttled.
 * @param {number} delay Delay in milliseconds.
 */
export function useThrottleFn<T extends unknown[]>(
  fn: (...params: T) => void,
  delay: number
): [(...params: T) => void, () => void] {
  const timeout = useRef<NodeJS.Timeout>();

  const fnRef = useRef(fn);
  fnRef.current = fn;

  const throttledFn = useCallback(
    (...params: T) => {
      if (!timeout.current) {
        fnRef.current(...params);

        timeout.current = setTimeout(() => {
          timeout.current = undefined;
        }, delay);
      }
    },
    [delay]
  );

  const clear = useCallback(() => {
    clearTimeout(timeout.current);
    timeout.current = undefined;
  }, []);

  useEffect(() => clear, [clear]);

  return [throttledFn, clear];
}
