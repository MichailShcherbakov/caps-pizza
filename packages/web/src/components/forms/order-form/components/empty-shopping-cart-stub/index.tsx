import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Link from "next/link";
import EmptyShoppingCartIllustration from "~/assets/empty-shopping-cart.svg";
import styles from "./index.module.scss";

export interface EmptyShoppingCartStubProps {}

export const EmptyShoppingCartStub: React.FC<
  EmptyShoppingCartStubProps
> = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      className={styles["empty-stub"]}
    >
      <EmptyShoppingCartIllustration className={styles["empty-stub__image"]} />
      <Stack alignItems="center" spacing={1}>
        <Typography
          variant="h2"
          component="p"
          className={styles["empty-stub__title"]}
        >
          Ваша корзина пуста
        </Typography>
        <Typography className={styles["empty-stub__subtitle"]}>
          Выберите понравившийся товар и он здесь будет отражен.
        </Typography>
        <Link href="/" passHref>
          <Typography component="a" className={styles["empty-stub__link"]}>
            Вернуться на главную страницу
          </Typography>
        </Link>
      </Stack>
    </Stack>
  );
};

export default EmptyShoppingCartStub;
