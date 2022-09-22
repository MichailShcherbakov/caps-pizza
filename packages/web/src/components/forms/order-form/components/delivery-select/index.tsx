import { IDelivery } from "@monorepo/common";
import { Select, SelectOption, SelectProps } from "~/ui";
import React from "react";

export interface DeliverySelectProps
  extends Omit<SelectProps, "label" | "options"> {
  deliveries: IDelivery[];
}

export const DeliverySelect: React.FC<DeliverySelectProps> = React.memo(
  ({ deliveries, value, onChange, ...props }) => {
    const options: SelectOption[] = React.useMemo(
      () =>
        deliveries.map(delivery => ({
          name: `${delivery.name} (${delivery.value}р.)`,
          value: delivery.uuid,
        })),
      [deliveries]
    );

    return (
      <Select
        {...props}
        label="Вариант доставки"
        options={options}
        value={value}
        onChange={onChange}
      />
    );
  }
);

DeliverySelect.displayName = "DeliverySelect";

export default DeliverySelect;
