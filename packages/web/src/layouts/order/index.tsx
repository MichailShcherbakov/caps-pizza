import React from "react";
import dynamic from "next/dynamic";
import { Container, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import theme from "~/ui/theme";
import Footer from "~/components/footer";
import ShoppingCart from "~/components/shopping-cart";
import EmptyAppBar from "~/components/app-bar/empty";
import { useStyle } from "../main/index.style";

export const NotificationManager = dynamic(
  () => import("../main/components/notification-manager"),
  {
    ssr: false,
  }
);

export interface OrderLayoutProps {
  children?: React.ReactElement | React.ReactNode;
}

export const OrderLayout: React.FC<OrderLayoutProps> = ({ children }) => {
  const { classes } = useStyle();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ShoppingCart>
        <Stack alignItems="center" className={classes.root}>
          <NotificationManager />
          <EmptyAppBar />
          <Container component="main" className={classes.container}>
            {children}
          </Container>
          <Footer />
        </Stack>
      </ShoppingCart>
    </ThemeProvider>
  );
};

export default OrderLayout;
