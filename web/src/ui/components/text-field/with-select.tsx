import {
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectProps,
  Stack,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React from "react";
import styles from "./index.module.scss";

export interface TextFieldWithSelectProps {
  TextFieldProps?: TextFieldProps;
  SelectProps?: SelectProps;
  options?: { name: string; value: string }[];
}

export const TextFieldWithSelect: React.FC<TextFieldWithSelectProps> =
  React.memo(({ TextFieldProps, SelectProps, options = [] }) => {
    return (
      <Stack
        direction="row"
        alignItems="center"
        className="ui-w-full"
        spacing={2}
      >
        <TextField
          {...TextFieldProps}
          fullWidth
          size="small"
          color="secondary"
          className={[styles["text-field"], TextFieldProps?.className].join(
            " "
          )}
        />
        <FormControl size="small" className={styles["text-field__select"]}>
          <InputLabel id="input-select-label" color="secondary">
            {SelectProps?.label}
          </InputLabel>
          <Select
            {...SelectProps}
            labelId="input-select-label"
            color="secondary"
          >
            {options.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                <ListItemText>{opt.name}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    );
  });

TextFieldWithSelect.displayName = "TextFieldWithSelect";

export default TextFieldWithSelect;
