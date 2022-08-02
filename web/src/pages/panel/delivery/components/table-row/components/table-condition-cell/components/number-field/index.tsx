import { InputAdornment, TextField } from "@mui/material";
import React, { ChangeEvent } from "react";

export interface NumberFieldProps {
  value?: number;
  onChange?: (value: number) => void;
  adornment?: string;
  error?: boolean;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  value,
  onChange,
  adornment = "₽",
  error,
}) => {
  const [val, setVal] = React.useState<number>(0);

  React.useEffect(() => {
    if (!value) return;

    setVal(value);
  }, [value]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value.length && Number.parseFloat(e.target.value);

    setVal(newVal);
    onChange && onChange(newVal);
  };

  return (
    <TextField
      type="number"
      label="Значение"
      size="small"
      error={error}
      onChange={onChangeHandler}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{adornment}</InputAdornment>
        ),
      }}
      value={val}
    />
  );
};

export default NumberField;
