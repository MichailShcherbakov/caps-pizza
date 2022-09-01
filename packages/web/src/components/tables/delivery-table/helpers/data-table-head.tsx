import React from "react";
import { Delivery } from "~/services/delivery.service";
import { DataTableControlCell, DataTableHead } from "~/ui";
import DeleteDeliveryModal from "~/components/modals/delivery-modals/deletet-delivery.modal";
import UpdateDeliveryModal from "~/components/modals/delivery-modals/update-delivery.modal";

export const useDeliveryTableHead = () => {
  return React.useMemo<DataTableHead>(
    () => ({
      cols: [
        { name: "name", displayName: "Название", primary: true },
        { name: "articleNumber", displayName: "Артикул", fullWidth: true },
        { name: "type", displayName: "Тип", fullWidth: true },
        { name: "condition", displayName: "Условие", fullWidth: true },
        { name: "value", displayName: "Значение", primary: true },
        {
          name: "controls",
          type: "component",
          displayName: "",
          primary: true,
          headColClassName: "ui-flex-center",
          component: delivery => (
            <DataTableControlCell
              UpdateModal={UpdateDeliveryModal}
              UpdateModalProps={{
                delivery: delivery as Delivery,
              }}
              DeleteModal={DeleteDeliveryModal}
              DeleteModalProps={{
                delivery: delivery as Delivery,
              }}
            />
          ),
        },
      ],
    }),
    []
  );
};

export default useDeliveryTableHead;
