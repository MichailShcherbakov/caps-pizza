import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { DeliveryCriteriaEnum } from "~/services/delivery.service";
import locale from "../../helpers/locale";

export interface DeliveryCriteriaSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const DeliveryCriteriaSelect: React.FC<DeliveryCriteriaSelectProps> =
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
          <MenuItem value={DeliveryCriteriaEnum.COUNT}>
            {locale[DeliveryCriteriaEnum.COUNT]}
          </MenuItem>
          <MenuItem value={DeliveryCriteriaEnum.PRICE}>
            {locale[DeliveryCriteriaEnum.PRICE]}
          </MenuItem>
        </Select>
      </FormControl>
    );
  });

DeliveryCriteriaSelect.displayName = "DeliveryCriteriaSelect";

export default DeliveryCriteriaSelect;
