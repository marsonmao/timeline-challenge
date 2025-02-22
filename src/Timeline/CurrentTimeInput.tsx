import { NumberInput, NumberInputProps } from "./NumberInput";

export type TimeConfig = {
  timeStep: number;
  minTime: number;
  maxTime: number;
};

export function validateTime(
  rawTime: number,
  config: TimeConfig
): number {
  let time = Math.round(rawTime / config.timeStep) * config.timeStep;
  if (Number.isNaN(rawTime) || rawTime === -Infinity) {
    time = config.minTime;
  } else if (time === Infinity) {
    time = config.maxTime;
  }
  return Math.min(config.maxTime, Math.max(config.minTime, time));
}

export type CurrentTimeInputProps = {config:TimeConfig}&Omit<NumberInputProps, "validator">;

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
      validator={(rawTime) => validateTime(rawTime, config)}
      min={config.minTime}
      max={config.maxTime}
      step={config.timeStep}
      {...rest}
    />
  );
};
