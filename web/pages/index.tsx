import {
  Container,
  Grid,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import React from "react";
import AppBar from "~/ui/components/app-bar";
import CookiesNotification from "~/ui/components/cookies-notification";
import { InfoBar } from "~/ui/components/info-bar";
import theme from "~/ui/theme";
import styles from "./index.module.scss";
import Categories from "~/ui/components/categories";
import ProductCard from "~/ui/components/product-card";
import Products from "~/public/pizza.json";

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
          <Container>
            <Typography id="pizza" variant="h1">
              Пиццы
            </Typography>
          </Container>
          <Container className="ui-py-12">
            <Grid container spacing={2}>
              {Products.map((p) => (
                <Grid item xl={3} lg={3} md={4} sm={6} xs={12} key={p.id}>
                  <ProductCard
                    iconUrl={p.iconUrl}
                    name={p.name}
                    desc={p.desc}
                    addInfo={`${p.size} / ${p.weight}`}
                    price={p.price}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
