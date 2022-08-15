import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { DiscountOperatorEnum } from "~/services/discounts.service";
import locale from "../../helpers/locale";

export interface DiscountOperatorSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const DiscountOperatorSelect: React.FC<DiscountOperatorSelectProps> =
  React.memo(({ value, onChange }) => {
    return (
      <FormControl color="secondary" size="small" fullWidth>
        <InputLabel size="small">Оператор</InputLabel>
        <Select
          id="conditionOp"
          name="conditionOp"
          value={value}
          label="Оператор"
          size="small"
          onChange={onChange}
        >
          <MenuItem value={DiscountOperatorEnum.EQUAL}>
            {locale[DiscountOperatorEnum.EQUAL]}
          </MenuItem>
          <MenuItem value={DiscountOperatorEnum.LESS}>
            {locale[DiscountOperatorEnum.LESS]}
          </MenuItem>
          <MenuItem value={DiscountOperatorEnum.GREATER}>
            {locale[DiscountOperatorEnum.GREATER]}
          </MenuItem>
          <MenuItem value={DiscountOperatorEnum.BETWEEN}>
            {locale[DiscountOperatorEnum.BETWEEN]}
          </MenuItem>
        </Select>
      </FormControl>
    );
  });

DiscountOperatorSelect.displayName = "DiscountOperatorSelect";

export default DiscountOperatorSelect;
