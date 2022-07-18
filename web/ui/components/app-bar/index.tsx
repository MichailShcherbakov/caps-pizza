import { Container, Stack } from "@mui/material";
import React from "react";
import Logo from "./components/logo";
import ShoppingCartButton from "./components/shopping-cart-button";
import styles from "./index.module.scss";

export interface AppBarProps {}

export const AppBar: React.FC<{}> = () => {
  return (
    <Container>
      <Stack direction="row" alignItems="center" className={styles["app-bar"]}>
        <Logo />
        <ShoppingCartButton />
      </Stack>
    </Container>
  );
};

export default AppBar;
