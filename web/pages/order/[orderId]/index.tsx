import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import MainLayout from "~/layouts/main";
import CompletedOrderIcon from "~/assets/completed-order.svg";
import Title from "~/ui/components/title";
import styles from "./index.module.scss";

export interface CompletedOrderPageProps {}

export const CompletedOrderPage: React.FC<CompletedOrderPageProps> = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <Stack
        alignItems="center"
        justifyContent="center"
        className={styles["completed-order"]}
      >
        <Stack alignItems="center" className={styles["completed-order__box"]}>
          <CompletedOrderIcon className={styles["completed-order__image"]} />
          <Typography variant="h2" component="p">
            {`Заказ №${router.query.orderId} принят`}
          </Typography>
          <Typography variant="subtitle2" component="p">
            Спасибо за заказ!
          </Typography>
          <Typography variant="subtitle2" component="p">
            Примерное время доставки 45 минут.
          </Typography>
        </Stack>
      </Stack>
    </MainLayout>
  );
};

export default CompletedOrderPage;
