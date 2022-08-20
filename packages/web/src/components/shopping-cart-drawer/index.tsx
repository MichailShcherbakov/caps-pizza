import React from "react";
import { Drawer, DrawerProps } from "@mui/material";
import Popover from "./components/popover";

export interface ShoppingCartDrawerProps extends DrawerProps {}

export const ShoppingCartDrawer: React.FC<ShoppingCartDrawerProps> = (
  props
) => {
  return (
    <Drawer {...props}>
      <Popover anchor={props.anchor} onClose={props.onClose} />
    </Drawer>
  );
};

export default ShoppingCartDrawer;
