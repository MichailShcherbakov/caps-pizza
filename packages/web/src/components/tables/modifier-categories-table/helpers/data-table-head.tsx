import React from "react";
import { ModifierCategory } from "~/services/modifier-categories.service";
import { DataTableControlCell, DataTableHead } from "~/ui";
import DeleteModifierCategoryModal from "~/components/modals/modifier-categories-modals/delete-modifier-category.modal";
import UpdateModifierCategoryModal from "~/components/modals/modifier-categories-modals/update-modifier-category.modal";

export const useModifierCategoriesTableHead = () => {
  return React.useMemo<DataTableHead>(
    () => ({
      cols: [
        {
          name: "name",
          displayName: "Название",
          primary: true,
        },
        {
          name: "position",
          displayName: "Позиция",
          primary: true,
        },
        {
          name: "controls",
          type: "component",
          displayName: "",
          primary: true,
          headColClassName: "ui-flex-center",
          component: (category: ModifierCategory) => (
            <DataTableControlCell
              UpdateModal={UpdateModifierCategoryModal}
              UpdateModalProps={{
                category,
              }}
              DeleteModal={DeleteModifierCategoryModal}
              DeleteModalProps={{
                category,
              }}
            />
          ),
        },
      ],
    }),
    []
  );
};

export default useModifierCategoriesTableHead;
