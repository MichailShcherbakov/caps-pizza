import { InputAdornment, TableCell, TableRow, TextField } from "@mui/material";
import React, { useContext } from "react";
import { Theme } from "~/ui/theme";
import { DeliveryContext, DeliveryContextType } from "../..";
import TableConditionCell from "./components/table-condition-cell";
import { DeliveryConditionCriteriaEnum } from "./components/table-condition-cell/components/criteria-select";
import { DeliveryConditionOperatorEnum } from "./components/table-condition-cell/components/operator-select";
import TableTypeCell, { DeliveryTypeEnum } from "./components/table-type-cell";

export interface Delivery {
  uuid: string;
  name: string;
  type: DeliveryTypeEnum | "";
  condition: {
    criteria: DeliveryConditionCriteriaEnum | "";
    op: DeliveryConditionOperatorEnum | "";
    value: number[];
  };
  value: number;
}

export interface DeliveryTableRowProps {
  deliveryUUID?: string;
  color?: Theme.Color;
}

export const DeliveryTableRow: React.FC<DeliveryTableRowProps> = ({
  deliveryUUID,
  color,
  ...props
}) => {
  const ctx = useContext<DeliveryContextType>(DeliveryContext);
  const delivery = ctx.deliveries.find(d => d.uuid === deliveryUUID);

  if (!delivery) {
    console.error("The delivery UUID " + deliveryUUID + " is not available");
    return null;
  }

  const adornment = () => {
    if (delivery.type === DeliveryTypeEnum.PERCENT) return "%";
    if (delivery.type === DeliveryTypeEnum.IN_CASH) return "₽";

    return "";
  };

  const onNameChange = (name: string) => {
    const newDelivery = {
      ...delivery,
      name,
    };

    ctx.mutate({
      ...ctx,
      deliveries: ctx.deliveries.map(d =>
        d.uuid === deliveryUUID ? newDelivery : d
      ),
    });
  };

  const onValueChange = (value: string) => {
    const newDelivery = {
      ...delivery,
      value: Number.parseFloat(value) ?? "",
    };

    ctx.mutate({
      ...ctx,
      deliveries: ctx.deliveries.map(d =>
        d.uuid === deliveryUUID ? newDelivery : d
      ),
    });
  };

  return (
    <TableRow>
      <TableCell>
        <TextField
          placeholder="Название"
          size="small"
          value={delivery.name}
          className="ui-w-full"
          color={color}
          onChange={e => onNameChange(e.target.value)}
        />
      </TableCell>
      <TableConditionCell deliveryUUID={deliveryUUID} color={color} />
      <TableTypeCell deliveryUUID={deliveryUUID} color={color} />
      <TableCell>
        <TextField
          type="number"
          size="small"
          placeholder="0"
          value={delivery.value}
          onChange={e => onValueChange(e.target.value)}
          color={color}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{adornment()}</InputAdornment>
            ),
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default DeliveryTableRow;
