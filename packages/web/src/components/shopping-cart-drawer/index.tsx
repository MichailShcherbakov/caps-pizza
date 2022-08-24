import React from "react";
import { Drawer, DrawerProps, Stack } from "@mui/material";
import ProductCardList from "./components/product-card-list";
import ProductCardListFooter from "./components/product-card-list-footer";
import ProductCardListHeader from "./components/product-card-list-header";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

export interface ShoppingCartDrawerProps extends Omit<DrawerProps, "onClose"> {
  onClose?: () => void;
}

export const ShoppingCartDrawer: React.FC<ShoppingCartDrawerProps> = props => {
  const router = useRouter();

  return (
    <Drawer {...props}>
      <Stack
        justifyContent="space-between"
        className={[
          styles["shopping-cart-drawer"],
          props.anchor === "bottom"
            ? styles["shopping-cart-drawer--bottom"]
            : "",
        ].join(" ")}
      >
        <ProductCardListHeader anchor={props.anchor} onExit={props.onClose} />
        <ProductCardList />
        <ProductCardListFooter onOrder={() => router.push("/order")} />
      </Stack>
    </Drawer>
  );
};

export default ShoppingCartDrawer;
