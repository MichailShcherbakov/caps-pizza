import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { DiscountCriteriaEnum } from "~/services/discounts.service";
import locale from "../../helpers/locale";

export interface DiscountCriteriaSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const DiscountCriteriaSelect: React.FC<DiscountCriteriaSelectProps> =
  React.memo(({ value, onChange }) => {
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
          <MenuItem value={DiscountCriteriaEnum.COUNT}>
            {locale[DiscountCriteriaEnum.COUNT]}
          </MenuItem>
          <MenuItem value={DiscountCriteriaEnum.PRICE}>
            {locale[DiscountCriteriaEnum.PRICE]}
          </MenuItem>
        </Select>
      </FormControl>
    );
  });

DiscountCriteriaSelect.displayName = "DiscountCriteriaSelect";

export default DiscountCriteriaSelect;
