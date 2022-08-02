import {
  FormControl,
  FormControlProps,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

export enum DeliveryConditionCriteriaEnum {
  PRICE = "PRICE",
  COUNT = "COUNT",
}

export interface CriteriaSelectProps
  extends Omit<FormControlProps, "onChange"> {
  criteria: DeliveryConditionCriteriaEnum | "";
  onChange?: (criteria: DeliveryConditionCriteriaEnum) => void;
}

export const CriteriaSelect: React.FC<CriteriaSelectProps> = ({
  criteria,
  onChange,
}) => {
  const [crt, setCrt] = React.useState<DeliveryConditionCriteriaEnum | "">("");

  React.useEffect(() => {
    setCrt(criteria);
  }, [criteria]);

  const onSelectChangeHandler = (e: SelectChangeEvent<HTMLSelectElement>) => {
    const newCrt = e.target.value as DeliveryConditionCriteriaEnum;

    setCrt(newCrt);
    onChange && onChange(newCrt);
  };

  return (
    <FormControl color="secondary" fullWidth>
      <InputLabel size="small">Критерий</InputLabel>
      <Select
        value={crt as any}
        label="Критерий"
        size="small"
        onChange={onSelectChangeHandler}
      >
        <MenuItem value={DeliveryConditionCriteriaEnum.PRICE}>
          Сумма заказа
        </MenuItem>
        <MenuItem value={DeliveryConditionCriteriaEnum.COUNT}>
          Количество товаров в заказе
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default CriteriaSelect;
