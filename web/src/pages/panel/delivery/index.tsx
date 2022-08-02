import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import AdminPanelLayout from "~/layouts/admin-panel";
import DeliveryTableRow, { Delivery } from "./components/table-row";
import { DeliveryConditionCriteriaEnum } from "./components/table-row/components/table-condition-cell/components/criteria-select";
import { DeliveryConditionOperatorEnum } from "./components/table-row/components/table-condition-cell/components/operator-select";
import { DeliveryTypeEnum } from "./components/table-row/components/table-type-cell";

export const TEST_DELIVERIES: Delivery[] = [
  {
    uuid: "0",
    name: "Бесплатная доставка",
    type: DeliveryTypeEnum.IN_CASH,
    condition: {
      criteria: DeliveryConditionCriteriaEnum.PRICE,
      op: DeliveryConditionOperatorEnum.GREATER,
      value: [700],
    },
    value: 0,
  },
  {
    uuid: "1",
    name: "Платная доставка",
    type: DeliveryTypeEnum.IN_CASH,
    condition: {
      criteria: DeliveryConditionCriteriaEnum.PRICE,
      op: DeliveryConditionOperatorEnum.LESS,
      value: [700],
    },
    value: 100,
  },
];

export type DeliveryContextType = {
  deliveries: Delivery[];
  mutate: (newCtx: DeliveryContextType) => void;
};

export const DeliveryContext = React.createContext<DeliveryContextType>({
  deliveries: TEST_DELIVERIES,
  mutate: () => {},
});

export interface DeliveryPageProps {}

export const DeliveryPage: React.FC<DeliveryPageProps> = () => {
  const [ctx, setCtx] = React.useState<DeliveryContextType>({
    deliveries: TEST_DELIVERIES,
    mutate: () => {},
  });

  React.useEffect(() => {
    setCtx({
      deliveries: TEST_DELIVERIES,
      mutate: newCtx => setCtx(newCtx),
    });
  }, []);

  const onAddDeliveryHandler = () => {
    ctx.mutate({
      ...ctx,
      deliveries: [
        ...ctx.deliveries,
        {
          uuid: ctx.deliveries.length.toString(),
          name: "",
          type: "",
          condition: {
            criteria: "",
            op: "",
            value: [0, 0],
          },
          value: 0,
        },
      ],
    });
  };

  return (
    <AdminPanelLayout>
      <Stack>
        <DeliveryContext.Provider value={ctx}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название доставки</TableCell>
                  <TableCell>Условие предостваления</TableCell>
                  <TableCell>Вид расчета</TableCell>
                  <TableCell>Значение</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ctx.deliveries.map(d => (
                  <DeliveryTableRow
                    key={d.uuid}
                    deliveryUUID={d.uuid}
                    color="secondary"
                  />
                ))}
                <TableRow>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Button variant="contained" color="secondary">
                        Сохранить
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onAddDeliveryHandler}
                      >
                        Добавить
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DeliveryContext.Provider>
      </Stack>
    </AdminPanelLayout>
  );
};

export default DeliveryPage;
