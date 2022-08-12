import { InputAdornment, TextField } from "@mui/material";
import React, { ChangeEvent } from "react";
import { TextFieldProps } from "~/ui/components/text-field";

export interface NumberFieldProps extends Omit<TextFieldProps, "onChange"> {
  value?: number;
  adornment?: string;
  error?: boolean;
  onChange?: (value: number) => void;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  value,
  onChange,
  adornment = "₽",
  error,
  ...props
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
      {...props}
      type="number"
      label="Значение"
      size="small"
      error={error}
      value={val}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{adornment}</InputAdornment>
        ),
      }}
      onChange={onChangeHandler}
    />
  );
};

export default NumberField;
