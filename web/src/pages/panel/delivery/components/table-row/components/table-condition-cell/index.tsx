import { Stack, TableCell } from "@mui/material";
import React from "react";
import { DeliveryContext, DeliveryContextType } from "~/pages/panel/delivery";
import CriteriaSelect, {
  DeliveryConditionCriteriaEnum,
} from "./components/criteria-select";
import NumberField from "./components/number-field";
import OperatorSelect, {
  DeliveryConditionOperatorEnum,
} from "./components/operator-select";

export interface TableConditionCellProps {
  deliveryUUID?: string;
}

export const TableConditionCell: React.FC<TableConditionCellProps> = ({
  deliveryUUID,
}) => {
  const ctx = React.useContext<DeliveryContextType>(DeliveryContext);
  const delivery = ctx.deliveries.find((d) => d.uuid === deliveryUUID);

  if (!delivery) {
    console.error("The delivery UUID " + deliveryUUID + " is not available");
    return null;
  }

  const isCombinedValue =
    delivery.condition.op === DeliveryConditionOperatorEnum.BETWEEN;

  console.log(delivery.condition.op);

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
      deliveries: ctx.deliveries.map((d) =>
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
      deliveries: ctx.deliveries.map((d) =>
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
      deliveries: ctx.deliveries.map((d) =>
        d.uuid === deliveryUUID ? newDelivery : d
      ),
    });
  };

  return (
    <TableCell>
      <Stack direction="row" spacing={1}>
        <CriteriaSelect
          criteria={delivery.condition.criteria}
          onChange={onCriteriaChange}
        />
        <OperatorSelect
          operator={delivery.condition.op}
          onChange={onOperatorChange}
        />
        <NumberField
          value={delivery.condition.value[0]}
          onChange={(val) => onValueChange([val, delivery.condition.value[1]])}
          adornment={
            delivery.condition.criteria === DeliveryConditionCriteriaEnum.COUNT
              ? "шт"
              : "₽"
          }
        />
        {isCombinedValue && (
          <NumberField
            value={delivery.condition.value[1]}
            onChange={(val) => {
              onValueChange([delivery.condition.value[0], val]);
            }}
            adornment={
              delivery.condition.criteria ===
              DeliveryConditionCriteriaEnum.COUNT
                ? "шт"
                : "₽"
            }
            error={delivery.condition.value[0] > delivery.condition.value[1]}
          />
        )}
      </Stack>
    </TableCell>
  );
};

export default TableConditionCell;
