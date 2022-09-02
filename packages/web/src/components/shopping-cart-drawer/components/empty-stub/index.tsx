import { Stack, Typography } from "@mui/material";
import EmptyShoppingCartIllustration from "~/assets/empty-shopping-cart.svg";
import { useStyle } from "./index.style";

export interface EmptyStubProps {}

export const EmptyStub: React.FC<EmptyStubProps> = () => {
  const { classes } = useStyle();
  return (
    <Stack alignItems="center">
      <EmptyShoppingCartIllustration className={classes.image} />
      <Stack alignItems="center" spacing={1}>
        <Typography variant="h2" component="p" className={classes.text}>
          Ваша корзина пуста
        </Typography>
        <Typography className={classes.text}>
          Выберите понравившийся товар и он здесь будет отражен.
        </Typography>
      </Stack>
    </Stack>
  );
};

export default EmptyStub;
