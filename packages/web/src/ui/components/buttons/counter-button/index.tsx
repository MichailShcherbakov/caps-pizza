import { Button, ButtonGroup, Stack, Typography } from "@mui/material";
import React from "react";
import styles from "./index.module.scss";

export interface CounterProps {
  initialCount?: number;
  maxValue?: number;
  minValue?: number;
  onIncrement?: (newValue: number) => void;
  onDecrement?: (newValue: number) => void;
  onValueChanged?: (newValue: number) => void;
}

export const INITIAL_MAX_VALUE = 15;
export const INITIAL_MIN_VALUE = 1;

export const CounterButton: React.FC<CounterProps> = ({
  initialCount = INITIAL_MIN_VALUE,
  maxValue = INITIAL_MAX_VALUE,
  minValue = INITIAL_MIN_VALUE,
  onIncrement,
  onDecrement,
  onValueChanged,
}) => {
  const [count, setCount] = React.useState<number>(minValue);

  React.useEffect(() => {
    if (initialCount < minValue || initialCount > maxValue) return;

    setCount(initialCount);
  }, [initialCount, minValue, maxValue]);

  const subtract = () => {
    if (count - 1 < minValue) return;

    setCount(count - 1);

    onDecrement && onDecrement(count - 1);
    onValueChanged && onValueChanged(count - 1);
  };

  const add = () => {
    if (count + 1 > maxValue) return;

    setCount(count + 1);

    onIncrement && onIncrement(count + 1);
    onValueChanged && onValueChanged(count + 1);
  };

  return (
    <ButtonGroup variant="contained" className={styles["counter-button"]}>
      <Button variant="contained" color="light" onClick={subtract}>
        <Typography variant="button">-</Typography>
      </Button>
      <Stack
        alignItems="center"
        justifyContent="center"
        className={styles["counter-button__label"]}
      >
        <Typography variant="button">{count}</Typography>
      </Stack>
      <Button variant="contained" color="light" onClick={add}>
        <Typography variant="button">+</Typography>
      </Button>
    </ButtonGroup>
  );
};

export default CounterButton;
