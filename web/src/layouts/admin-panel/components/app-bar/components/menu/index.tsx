import { Box, Drawer, IconButton, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./index.module.scss";
import React from "react";
import MenuList from "./components/list";

export interface DrawerMenuButtonProps {}

export const DrawerMenuButton: React.FC<DrawerMenuButtonProps> = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  const onButtonClickHandler = () => {
    setOpen(true);
  };

  const onDrawerCloseHandler = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        size="large"
        className={styles["drawer-menu__btn"]}
        onClick={onButtonClickHandler}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={onDrawerCloseHandler}>
        <Box role="presentation" className={styles["drawer-menu__box"]}>
          <MenuList />
        </Box>
      </Drawer>
    </>
  );
};

export default DrawerMenuButton;
