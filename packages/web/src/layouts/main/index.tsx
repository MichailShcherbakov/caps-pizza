import React from "react";
import dynamic from "next/dynamic";
import { Container, Stack, ThemeProvider } from "@mui/material";
import AppBar from "~/components/app-bar";
import InfoBar from "~/components/info-bar";
import theme from "~/ui/theme";
import Footer from "~/components/footer";
import styles from "./index.module.scss";
import { SectionProvider } from "~/helpers/section-provider";
import ShoppingCart from "~/components/shopping-cart";

const ShoppingCartButton = dynamic(
  () => import("../../components/shopping-cart-button"),
  {
    suspense: true,
    ssr: false,
  }
);

export const NotificationManager = dynamic(
  () => import("./components/notification-manager"),
  {
    suspense: true,
    ssr: false,
  }
);

export interface MainLayoutProps {
  children?: React.ReactElement | React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SectionProvider>
      <ThemeProvider theme={theme}>
        <ShoppingCart>
          <Stack alignItems="center" className={styles["main-layout"]}>
            <React.Suspense>
              <NotificationManager />
            </React.Suspense>
            <InfoBar />
            <AppBar />
            <Container
              component="main"
              className={styles["main-layout__container"]}
            >
              {children}
            </Container>
            <Footer />
          </Stack>
          <React.Suspense>
            <ShoppingCartButton variant="filled & rounded" />
          </React.Suspense>
        </ShoppingCart>
      </ThemeProvider>
    </SectionProvider>
  );
};

export default MainLayout;
