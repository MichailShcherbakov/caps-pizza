import {
  FormControl,
  FormControlProps,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import styles from "./index.module.scss";

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
        <MenuItem
          value={DeliveryConditionOperatorEnum.GREATER}
          className={styles["operator-menu-item"]}
        >
          Больше
        </MenuItem>
        <MenuItem
          value={DeliveryConditionOperatorEnum.LESS}
          className={styles["operator-menu-item"]}
        >
          Меньше
        </MenuItem>
        <MenuItem
          value={DeliveryConditionOperatorEnum.EQUAL}
          className={styles["operator-menu-item"]}
        >
          Равно
        </MenuItem>
        <MenuItem
          value={DeliveryConditionOperatorEnum.NOT_EQUAL}
          className={styles["operator-menu-item"]}
        >
          Неравно
        </MenuItem>
        <MenuItem
          value={DeliveryConditionOperatorEnum.BETWEEN}
          className={styles["operator-menu-item"]}
        >
          Между
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default OperatorSelect;
