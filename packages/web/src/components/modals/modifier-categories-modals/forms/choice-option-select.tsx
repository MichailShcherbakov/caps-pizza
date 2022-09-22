import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { locale, ModifierCategoryChoiceOptionEnum } from "@monorepo/common";

export interface СhoiceOptionSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}

export const СhoiceOptionSelect: React.FC<СhoiceOptionSelectProps> = React.memo(
  ({ value, onChange }) => {
    return (
      <FormControl size="small" fullWidth>
        <InputLabel id="choice-option-select-label" color="secondary" required>
          Вариант выбора
        </InputLabel>
        <Select
          required
          id="choice_option"
          name="choice_option"
          labelId="choice-option-select-label"
          value={value}
          label="Вариант выбора"
          onChange={onChange}
          color="secondary"
        >
          <MenuItem value={ModifierCategoryChoiceOptionEnum.ONE}>
            {locale[ModifierCategoryChoiceOptionEnum.ONE]}
          </MenuItem>
          <MenuItem value={ModifierCategoryChoiceOptionEnum.MANY}>
            {locale[ModifierCategoryChoiceOptionEnum.MANY]}
          </MenuItem>
        </Select>
      </FormControl>
    );
  }
);

СhoiceOptionSelect.displayName = "СhoiceOptionSelect";

export default СhoiceOptionSelect;
