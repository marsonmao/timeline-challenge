import { useCallback } from "react";
import { useLatest } from "./useLatest";

export type ScrollSyncElement = Pick<
  React.DOMAttributes<HTMLElement>,
  "onScroll"
>;

export type UseScrollProps = {
  scrollXElements: Array<() => HTMLElement | null>;
  scrollYElements: Array<() => HTMLElement | null>;
};

function syncElementScrollPosition(
  targetElement: HTMLElement,
  allElements: Array<() => HTMLElement | null>,
  scrollType: "scrollLeft" | "scrollTop"
) {
  const nextScroll = targetElement[scrollType];
  allElements.forEach((getter) => {
    const element = getter();
    if (
      element !== targetElement &&
      element !== null &&
      element[scrollType] !== nextScroll
    ) {
      element[scrollType] = nextScroll;
    }
  });
}

export const useScroll = ({
  scrollXElements,
  scrollYElements,
}: UseScrollProps) => {
  const scrollXElementsLatest = useLatest(scrollXElements);
  const scrollYElementsLatest = useLatest(scrollYElements);

  const syncScrollX = useCallback<
    NonNullable<React.DOMAttributes<HTMLElement>["onScroll"]>
  >((e) => {
    syncElementScrollPosition(
      e.currentTarget,
      scrollXElementsLatest.current,
      "scrollLeft"
    );
  }, []);
  const syncScrollY = useCallback<
    NonNullable<React.DOMAttributes<HTMLElement>["onScroll"]>
  >((e) => {
    syncElementScrollPosition(
      e.currentTarget,
      scrollYElementsLatest.current,
      "scrollTop"
    );
  }, []);
  const syncBothScroll = useCallback<typeof syncScrollX>(
    (e) => {
      syncScrollX(e);
      syncScrollY(e);
    },
    [syncScrollX, syncScrollY]
  );

  return {
    syncScrollX,
    syncScrollY,
    syncBothScroll,
  };
};
