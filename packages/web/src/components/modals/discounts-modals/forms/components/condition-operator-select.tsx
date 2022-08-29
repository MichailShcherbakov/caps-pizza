import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from "@mui/material";
import React from "react";
import {
  DiscountOperatorEnum,
  DiscountTypeEnum,
} from "~/services/discounts.service";
import { locale } from "@monorepo/common";

export interface DiscountOperatorSelectProps extends SelectProps {
  /*   type: DiscountTypeEnum; */
  /*  value: string;
  onChange: (event: SelectChangeEvent) => void; */
}

export const DiscountOperatorSelect: React.FC<DiscountOperatorSelectProps> =
  React.memo(({ value, type, onChange, ...props }) => {
    const items = [
      {
        name: locale[DiscountOperatorEnum.EQUAL],
        value: DiscountOperatorEnum.EQUAL,
      },
    ];

    if (type !== DiscountTypeEnum.FIXED_PRICE) {
      items.push(
        ...[
          {
            name: locale[DiscountOperatorEnum.LESS],
            value: DiscountOperatorEnum.LESS,
          },
          {
            name: locale[DiscountOperatorEnum.GREATER],
            value: DiscountOperatorEnum.GREATER,
          },
          {
            name: locale[DiscountOperatorEnum.BETWEEN],
            value: DiscountOperatorEnum.BETWEEN,
          },
        ]
      );
    }

    return (
      <FormControl color="secondary" size="small" fullWidth>
        <InputLabel size="small">Оператор</InputLabel>
        <Select
          {...props}
          value={value}
          label="Оператор"
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

DiscountOperatorSelect.displayName = "DiscountOperatorSelect";

export default DiscountOperatorSelect;
