import ModalErrorCatcher from "~/common/components/error-catcher/modal";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import { DataTable } from "~/ui";
import useModifiersTableHead from "../helpers/data-table-head";

export interface ModifiersTableProps {}

export const ModifiersTable: React.FC<ModifiersTableProps> = () => {
  const head = useModifiersTableHead();
  const { data: modifiers = [], error, isLoading } = useGetModifiersQuery();

  return (
    <>
      {error ? <ModalErrorCatcher error={error as APIError} /> : undefined}
      <DataTable
        emptyTitle="Список модификаторов товаров пуст"
        emptySubTitle="Чтобы создать модификатор, нажмите на кнопку Добавить"
        loading={isLoading}
        head={head}
        rows={modifiers.map(modifier => ({
          cols: [
            {
              name: "articleNumber",
              value: modifier.article_number,
            },
            {
              name: "name",
              value: modifier.name,
            },
            {
              name: "desc",
              value: modifier.desc ?? "Нет",
            },
            {
              name: "price",
              value: `${modifier.price} ₽`,
            },
            {
              name: "category",
              value: modifier.category?.name,
            },
            {
              name: "position",
              value: modifier.display_position ?? "Не указано",
            },
            {
              name: "controls",
              value: modifier,
            },
          ],
        }))}
      />
    </>
  );
};

export default ModifiersTable;
