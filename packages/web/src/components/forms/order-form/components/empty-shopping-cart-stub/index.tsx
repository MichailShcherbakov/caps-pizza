import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Link from "next/link";
import EmptyShoppingCartIllustration from "~/assets/empty-shopping-cart.svg";
import { useStyle } from "./index.style";

export interface EmptyShoppingCartStubProps {}

export const EmptyShoppingCartStub: React.FC<
  EmptyShoppingCartStubProps
> = () => {
  const { classes } = useStyle();
  return (
    <Stack alignItems="center" justifyContent="center" className={classes.root}>
      <EmptyShoppingCartIllustration className={classes.image} />
      <Stack alignItems="center" spacing={1}>
        <Typography variant="h2" component="p" className={classes.text}>
          Ваша корзина пуста
        </Typography>
        <Typography className={classes.text}>
          Выберите понравившийся товар и он здесь будет отражен.
        </Typography>
        <Link href="/" passHref>
          <Typography component="a" color="primary" className={classes.link}>
            Вернуться на главную страницу
          </Typography>
        </Link>
      </Stack>
    </Stack>
  );
};

export default EmptyShoppingCartStub;
