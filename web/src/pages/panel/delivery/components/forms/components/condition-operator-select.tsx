import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { DeliveryOperatorEnum } from "~/services/delivery.service";
import locale from "../../helpers/locale";

export interface DeliveryOperatorSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const DeliveryOperatorSelect: React.FC<DeliveryOperatorSelectProps> =
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
          <MenuItem value={DeliveryOperatorEnum.EQUAL}>
            {locale[DeliveryOperatorEnum.EQUAL]}
          </MenuItem>
          <MenuItem value={DeliveryOperatorEnum.LESS}>
            {locale[DeliveryOperatorEnum.LESS]}
          </MenuItem>
          <MenuItem value={DeliveryOperatorEnum.GREATER}>
            {locale[DeliveryOperatorEnum.GREATER]}
          </MenuItem>
          <MenuItem value={DeliveryOperatorEnum.BETWEEN}>
            {locale[DeliveryOperatorEnum.BETWEEN]}
          </MenuItem>
        </Select>
      </FormControl>
    );
  });

DeliveryOperatorSelect.displayName = "DeliveryOperatorSelect";

export default DeliveryOperatorSelect;
