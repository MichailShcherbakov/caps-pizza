import ModalErrorCatcher from "~/common/components/error-catcher/modal";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import { DataTable } from "~/ui";
import useModifierCategoriesTableHead from "../helpers/data-table-head";

export interface ModifierCategoriesTableProps {}

export const ModifierCategoriesTable: React.FC<
  ModifierCategoriesTableProps
> = () => {
  const head = useModifierCategoriesTableHead();

  const {
    data: modifierCategories = [],
    error,
    isLoading,
  } = useGetModifierCategoriesQuery();

  return (
    <>
      {error && <ModalErrorCatcher />}
      <DataTable
        loading={isLoading}
        head={head}
        rows={modifierCategories.map(category => ({
          cols: [
            {
              name: "name",
              value: category.name,
            },
            {
              name: "position",
              value: category.display_position ?? "Не указано",
            },
            {
              name: "controls",
              value: category,
            },
          ],
        }))}
      />
    </>
  );
};

export default ModifierCategoriesTable;