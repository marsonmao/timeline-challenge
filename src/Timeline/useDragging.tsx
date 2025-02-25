import { useCallback, useEffect, useRef, useState } from "react";
import { useThrottleFn } from "./useThrottleFn";

export const useDragging = ({ fps = 60 }: { fps?: 30 | 60 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const elementRect = useRef({
    top: 0,
    left: 0,
  });
  const localStartPosition = useRef({
    x: 0,
    y: 0,
  });
  const globalStartPosition = useRef({
    x: 0,
    y: 0,
  });
  const [localCurrentPosition, setLocalCurrentPosition] = useState({
    x: 0,
    y: 0,
  });
  const [globalCurrentPosition, setGlobalCurrentPosition] = useState({
    x: 0,
    y: 0,
  });
  const updatePositions = useCallback((e: MouseEvent) => {
    const localPosition = {
      x: e.clientX - elementRect.current.left,
      y: e.clientY - elementRect.current.top,
    };
    const globalPosition = {
      x: e.clientX,
      y: e.clientY,
    };
    setLocalCurrentPosition(localPosition);
    setGlobalCurrentPosition(globalPosition);
  }, []);
  const [updatePositionsThrottled] = useThrottleFn(
    updatePositions,
    fps === 30 ? 32 : 16
  );

  const startDragging = useCallback<
    NonNullable<React.DOMAttributes<HTMLDivElement>["onMouseDown"]>
  >((e) => {
    setIsDragging(true);
    const { left, top } = e.currentTarget.getBoundingClientRect();
    elementRect.current = { left, top };
    localStartPosition.current = {
      x: e.clientX - elementRect.current.left,
      y: e.clientY - elementRect.current.top,
    };
    globalStartPosition.current = {
      x: e.clientX,
      y: e.clientY,
    };
    setLocalCurrentPosition(localStartPosition.current);
    setGlobalCurrentPosition(globalStartPosition.current);
  }, []);

  useEffect(() => {
    function stopDragging(e: MouseEvent) {
      setIsDragging(false);
      updatePositions(e);
    }

    if (isDragging) {
      document.addEventListener("mousemove", updatePositionsThrottled);
      document.addEventListener("mouseup", stopDragging);
    }

    return () => {
      document.removeEventListener("mousemove", updatePositionsThrottled);
      document.removeEventListener("mouseup", stopDragging);
    };
  }, [isDragging, updatePositionsThrottled, updatePositions]);

  return {
    isDragging,
    localStartPosition: localStartPosition.current,
    globalStartPosition: globalStartPosition.current,
    localCurrentPosition,
    globalCurrentPosition,
    startDragging,
  };
};
