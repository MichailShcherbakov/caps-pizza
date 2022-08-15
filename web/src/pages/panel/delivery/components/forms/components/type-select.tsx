import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { DeliveryTypeEnum } from "~/services/delivery.service";
import locale from "../../helpers/locale";

export interface DeliveryTypeSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const DeliveryTypeSelect: React.FC<DeliveryTypeSelectProps> = React.memo(
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
          <MenuItem value={DeliveryTypeEnum.PERCENT}>
            {locale[DeliveryTypeEnum.PERCENT]}
          </MenuItem>
          <MenuItem value={DeliveryTypeEnum.IN_CASH}>
            {locale[DeliveryTypeEnum.IN_CASH]}
          </MenuItem>
        </Select>
      </FormControl>
    );
  }
);

DeliveryTypeSelect.displayName = "DeliveryTypeSelect";

export default DeliveryTypeSelect;
