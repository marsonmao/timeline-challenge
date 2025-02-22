import { NumberInput, type NumberInputProps } from "./NumberInput";

export type TimeConfig = {
  timeStep: number;
  minEndTime: number;
  maxEndTime: number;
};

export function validateTime(
  rawTime: number,
  config: TimeConfig
): number {
  let time = Math.round(rawTime / config.timeStep) * config.timeStep;
  if (Number.isNaN(rawTime) || rawTime === -Infinity) {
    time = config.minEndTime;
  } else if (time === Infinity) {
    time = config.maxEndTime;
  }
  return Math.min(config.maxEndTime, Math.max(config.minEndTime, time));
}

export type CurrentTimeInputProps = {config:TimeConfig}&Omit<NumberInputProps, "validateTime">;

export const CurrentTimeInput = ({
  value,
  onChange,
  config,
  ...rest
}: CurrentTimeInputProps) => {
  return (
    <NumberInput
      value={value}
      onChange={onChange}
      validateTime={(rawTime) => validateTime(rawTime, config)}
      min={0}
      max={config.maxEndTime}
      step={config.timeStep}
      {...rest}
    />
  );
};
