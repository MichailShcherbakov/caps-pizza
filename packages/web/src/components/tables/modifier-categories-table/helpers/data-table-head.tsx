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
          name: "choice_option",
          displayName: "Вариант выбора",
          fullWidth: true,
        },
        {
          name: "display",
          displayName: "Отображение",
          fullWidth: true,
          collapsed: true,
        },
        {
          name: "display_name",
          displayName: "Отображаемое название",
          fullWidth: true,
        },
        {
          name: "display_variant",
          displayName: "Вариант отображения",
          fullWidth: true,
        },
        {
          name: "display_position",
          displayName: "Позиция",
          fullWidth: true,
          collapsed: true,
        },
        {
          name: "controls",
          type: "component",
          displayName: "",
          primary: true,
          component: category => (
            <DataTableControlCell
              UpdateModal={UpdateModifierCategoryModal}
              UpdateModalProps={{
                category: category as ModifierCategory,
              }}
              DeleteModal={DeleteModifierCategoryModal}
              DeleteModalProps={{
                category: category as ModifierCategory,
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
