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
          name: "name",
          displayName: "Название",
          primary: true,
        },
        {
          name: "desc",
          displayName: "Описание",
          fullWidth: true,
        },
        {
          name: "price",
          displayName: "Цена",
          fullWidth: true,
        },
        {
          name: "category",
          displayName: "Категория",
          primary: true,
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
          headColClassName: "ui-flex-center",
          component: (modifier: Modifier) => (
            <DataTableControlCell
              UpdateModal={UpdateModifierModal}
              UpdateModalProps={{
                modifier,
              }}
              DeleteModal={DeleteModifierModal}
              DeleteModalProps={{
                modifier,
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
