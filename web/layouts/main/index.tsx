import { Container, Stack, ThemeProvider } from "@mui/material";
import type { NextPage } from "next";
import React from "react";
import AppBar from "~/ui/components/app-bar";
import CookiesNotification from "~/ui/components/cookies-notification";
import { InfoBar } from "~/ui/components/info-bar";
import theme from "~/ui/theme";
import ShoppingCartButton from "~/ui/components/shopping-cart-button";
import Footer from "~/ui/components/footer";
import styles from "./index.module.scss";

export interface MainLayoutProps {
  children?: React.ReactElement | React.ReactElement[];
}

export const MainLayout: NextPage<MainLayoutProps> = ({ children }) => {
  const [showCookiesNotification, setShowCookiesNotification] =
    React.useState<boolean>(true);

  const onCookiesNotificatonCloseHandler = () => {
    setShowCookiesNotification(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack alignItems="center" className={styles["main-layout"]}>
        {showCookiesNotification && (
          <CookiesNotification
            className={styles["main-layout__container"]}
            onClose={onCookiesNotificatonCloseHandler}
          />
        )}
        <InfoBar className={styles["main-layout__container"]} />
        <AppBar
          className={[
            styles["main-layout__container"],
            styles["main-layout__app-bar"],
          ].join(" ")}
        />
        <Stack component="main" className="ui-w-full ui-py-8">
          <Container>{children}</Container>
        </Stack>
        <Footer className={styles["main-layout__container"]} />
      </Stack>
      <ShoppingCartButton count={0} variant="filled & rounded" />
    </ThemeProvider>
  );
};

export default MainLayout;
