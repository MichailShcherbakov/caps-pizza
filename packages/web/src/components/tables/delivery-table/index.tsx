import ModalErrorCatcher from "~/components/error-catcher/modal";
import {
  DeliveryCriteriaEnum,
  DeliveryTypeEnum,
  useGetDeliveriesQuery,
} from "~/services/delivery.service";
import { APIError } from "~/services/helpers/transform-response.helper";
import { DataTable } from "~/ui";
import { useDeliveryTableHead } from "./helpers/data-table-head";
import { locale } from "@monorepo/common";

export interface DeliveryTableProps {}

export const DeliveryTable: React.FC<DeliveryTableProps> = () => {
  const head = useDeliveryTableHead();
  const { data: deliveries = [], error, isLoading } = useGetDeliveriesQuery();

  return (
    <>
      <ModalErrorCatcher error={error as APIError} />
      <DataTable
        loading={isLoading}
        emptyTitle="Список доставок пуст"
        emptySubTitle="Чтобы создать доставку, нажмите на кнопку Добавить"
        head={head}
        rows={deliveries.map(delivery => ({
          cols: [
            {
              name: "name",
              value: delivery.name,
            },
            {
              name: "articleNumber",
              value: delivery.article_number,
            },
            {
              name: "type",
              value: locale[delivery.type],
            },
            {
              name: "condition",
              value: `${locale[delivery.condition.criteria]} ${locale[
                delivery.condition.op
              ].toLocaleLowerCase()} ${delivery.condition.value} ${
                delivery.condition.criteria === DeliveryCriteriaEnum.COUNT
                  ? "шт"
                  : "₽"
              } ${delivery.condition.value2 ?? ""} ${
                delivery.condition.value2
                  ? delivery.condition.criteria === DeliveryCriteriaEnum.COUNT
                    ? "шт"
                    : "₽"
                  : ""
              }`,
            },
            {
              name: "value",
              value: `${delivery.value} ${
                delivery.type === DeliveryTypeEnum.PERCENT ? "%" : "₽"
              }`,
            },
            {
              name: "controls",
              value: delivery,
            },
          ],
        }))}
      />
    </>
  );
};

export default DeliveryTable;
