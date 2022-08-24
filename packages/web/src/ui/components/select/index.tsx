import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select as MUISelect,
  SelectProps as MUISelectProps,
} from "@mui/material";
import React from "react";

export interface SelectOption<T = string> {
  name: string;
  value: T;
}

export interface SelectProps<T = string> extends MUISelectProps<T> {
  label: string;
  options: SelectOption<T>[];
  error?: boolean;
  helperText?: string;
}

export function Select<T extends string | number | boolean = string>({
  label,
  options,
  error,
  helperText,
  ...props
}: SelectProps<T>) {
  return (
    <FormControl error={error}>
      <InputLabel id="input-select-label">{label}</InputLabel>
      <MUISelect {...props} label={label} labelId="input-select-label">
        {options.map(opt => (
          <MenuItem key={opt.name} value={opt.value.toString()}>
            <ListItemText>{opt.name}</ListItemText>
          </MenuItem>
        ))}
      </MUISelect>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

export default Select;
