import { Button, Typography } from "@mui/material";
import ShoppingCart from "~/assets/shopping-cart.svg";
import styles from "./index.module.scss";

export type CurrencySymbol = "$" | "₽";

export interface ShoppingCartButtonProps {
  price?: number;
  currencySymbol?: CurrencySymbol;
}

export const ShoppingCartButton: React.FC<ShoppingCartButtonProps> = ({
  price = 0,
  currencySymbol = "₽",
}) => {
  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<ShoppingCart className={styles["shopping-cart-btn__icon"]} />}
      className={styles["shopping-cart-btn"]}
    >
      <Typography variant="button">{`${price} ${currencySymbol}`}</Typography>
    </Button>
  );
};

export default ShoppingCartButton;
