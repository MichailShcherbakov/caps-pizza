import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import React from "react";
import { DiscountCriteriaEnum } from "~/services/discounts.service";
import { locale } from "@monorepo/common";

export interface DiscountCriteriaSelectProps extends SelectProps {}

export const DiscountCriteriaSelect: React.FC<DiscountCriteriaSelectProps> =
  React.memo(({ value, onChange, ...props }) => {
    const items = [
      {
        name: locale[DiscountCriteriaEnum.COUNT],
        value: DiscountCriteriaEnum.COUNT,
      },
      {
        name: locale[DiscountCriteriaEnum.PRICE],
        value: DiscountCriteriaEnum.PRICE,
      },
    ];

    return (
      <FormControl color="secondary" size="small" fullWidth>
        <InputLabel size="small">Критерий</InputLabel>
        <Select
          {...props}
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
