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
import ShoppingCartButton from "~/ui/components/shopping-cart-button";
import Article from "~/ui/components/article";

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
        <Stack component="main" className="ui-w-full ui-py-8">
          <Container>
            <Categories className="ui-py-8" />
            <Stack id="pizza" component="section" className="ui-py-8">
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
            <Stack component="section" className="ui-py-8">
              <Article
                title="Что мы предлагаем?"
                text="Если хочется вкусного ужина (приготовленного не вами) или вдруг к вам пришли гости – выручит доставка пиццы на дом. А еще можно заказать суши и роллы. Или все сразу. Садишься, вводишь в поисковике: заказать пиццу в Пушкине, заказать пиццу в Пушкине на дом, заказать Wok с доставкой на дом. Пусть твой выбор не будет опрометчивым. Наши роллы, суши, мидии, креветки, пицца на тонком тесте, разные напитки – ваш ужин будет особенным. Наше меню – это вкусная еда, итальянская пицца на дом, мидии, креветки, вкусные суши и роллы. Заказав у нас один раз, люди возвращаются к нам снова и снова. Потому что мы следим за качеством – маленький бизнес обречен быть честным. Многое, что простится гигантской сети доставки, на небольшой территории станет грубейшей ошибкой. Наша пицца приходит горячей, а это, согласитесь, редкость при доставке еды. У нас можно заказать Вок, заказать суши, и, поверьте, наши суши выгодно отличаются от того, что доставляет большинство компаний. Наша зона покрытия невелика – доставка пиццы по Пушкинскому району, Павловск, Славянка, Ленсоветовский, – но мы стали любимцами сотен людей. Ни одного плохого отзыва о нашей продукции за всё время работы, мы следим за своей репутацией. Заглядывайте в наши социальные сети, там часто проводим розыгрыши, конкурсы. На нашем сайте в разделе акции можно выгодно заказать 3 пиццы. Пицца Пушкин, пицца Славянка, а также Детскосельский, Ленсоветовский, Федоровское, Павловск, Коммунар. Доставка бесплатно. Минимальный заказ 700 р."
                collapse
              />
            </Stack>
            <Stack component="section" className="ui-py-8">
              <Article
                title="Доставка"
                text={`Доставка пиццы, суши и роллов бесплатна при заказе от 700 рублей.

                Среднее время доставки 45 минут.

                Время доставки зависит от погодных условий и дорожной обстановки, в т.ч. ж/д переезда.

                Доставляем в следующие районы: Пушкин, Фёдоровское, Славянка, Московская Славянка, Павловск, Александровская.

                Продукция выпекается после оформления заказа и доставляется в термосумке.`}
              />
            </Stack>
            <Stack component="section" className="ui-py-8">
              <Article
                title="Оплата"
                text={`Оплата:
                - наличными курьеру
                - банковской картой через терминал
                `}
              />
            </Stack>
            <Stack component="section" className="ui-py-8">
              <Article title="Приём заказов" text="Ежедневно 11:00 — 22:30" />
            </Stack>
          </Container>
        </Stack>
      </Stack>
      <ShoppingCartButton count={0} variant="filled & rounded" />
    </ThemeProvider>
  );
};

export default Home;
