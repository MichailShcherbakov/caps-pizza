import { Button, IconButton, Stack, Typography } from "@mui/material";
import ShoppingCart from "~/assets/shopping-cart.svg";
import styles from "./index.module.scss";

export type CurrencySymbol = "$" | "₽";

export type ShoppingCartButtonVariants = "outlined" | "filled & rounded";

export interface ShoppingCartButtonProps {
  price?: number;
  count?: number;
  currencySymbol?: CurrencySymbol;
  variant?: ShoppingCartButtonVariants;
}

export const ShoppingCartButton: React.FC<ShoppingCartButtonProps> = ({
  price = 0,
  count = 0,
  currencySymbol = "₽",
  variant = "outlined",
  ...props
}) => {
  if (variant === "outlined")
    return (
      <Button
        variant="outlined"
        color="primary"
        startIcon={
          <ShoppingCart className={styles["shopping-cart-btn__icon"]} />
        }
        className={styles["shopping-cart-btn"]}
        {...props}
      >
        <Typography variant="button">{`${price} ${currencySymbol}`}</Typography>
      </Button>
    );

  if (variant === "filled & rounded") {
    return (
      <IconButton
        className={[
          styles["shopping-cart-btn"],
          styles["shopping-cart-btn__levitated"],
        ].join(" ")}
        {...props}
      >
        <ShoppingCart className={styles["shopping-cart-btn__icon"]} />
        <Stack
          alignItems="center"
          justifyContent="center"
          className={styles["shopping-cart-btn__badge"]}
        >
          {count}
        </Stack>
      </IconButton>
    );
  }

  return null;
};

export default ShoppingCartButton;
