import {
  FormControl,
  FormControlProps,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TableCell,
} from "@mui/material";
import React from "react";
import { DeliveryContext, DeliveryContextType } from "~/pages/panel/delivery";

export enum DeliveryTypeEnum {
  PERCENT = "PERCENT",
  IN_CASH = "IN_CASH",
}

export interface TableTypeCellProps extends FormControlProps {
  deliveryUUID?: string;
}

export const TableTypeCell: React.FC<TableTypeCellProps> = ({
  deliveryUUID,
  ...props
}) => {
  const ctx = React.useContext<DeliveryContextType>(DeliveryContext);
  const delivery = ctx.deliveries.find(d => d.uuid === deliveryUUID);

  if (!delivery) {
    console.error("The delivery UUID " + deliveryUUID + " is not available");
    return null;
  }

  const onSelectChangeHandler = (e: SelectChangeEvent<DeliveryTypeEnum>) => {
    const newType = e.target.value as DeliveryTypeEnum;

    ctx.mutate({
      ...ctx,
      deliveries: ctx.deliveries.map(d =>
        d.uuid === deliveryUUID ? { ...d, type: newType } : d
      ),
    });
  };

  return (
    <TableCell>
      <FormControl {...props} fullWidth>
        <InputLabel size="small">Расчет</InputLabel>
        <Select
          value={delivery?.type}
          label="Расчет"
          size="small"
          onChange={onSelectChangeHandler}
        >
          <MenuItem value={DeliveryTypeEnum.IN_CASH}>
            Фиксированная сумма
          </MenuItem>
          <MenuItem value={DeliveryTypeEnum.PERCENT}>
            Процент от суммы заказа
          </MenuItem>
        </Select>
      </FormControl>
    </TableCell>
  );
};

export default TableTypeCell;
