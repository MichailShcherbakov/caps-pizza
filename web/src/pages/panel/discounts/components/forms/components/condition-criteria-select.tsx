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
import locale from "../../helpers/locale";

export interface DiscountCriteriaSelectProps {
  type: DiscountTypeEnum;
  scope: DiscountScopeEnum;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const DiscountCriteriaSelect: React.FC<DiscountCriteriaSelectProps> =
  React.memo(({ value, type, scope, onChange }) => {
    const items = [
      {
        name: locale[DiscountCriteriaEnum.COUNT],
        value: DiscountCriteriaEnum.COUNT,
      },
    ];

    if (
      type !== DiscountTypeEnum.FIXED_PRICE &&
      scope !== DiscountScopeEnum.PRODUCTS
    ) {
      items.push({
        name: locale[DiscountCriteriaEnum.PRICE],
        value: DiscountCriteriaEnum.PRICE,
      });
    }

    return (
      <FormControl color="secondary" size="small" fullWidth>
        <InputLabel size="small">Критерий</InputLabel>
        <Select
          id="conditionCriteria"
          name="conditionCriteria"
          value={value}
          label="Критерий"
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

DiscountCriteriaSelect.displayName = "DiscountCriteriaSelect";

export default DiscountCriteriaSelect;
