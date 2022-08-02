import {
  FormControl,
  FormControlProps,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

export enum DeliveryConditionOperatorEnum {
  LESS = "LESS",
  GREATER = "GREATER",
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  BETWEEN = "BETWEEN",
}

export interface OperatorSelectProps
  extends Omit<FormControlProps, "onChange"> {
  operator: DeliveryConditionOperatorEnum | "";
  onChange?: (operator: DeliveryConditionOperatorEnum) => void;
}

export const OperatorSelect: React.FC<OperatorSelectProps> = ({
  operator,
  onChange,
  ...props
}) => {
  const [op, setOp] = React.useState<DeliveryConditionOperatorEnum | "">("");

  React.useEffect(() => {
    setOp(operator);
  }, [operator]);

  const onSelectChangeHandler = (e: SelectChangeEvent<HTMLSelectElement>) => {
    const newOp = e.target.value as DeliveryConditionOperatorEnum;

    setOp(newOp);
    onChange && onChange(newOp);
  };

  return (
    <FormControl {...props} fullWidth>
      <InputLabel size="small">Оператор</InputLabel>
      <Select
        value={op as any}
        label="Оператор"
        size="small"
        onChange={onSelectChangeHandler}
      >
        <MenuItem value={DeliveryConditionOperatorEnum.GREATER}>
          Больше
        </MenuItem>
        <MenuItem value={DeliveryConditionOperatorEnum.LESS}>Меньше</MenuItem>
        <MenuItem value={DeliveryConditionOperatorEnum.EQUAL}>Равно</MenuItem>
        <MenuItem value={DeliveryConditionOperatorEnum.NOT_EQUAL}>
          Неравно
        </MenuItem>
        <MenuItem value={DeliveryConditionOperatorEnum.BETWEEN}>Между</MenuItem>
      </Select>
    </FormControl>
  );
};

export default OperatorSelect;
