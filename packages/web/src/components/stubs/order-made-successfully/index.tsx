import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import CompletedOrderIcon from "~/assets/completed-order.svg";
import styles from "./index.module.scss";

export interface OrderMadeSuccessfullyProps {
  orderNumber: number;
}

export const OrderMadeSuccessfully: React.FC<OrderMadeSuccessfullyProps> = ({
  orderNumber,
}) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      className={styles["completed-order-stub"]}
    >
      <CompletedOrderIcon className={styles["completed-order-stub__image"]} />
      <Stack spacing={1}>
        <Typography
          variant="h2"
          component="p"
          className={styles["completed-order-stub__title"]}
        >
          {`Заказ №${orderNumber} принят`}
        </Typography>
        <Typography
          component="p"
          variant="subtitle2"
          className={styles["completed-order-stub__subtitle"]}
        >
          Спасибо за заказ!
        </Typography>
        <Typography
          component="p"
          variant="subtitle2"
          className={styles["completed-order-stub__subtitle"]}
        >
          Примерное время доставки 45 минут.
        </Typography>
        <Link href="/" passHref>
          <Typography
            component="a"
            className={styles["completed-order-stub__link"]}
          >
            Вернуться на главную страницу
          </Typography>
        </Link>
      </Stack>
    </Stack>
  );
};

export default OrderMadeSuccessfully;
