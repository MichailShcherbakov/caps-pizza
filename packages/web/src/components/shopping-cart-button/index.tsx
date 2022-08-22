import { Button, IconButton, Stack, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";
import ShoppingCartIcon from "~/assets/shopping-cart.svg";
import useShoppingCart from "~/hooks/use-shopping-cart";
import styles from "./index.module.scss";

export const ShoppingCartDrawer = dynamic(
  () => import("../shopping-cart-drawer"),
  {
    suspense: true,
    ssr: false,
  }
);

export type CurrencySymbol = "₽";

export type ShoppingCartButtonVariants = "outlined" | "filled & rounded";

export interface ShoppingCartButtonProps {
  currencySymbol?: CurrencySymbol;
  variant?: ShoppingCartButtonVariants;
}

export const ShoppingCartButton: React.FC<ShoppingCartButtonProps> = ({
  currencySymbol = "₽",
  variant = "outlined",
  ...props
}) => {
  const { totalCost, products } = useShoppingCart();
  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);

  const onClickHandler = React.useCallback(() => {
    setOpenDrawer(true);
  }, []);

  const onDrawerCloseHandler = React.useCallback(() => {
    setOpenDrawer(false);
  }, []);

  if (variant === "outlined")
    return (
      <>
        <Button
          {...props}
          variant="outlined"
          color="primary"
          startIcon={
            <ShoppingCartIcon className={styles["shopping-cart-btn__icon"]} />
          }
          className={styles["shopping-cart-btn"]}
          onClick={onClickHandler}
        >
          <Typography variant="button">{`${totalCost} ${currencySymbol}`}</Typography>
        </Button>
        <ShoppingCartDrawer
          anchor="right"
          open={openDrawer}
          onClose={onDrawerCloseHandler}
        />
      </>
    );

  if (variant === "filled & rounded") {
    return (
      <>
        <IconButton
          {...props}
          className={[
            styles["shopping-cart-btn"],
            styles["shopping-cart-btn__levitated"],
          ].join(" ")}
          onClick={onClickHandler}
        >
          <ShoppingCartIcon className={styles["shopping-cart-btn__icon"]} />
          <Stack
            alignItems="center"
            justifyContent="center"
            className={styles["shopping-cart-btn__badge"]}
          >
            {products.length}
          </Stack>
        </IconButton>
        <ShoppingCartDrawer
          anchor="bottom"
          open={openDrawer}
          onClose={onDrawerCloseHandler}
        />
      </>
    );
  }

  return null;
};

export default ShoppingCartButton;
