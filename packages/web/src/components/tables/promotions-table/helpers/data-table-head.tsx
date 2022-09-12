import React from "react";
import { Promotion } from "~/services/promotions.service";
import { DataTableControlCell, DataTableHead } from "~/ui";
import DeletePromotionModal from "~/components/modals/promotions-modals/delete-promotion.modal";
import UpdatePromotionModal from "~/components/modals/promotions-modals/update-promotion.modal";

export const usePromotionsTableHead = () => {
  return React.useMemo<DataTableHead>(
    () => ({
      cols: [
        {
          name: "name",
          displayName: "Название",
          primary: true,
        },
        {
          type: "image",
          name: "image",
          displayName: "Изображение",
          imageWidth: 120,
          imageHeight: 120,
        },
        {
          name: "display",
          displayName: "Отображение",
          fullWidth: true,
        },
        {
          name: "position",
          displayName: "Позиция",
          fullWidth: true,
        },
        {
          name: "controls",
          type: "component",
          displayName: "",
          primary: true,
          component: promotion => (
            <DataTableControlCell
              UpdateModal={UpdatePromotionModal}
              UpdateModalProps={{
                promotion: promotion as Promotion,
              }}
              DeleteModal={DeletePromotionModal}
              DeleteModalProps={{
                promotion: promotion as Promotion,
              }}
            />
          ),
        },
      ],
    }),
    []
  );
};

export default usePromotionsTableHead;
