import React from "react";
import dynamic from "next/dynamic";
import { Container, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import AppBar from "~/components/app-bar";
import InfoBar from "~/components/info-bar";
import theme from "~/ui/theme";
import Footer from "~/components/footer";
import { SectionProvider } from "~/helpers/section-provider";
import ShoppingCart from "~/components/shopping-cart";
import { useStyle } from "./index.style";

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
  const { classes } = useStyle();
  return (
    <SectionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ShoppingCart>
          <Stack alignItems="center" className={classes.root}>
            <React.Suspense>
              <NotificationManager />
            </React.Suspense>
            <InfoBar />
            <AppBar />
            <Container component="main" className={classes.container}>
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
