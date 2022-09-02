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
        sx={{
          width: "100%",
        }}
        spacing={2}
      >
        <TextField
          {...TextFieldProps}
          fullWidth
          size="small"
          color="secondary"
        />
        <FormControl size="small" sx={{ minWidth: "72px" }}>
          <InputLabel id="input-select-label" color="secondary" size="small">
            {SelectProps?.label}
          </InputLabel>
          <Select
            {...SelectProps}
            labelId="input-select-label"
            color="secondary"
            size="small"
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
