import React from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Container, Stack, ThemeProvider } from "@mui/material";
import AppBar from "~/common/components/app-bar";
import { InfoBar } from "~/ui/components/info-bar";
import theme from "~/ui/theme";
import ShoppingCartButton from "~/ui/components/shopping-cart-button";
import Footer from "~/ui/components/footer";
import styles from "./index.module.scss";
import { useAppSelector } from "~/store/hook";
import { selectCountOrderedProducts } from "~/store/order.reducer";

export const NotificationManager = dynamic(
  () => import("./components/notifiction-manager"),
  {
    ssr: false,
  }
);

export interface MainLayoutProps {
  children?:
    | React.ReactElement
    | React.ReactElement[]
    | JSX.Element
    | JSX.Element[]
    | React.ReactNode
    | React.ReactNode[];
}

export const MainLayout: NextPage<MainLayoutProps> = ({ children }) => {
  const countOrderedProducts = useAppSelector(selectCountOrderedProducts);

  return (
    <ThemeProvider theme={theme}>
      <Stack alignItems="center" className={styles["main-layout"]}>
        <NotificationManager />
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
      <ShoppingCartButton
        count={countOrderedProducts}
        variant="filled & rounded"
      />
    </ThemeProvider>
  );
};

export default MainLayout;
