import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { locale, ModifierCategoryDisplayVariantEnum } from "@monorepo/common";

export interface DisplayVariantSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}

export const DisplayVariantSelect: React.FC<DisplayVariantSelectProps> =
  React.memo(({ value, onChange }) => {
    return (
      <FormControl size="small" fullWidth>
        <InputLabel
          id="display-variant-select-label"
          color="secondary"
          required
        >
          Вариант отображения
        </InputLabel>
        <Select
          required
          id="display_variant"
          name="display_variant"
          labelId="display-variant-select-label"
          value={value}
          label="Вариант отображения"
          onChange={onChange}
          color="secondary"
        >
          <MenuItem value={ModifierCategoryDisplayVariantEnum.SWITCHER}>
            {locale[ModifierCategoryDisplayVariantEnum.SWITCHER]}
          </MenuItem>
          <MenuItem value={ModifierCategoryDisplayVariantEnum.LIST}>
            {locale[ModifierCategoryDisplayVariantEnum.LIST]}
          </MenuItem>
        </Select>
      </FormControl>
    );
  });

DisplayVariantSelect.displayName = "DisplayVariantSelect";

export default DisplayVariantSelect;
