import ModalErrorCatcher from "~/components/error-catcher/modal";
import { useGetPaymentsQuery } from "~/services/payments.service";
import { DataTable } from "~/ui";
import usePaymentsTableHead from "./helpers/data-table-head";

export interface PaymentsTableProps {}

export const PaymentsTable: React.FC<PaymentsTableProps> = () => {
  const head = usePaymentsTableHead();

  const { data: payments = [], error, isLoading } = useGetPaymentsQuery();

  return (
    <>
      {error && <ModalErrorCatcher />}
      <DataTable
        loading={isLoading}
        emptyTitle="Список вариантов оплаты пуст"
        emptySubTitle="Чтобы создать вариант оплаты, нажмите на кнопку Добавить"
        head={head}
        rows={payments.map(payment => ({
          cols: [
            {
              name: "code",
              value: payment.code,
            },
            {
              name: "name",
              value: payment.name,
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

export default PaymentsTable;
