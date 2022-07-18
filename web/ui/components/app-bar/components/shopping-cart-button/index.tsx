import { Button } from "@mui/material";
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
      startIcon={<ShoppingCart className />}
      className={styles["shopping-cart-btn"]}
    >
      {`${price} ${currencySymbol}`}
    </Button>
  );
};

export default ShoppingCartButton;
