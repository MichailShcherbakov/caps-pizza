import ModalErrorCatcher from "~/components/error-catcher/modal";
import { useGetPromotionsQuery } from "~/services/promotions.service";
import { DataTable } from "~/ui";
import usePromotionsTableHead from "./helpers/data-table-head";

export interface PromotionsTableProps {}

export const PromotionsTable: React.FC<PromotionsTableProps> = () => {
  const head = usePromotionsTableHead();

  const { data: promotions = [], error, isLoading } = useGetPromotionsQuery();

  return (
    <>
      {error && <ModalErrorCatcher />}
      <DataTable
        loading={isLoading}
        emptyTitle="Список акций пуст"
        emptySubTitle="Чтобы создать акцию, нажмите на кнопку Добавить"
        head={head}
        rows={promotions.map(payment => ({
          cols: [
            {
              name: "name",
              value: payment.name,
            },
            {
              name: "image",
              value: payment.image_url,
            },
            {
              name: "display",
              value: payment.display ? "Да" : "Нет",
            },
            {
              name: "position",
              value: payment.display_position,
            },
            {
              name: "controls",
              value: payment,
            },
          ],
        }))}
      />
    </>
  );
};

export default PromotionsTable;
