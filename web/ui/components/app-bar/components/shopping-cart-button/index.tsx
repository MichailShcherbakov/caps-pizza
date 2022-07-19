import { Button, ButtonProps, Typography } from "@mui/material";
import ShoppingCart from "~/assets/shopping-cart.svg";
import styles from "./index.module.scss";

export type CurrencySymbol = "$" | "₽";

export interface ShoppingCartButtonProps extends ButtonProps {
  price?: number;
  currencySymbol?: CurrencySymbol;
}

export const ShoppingCartButton: React.FC<ShoppingCartButtonProps> = ({
  price = 0,
  currencySymbol = "₽",
  ...props
}) => {
  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<ShoppingCart className={styles["shopping-cart-btn__icon"]} />}
      className={styles["shopping-cart-btn"]}
      {...props}
    >
      <Typography variant="button">{`${price} ${currencySymbol}`}</Typography>
    </Button>
  );
};

export default ShoppingCartButton;
