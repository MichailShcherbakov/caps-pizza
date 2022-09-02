import React from "react";
import { Drawer, DrawerProps } from "@mui/material";
import ProductCardList from "./components/product-card-list";
import ProductCardListFooter from "./components/product-card-list-footer";
import ProductCardListHeader from "./components/product-card-list-header";
import { useRouter } from "next/router";
import { useStyle } from "./index.style";

export interface ShoppingCartDrawerProps extends Omit<DrawerProps, "onClose"> {
  onClose?: () => void;
}

export const ShoppingCartDrawer: React.FC<ShoppingCartDrawerProps> = props => {
  const { classes } = useStyle({ anchor: props.anchor });
  const router = useRouter();

  return (
    <Drawer
      {...props}
      PaperProps={{
        className: classes.root,
      }}
    >
      <ProductCardListHeader anchor={props.anchor} onExit={props.onClose} />
      <ProductCardList />
      <ProductCardListFooter onOrder={() => router.push("/order")} />
    </Drawer>
  );
};

export default ShoppingCartDrawer;
