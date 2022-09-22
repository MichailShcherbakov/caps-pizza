import React from "react";
import { Modifier } from "~/services/modifiers.service";
import { DataTableControlCell, DataTableHead } from "~/ui";
import DeleteModifierModal from "~/components/modals/modifiers-modals/delete-modifier.modal";
import UpdateModifierModal from "~/components/modals/modifiers-modals/update-modifier.modal";

export const useModifiersTableHead = () => {
  return React.useMemo<DataTableHead>(
    () => ({
      cols: [
        {
          name: "articleNumber",
          displayName: "Артикул",
          fullWidth: true,
        },
        {
          type: "image",
          name: "image",
          displayName: "Изображение",
          imageWidth: 80,
          imageHeight: 80,
        },
        {
          name: "name",
          displayName: "Название",
          primary: true,
        },
        {
          name: "desc",
          displayName: "Описание",
          fullWidth: true,
          collapsed: true,
        },
        {
          name: "price",
          displayName: "Цена",
          fullWidth: true,
          truncate: true,
        },
        {
          name: "category",
          displayName: "Категория",
          primary: true,
        },
        {
          name: "display",
          displayName: "Отображать",
          fullWidth: true,
          collapsed: true,
        },
        {
          name: "position",
          displayName: "Позиция",
          fullWidth: true,
          collapsed: true,
        },
        {
          name: "controls",
          type: "component",
          displayName: "",
          primary: true,
          component: modifier => (
            <DataTableControlCell
              UpdateModal={UpdateModifierModal}
              UpdateModalProps={{
                modifier: modifier as Modifier,
              }}
              DeleteModal={DeleteModifierModal}
              DeleteModalProps={{
                modifier: modifier as Modifier,
              }}
            />
          ),
        },
      ],
    }),
    []
  );
};

export default useModifiersTableHead;
