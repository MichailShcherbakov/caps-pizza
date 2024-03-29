import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { DiscountTypeEnum } from "~/services/discounts.service";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  locale,
} from "@monorepo/common";

export interface DiscountTypeSelectProps {
  discountStrategies: {
    condition: {
      criteria: DiscountCriteriaEnum;
      op: DiscountOperatorEnum;
    };
  }[];
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const DiscountTypeSelect: React.FC<DiscountTypeSelectProps> = React.memo(
  ({ discountStrategies, value, onChange }) => {
    const items = [
      {
        name: locale[DiscountTypeEnum.PERCENT],
        value: DiscountTypeEnum.PERCENT,
      },
      {
        name: locale[DiscountTypeEnum.IN_CASH],
        value: DiscountTypeEnum.IN_CASH,
      },
    ];

    if (
      !discountStrategies.some(
        s =>
          s.condition.criteria !== DiscountCriteriaEnum.COUNT &&
          s.condition.op !== DiscountOperatorEnum.EQUAL
      )
    ) {
      items.push({
        name: locale[DiscountTypeEnum.FIXED_PRICE],
        value: DiscountTypeEnum.FIXED_PRICE,
      });
    }

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
          {items.map(({ name, value }) => (
            <MenuItem key={value} value={value}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

DiscountTypeSelect.displayName = "DiscountTypeSelect";

export default DiscountTypeSelect;
