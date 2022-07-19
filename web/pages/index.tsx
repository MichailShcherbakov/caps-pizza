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
        <Stack className={styles["main-layout"]}>
          <Container>
            <Categories className="ui-py-12" />
            <Stack id="pizza" component="section">
              <Typography variant="h1" className="ui-pb-12">
                Пиццы
              </Typography>
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
            </Stack>
          </Container>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
