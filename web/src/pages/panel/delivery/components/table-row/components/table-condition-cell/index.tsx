import { Stack, TableCell } from "@mui/material";
import React from "react";
import { DeliveryContext, DeliveryContextType } from "~/pages/panel/delivery";
import { Theme } from "~/ui/theme";
import CriteriaSelect, {
  DeliveryConditionCriteriaEnum,
} from "./components/criteria-select";
import NumberField from "./components/number-field";
import OperatorSelect, {
  DeliveryConditionOperatorEnum,
} from "./components/operator-select";

export interface TableConditionCellProps {
  deliveryUUID?: string;
  color?: Theme.Color;
}

export const TableConditionCell: React.FC<TableConditionCellProps> = ({
  deliveryUUID,
  color,
}) => {
  const ctx = React.useContext<DeliveryContextType>(DeliveryContext);
  const delivery = ctx.deliveries.find(d => d.uuid === deliveryUUID);

  if (!delivery) {
    console.error("The delivery UUID " + deliveryUUID + " is not available");
    return null;
  }

  const isCombinedValue =
    delivery.condition.op === DeliveryConditionOperatorEnum.BETWEEN;

  const onCriteriaChange = (criteria: DeliveryConditionCriteriaEnum) => {
    const newDelivery = {
      ...delivery,
      condition: {
        ...delivery.condition,
        criteria,
      },
    };

    ctx.mutate({
      ...ctx,
      deliveries: ctx.deliveries.map(d =>
        d.uuid === deliveryUUID ? newDelivery : d
      ),
    });
  };

  const onOperatorChange = (op: DeliveryConditionOperatorEnum) => {
    const newDelivery = {
      ...delivery,
      condition: {
        ...delivery.condition,
        op,
      },
    };

    ctx.mutate({
      ...ctx,
      deliveries: ctx.deliveries.map(d =>
        d.uuid === deliveryUUID ? newDelivery : d
      ),
    });
  };

  const onValueChange = (value: number[]) => {
    const newDelivery = {
      ...delivery,
      condition: {
        ...delivery.condition,
        value,
      },
    };

    ctx.mutate({
      ...ctx,
      deliveries: ctx.deliveries.map(d =>
        d.uuid === deliveryUUID ? newDelivery : d
      ),
    });
  };

  return (
    <TableCell>
      <Stack direction="row" spacing={1}>
        <CriteriaSelect
          criteria={delivery.condition.criteria}
          color={color}
          onChange={onCriteriaChange}
        />
        <OperatorSelect
          operator={delivery.condition.op}
          color={color}
          onChange={onOperatorChange}
        />
        <NumberField
          value={delivery.condition.value[0]}
          color={color}
          adornment={
            delivery.condition.criteria === DeliveryConditionCriteriaEnum.COUNT
              ? "шт"
              : "₽"
          }
          onChange={val => onValueChange([val, delivery.condition.value[1]])}
        />
        {isCombinedValue && (
          <NumberField
            value={delivery.condition.value[1]}
            color={color}
            adornment={
              delivery.condition.criteria ===
              DeliveryConditionCriteriaEnum.COUNT
                ? "шт"
                : "₽"
            }
            error={delivery.condition.value[0] > delivery.condition.value[1]}
            onChange={val => {
              onValueChange([delivery.condition.value[0], val]);
            }}
          />
        )}
      </Stack>
    </TableCell>
  );
};

export default TableConditionCell;
