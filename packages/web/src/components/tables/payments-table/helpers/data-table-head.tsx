import React from "react";
import { Payment } from "~/services/payments.service";
import { DataTableControlCell, DataTableHead } from "~/ui";
import DeletePaymentModal from "~/components/modals/payments-modals/delete-payment.modal";
import UpdatePaymentModal from "~/components/modals/payments-modals/update-payment.modal";

export const usePaymentsTableHead = () => {
  return React.useMemo<DataTableHead>(
    () => ({
      cols: [
        {
          name: "code",
          displayName: "Код",
          primary: true,
        },
        {
          name: "name",
          displayName: "Название",
          primary: true,
        },
        {
          name: "controls",
          type: "component",
          displayName: "",
          primary: true,
          headColClassName: "ui-flex-center",
          component: (payment: Payment) => (
            <DataTableControlCell
              UpdateModal={UpdatePaymentModal}
              UpdateModalProps={{
                payment,
              }}
              DeleteModal={DeletePaymentModal}
              DeleteModalProps={{
                payment,
              }}
            />
          ),
        },
      ],
    }),
    []
  );
};

export default usePaymentsTableHead;
