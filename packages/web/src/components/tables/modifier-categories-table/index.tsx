import { locale } from "@monorepo/common";
import ModalErrorCatcher from "~/components/error-catcher/modal";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import { DataTable } from "~/ui";
import useModifierCategoriesTableHead from "./helpers/data-table-head";

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
        emptyTitle="Список типов модификаторов пуст"
        emptySubTitle="Чтобы создать тип модификатора, нажмите на кнопку Добавить"
        head={head}
        rows={modifierCategories.map(category => ({
          cols: [
            {
              name: "name",
              value: category.name,
            },
            {
              name: "choice_option",
              value: locale[category.choice_option],
            },
            {
              name: "display",
              value: category.display ? "Да" : "Нет",
            },
            {
              name: "display_name",
              value: category.display_name ?? "Без названия",
            },
            {
              name: "display_variant",
              value: locale[category.display_variant],
            },
            {
              name: "display_position",
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
