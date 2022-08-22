import { Stack, Typography } from "@mui/material";
import EmptyShoppingCartIllustration from "~/assets/empty-shopping-cart.svg";
import styles from "./index.module.scss";

export interface EmptyStubProps {}

export const EmptyStub: React.FC<EmptyStubProps> = () => {
  return (
    <Stack alignItems="center" className={styles["empty-stub"]}>
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
      </Stack>
    </Stack>
  );
};

export default EmptyStub;
