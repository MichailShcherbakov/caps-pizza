import React from "react";
import { Discount } from "~/services/discounts.service";
import { DataTableControlCell, DataTableHead } from "~/ui";
import DeleteDiscountModal from "~/components/modals/discounts-modals/delete-discount.modal";
import UpdateDiscountModal from "~/components/modals/discounts-modals/update-discount.modal";

export const useDiscountsTableHead = () => {
  return React.useMemo<DataTableHead>(
    () => ({
      cols: [
        {
          name: "name",
          displayName: "Название",
          primary: true,
        },
        {
          name: "type",
          displayName: "Тип",
          fullWidth: true,
        },
        {
          name: "value",
          displayName: "Значение",
          primary: true,
        },
        {
          name: "controls",
          type: "component",
          displayName: "",
          primary: true,
          headColClassName: "ui-flex-center",
          component: (discount: Discount) => (
            <DataTableControlCell
              UpdateModal={UpdateDiscountModal}
              UpdateModalProps={{
                discount,
              }}
              DeleteModal={DeleteDiscountModal}
              DeleteModalProps={{
                discount,
              }}
            />
          ),
        },
      ],
    }),
    []
  );
};
