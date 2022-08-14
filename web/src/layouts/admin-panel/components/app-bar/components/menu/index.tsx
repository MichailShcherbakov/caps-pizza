import { Box, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import MenuList from "./components/list";
import styles from "./index.module.scss";

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
      <Drawer
        anchor="left"
        open={open}
        className={styles["drawer-menu"]}
        onClose={onDrawerCloseHandler}
      >
        <Box role="presentation" className={styles["drawer-menu__inner"]}>
          <MenuList />
        </Box>
      </Drawer>
    </>
  );
};

export default DrawerMenuButton;
