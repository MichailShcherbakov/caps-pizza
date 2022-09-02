import { Button, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import ShoppingCartIcon from "~/assets/shopping-cart.svg";
import useShoppingCart from "~/hooks/use-shopping-cart";
import ShoppingCartDrawer from "../shopping-cart-drawer";
import { StyleProps, useStyle } from "./index.style";

export type CurrencySymbol = "₽";

export interface ShoppingCartButtonProps extends StyleProps {
  currencySymbol?: CurrencySymbol;
}

export const ShoppingCartButton: React.FC<ShoppingCartButtonProps> = React.memo(
  ({ currencySymbol = "₽", variant = "outlined" }) => {
    const { classes } = useStyle({ variant });
    const { totalCost, productsCount, isLoading } = useShoppingCart();
    const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);

    const onClickHandler = React.useCallback(() => {
      setOpenDrawer(true);
    }, []);

    const onDrawerCloseHandler = React.useCallback(() => {
      setOpenDrawer(false);
    }, []);

    if (isLoading) return null;

    if (variant === "outlined")
      return (
        <>
          <Button
            variant="outlined"
            color="primary"
            className={classes.root}
            startIcon={<ShoppingCartIcon className={classes.icon} />}
            onClick={onClickHandler}
          >
            {`${totalCost} ${currencySymbol}`}
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
          <IconButton className={classes.root} onClick={onClickHandler}>
            <ShoppingCartIcon className={classes.icon} />
            {productsCount ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                className={classes.badge}
              >
                <Typography variant="subtitle2">{productsCount}</Typography>
              </Stack>
            ) : undefined}
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
  }
);

ShoppingCartButton.displayName = "ShoppingCartButton";

export default ShoppingCartButton;
