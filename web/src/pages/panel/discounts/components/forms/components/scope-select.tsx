import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { DiscountScopeEnum } from "~/services/discounts.service";
import locale from "../../helpers/locale";

export interface DiscountScopeSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const DiscountScopeSelect: React.FC<DiscountScopeSelectProps> =
  React.memo(({ value, onChange }) => {
    return (
      <FormControl color="secondary" size="small" fullWidth>
        <InputLabel size="small">Область действия</InputLabel>
        <Select
          id="scope"
          name="scope"
          value={value}
          label="Область действия"
          size="small"
          onChange={onChange}
        >
          <MenuItem value={DiscountScopeEnum.PRODUCTS}>
            {locale[DiscountScopeEnum.PRODUCTS]}
          </MenuItem>
          <MenuItem value={DiscountScopeEnum.PRODUCT_FEATURES}>
            {locale[DiscountScopeEnum.PRODUCT_FEATURES]}
          </MenuItem>
          <MenuItem value={DiscountScopeEnum.GLOBAL}>
            {locale[DiscountScopeEnum.GLOBAL]}
          </MenuItem>
        </Select>
      </FormControl>
    );
  });

DiscountScopeSelect.displayName = "DiscountScopeSelect";

export default DiscountScopeSelect;
