import React from "react";
import dynamic from "next/dynamic";
import { Container, Stack, ThemeProvider } from "@mui/material";
import AppBar from "~/components/app-bar";
import InfoBar from "~/components/info-bar";
import theme from "~/ui/theme";
// import ShoppingCartButton from "~/ui/components/shopping-cart-button";
import Footer from "~/components/footer";
import styles from "./index.module.scss";
import { SectionProvider } from "~/helpers/section-provider";

export const NotificationManager = dynamic(
  () => import("./components/notifiction-manager"),
  {
    suspense: true,
    ssr: false,
  }
);

export interface MainLayoutProps {
  children?: React.ReactElement | React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // const countOrderedProducts = useAppSelector(selectCountOrderedProducts);

  return (
    <SectionProvider>
      <ThemeProvider theme={theme}>
        <Stack alignItems="center" className={styles["main-layout"]}>
          {/* <NotificationManager /> */}
          <InfoBar className={styles["main-layout__container"]} />
          <AppBar className={[styles["main-layout__container"]].join(" ")} />
          <Container
            component="main"
            className="ui-flex ui-flex-col ui-gap-4 ui-py-10"
          >
            {children}
          </Container>
          <Footer className={styles["main-layout__container"]} />
        </Stack>
        {/* <ShoppingCartButton
        count={countOrderedProducts}
        variant="filled & rounded"
      /> */}
      </ThemeProvider>
    </SectionProvider>
  );
};

export default MainLayout;
