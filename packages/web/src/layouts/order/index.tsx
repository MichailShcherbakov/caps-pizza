import React from "react";
import dynamic from "next/dynamic";
import { Container, Stack, ThemeProvider } from "@mui/material";
import AppBar from "~/components/app-bar";
import theme from "~/ui/theme";
import Footer from "~/components/footer";
import styles from "./index.module.scss";
import ShoppingCart from "~/components/shopping-cart";

export const NotificationManager = dynamic(
  () => import("../main/components/notification-manager"),
  {
    suspense: true,
    ssr: false,
  }
);

export interface OrderLayoutProps {
  children?: React.ReactElement | React.ReactNode;
}

export const OrderLayout: React.FC<OrderLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <ShoppingCart>
        <Stack alignItems="center" className={styles["order-layout"]}>
          <React.Suspense>
            <NotificationManager />
          </React.Suspense>
          <AppBar empty />
          <Container
            component="main"
            className={styles["order-layout__container"]}
          >
            {children}
          </Container>
          <Footer />
        </Stack>
      </ShoppingCart>
    </ThemeProvider>
  );
};

export default OrderLayout;
