import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import CompletedOrderIcon from "~/assets/completed-order.svg";
import { useStyle } from "./index.style";

export interface OrderMadeSuccessfullyProps {
  orderNumber: number;
}

export const OrderMadeSuccessfully: React.FC<OrderMadeSuccessfullyProps> = ({
  orderNumber,
}) => {
  const { classes } = useStyle();
  return (
    <Stack alignItems="center" justifyContent="center" className={classes.root}>
      <CompletedOrderIcon className={classes.illustration} />
      <Stack spacing={1}>
        <Typography variant="h2" component="p" className={classes.text}>
          {`Заказ №${orderNumber} принят`}
        </Typography>
        <Typography component="p" variant="subtitle2" className={classes.text}>
          Спасибо за заказ!
        </Typography>
        <Typography component="p" variant="subtitle2" className={classes.text}>
          Примерное время доставки 45 минут.
        </Typography>
        <Link href="/" passHref>
          <Typography
            component="a"
            color="primary"
            sx={{ textAlign: "center" }}
          >
            Вернуться на главную страницу
          </Typography>
        </Link>
      </Stack>
    </Stack>
  );
};

export default OrderMadeSuccessfully;
