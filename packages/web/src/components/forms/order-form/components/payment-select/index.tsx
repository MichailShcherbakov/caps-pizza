import { IPayment } from "@monorepo/common";
import { Select, SelectOption, SelectProps } from "~/ui";
import React from "react";

export interface PaymentSelectProps
  extends Omit<SelectProps, "label" | "options"> {
  payments: IPayment[];
}

export const PaymentSelect: React.FC<PaymentSelectProps> = React.memo(
  ({ payments, value, onChange, ...props }) => {
    const options: SelectOption[] = React.useMemo(
      () =>
        payments.map(payment => ({ name: payment.name, value: payment.uuid })),
      [payments]
    );

    return (
      <Select
        {...props}
        label="Вариант оплаты"
        options={options}
        value={value}
        onChange={onChange}
      />
    );
  }
);

PaymentSelect.displayName = "PaymentSelect";

export default PaymentSelect;
