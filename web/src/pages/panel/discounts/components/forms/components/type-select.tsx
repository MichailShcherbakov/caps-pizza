import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { DiscountTypeEnum } from "~/services/discounts.service";
import locale from "../../helpers/locale";

export interface DiscountTypeSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const DiscountTypeSelect: React.FC<DiscountTypeSelectProps> = React.memo(
  ({ value, onChange }) => {
    return (
      <FormControl color="secondary" size="small" fullWidth>
        <InputLabel size="small">Тип</InputLabel>
        <Select
          id="type"
          name="type"
          value={value}
          label="Тип"
          size="small"
          onChange={onChange}
        >
          <MenuItem value={DiscountTypeEnum.PERCENT}>
            {locale[DiscountTypeEnum.PERCENT]}
          </MenuItem>
          <MenuItem value={DiscountTypeEnum.IN_CASH}>
            {locale[DiscountTypeEnum.IN_CASH]}
          </MenuItem>
          <MenuItem value={DiscountTypeEnum.FIXED_PRICE}>
            {locale[DiscountTypeEnum.FIXED_PRICE]}
          </MenuItem>
        </Select>
      </FormControl>
    );
  }
);

DiscountTypeSelect.displayName = "DiscountTypeSelect";

export default DiscountTypeSelect;
