import { Container, Stack, ThemeProvider } from "@mui/material";
import type { NextPage } from "next";
import React from "react";
import AppBar from "~/ui/components/app-bar";
import CookiesNotification from "~/ui/components/cookies-notification";
import { InfoBar } from "~/ui/components/info-bar";
import theme from "~/ui/theme";
import styles from "./index.module.scss";
import Categories from "~/ui/components/categories";

export const Home: NextPage = () => {
  const [showCookiesNotification, setShowCookiesNotification] =
    React.useState<boolean>(true);

  const onCookiesNotificatonCloseHandler = () => {
    setShowCookiesNotification(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack alignItems="center" className={styles["main-layout"]}>
        <Stack className={styles["main-layout__container"]}>
          {showCookiesNotification && (
            <CookiesNotification onClose={onCookiesNotificatonCloseHandler} />
          )}
        </Stack>
        <Stack className={styles["main-layout__container"]}>
          <InfoBar />
        </Stack>
        <Stack className={styles["main-layout__container"]}>
          <AppBar />
        </Stack>
        <Stack className={styles["main-layout"]}>
          <Categories />
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
