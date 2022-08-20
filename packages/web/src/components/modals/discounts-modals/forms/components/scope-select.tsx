import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import {
  DiscountCriteriaEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "~/services/discounts.service";
import { locale } from "@monorepo/common";

export interface DiscountScopeSelectProps {
  type: DiscountTypeEnum;
  conditionCriteria: DiscountCriteriaEnum;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const DiscountScopeSelect: React.FC<DiscountScopeSelectProps> =
  React.memo(({ value, type, conditionCriteria, onChange }) => {
    const items = [
      {
        name: locale[DiscountScopeEnum.PRODUCT_FEATURES],
        value: DiscountScopeEnum.PRODUCT_FEATURES,
      },
    ];

    if (conditionCriteria !== DiscountCriteriaEnum.PRICE) {
      items.push({
        name: locale[DiscountScopeEnum.PRODUCTS],
        value: DiscountScopeEnum.PRODUCTS,
      });
    }

    if (type !== DiscountTypeEnum.FIXED_PRICE) {
      items.push({
        name: locale[DiscountScopeEnum.GLOBAL],
        value: DiscountScopeEnum.GLOBAL,
      });
    }

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
          {items.map(({ name, value }) => (
            <MenuItem key={value} value={value}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  });

DiscountScopeSelect.displayName = "DiscountScopeSelect";

export default DiscountScopeSelect;
