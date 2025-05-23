import { useRef } from "react";

export const RenderTracker = ({ dataTestId }: { dataTestId: string }) => {
  if (process.env.NODE_ENV !== "test") {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const renderCount = useRef(0);

  ++renderCount.current;

  return (
    <div
      data-testid={dataTestId}
      style={{
        display: "none",
      }}
    >{`${renderCount.current}`}</div>
  );
};
