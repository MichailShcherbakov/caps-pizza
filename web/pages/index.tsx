import { Grid, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import React from "react";
import Categories from "~/ui/components/categories";
import ProductCard from "~/ui/components/product-card";
import Products from "~/public/pizza.json";
import Article from "~/ui/components/article";
import MainLayout from "~/layouts/main";
import Title from "~/ui/components/title";
import CategorySection from "~/ui/components/category-section";

export const HomePage: NextPage = () => {
  return (
    <MainLayout>
      <Categories className="ui-py-8" />
      <CategorySection id="pizza">
        <Title text="Пиццы" />
        <Grid container spacing={2} className="ui-py-8">
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
      </CategorySection>
      <CategorySection id="rolls">
        <Title text="Роллы классические" />
        <Grid container spacing={2} className="ui-py-8">
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
        <Title text="Роллы запеченные" />
        <Grid container spacing={2} className="ui-py-8">
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
        <Title text="Роллы в темпуре" />
        <Grid container spacing={2} className="ui-py-8">
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
      </CategorySection>
      <CategorySection id="about-us">
        <Article
          title="Что мы предлагаем?"
          text="Если хочется вкусного ужина (приготовленного не вами) или вдруг к вам пришли гости – выручит доставка пиццы на дом. А еще можно заказать суши и роллы. Или все сразу. Садишься, вводишь в поисковике: заказать пиццу в Пушкине, заказать пиццу в Пушкине на дом, заказать Wok с доставкой на дом. Пусть твой выбор не будет опрометчивым. Наши роллы, суши, мидии, креветки, пицца на тонком тесте, разные напитки – ваш ужин будет особенным. Наше меню – это вкусная еда, итальянская пицца на дом, мидии, креветки, вкусные суши и роллы. Заказав у нас один раз, люди возвращаются к нам снова и снова. Потому что мы следим за качеством – маленький бизнес обречен быть честным. Многое, что простится гигантской сети доставки, на небольшой территории станет грубейшей ошибкой. Наша пицца приходит горячей, а это, согласитесь, редкость при доставке еды. У нас можно заказать Вок, заказать суши, и, поверьте, наши суши выгодно отличаются от того, что доставляет большинство компаний. Наша зона покрытия невелика – доставка пиццы по Пушкинскому району, Павловск, Славянка, Ленсоветовский, – но мы стали любимцами сотен людей. Ни одного плохого отзыва о нашей продукции за всё время работы, мы следим за своей репутацией. Заглядывайте в наши социальные сети, там часто проводим розыгрыши, конкурсы. На нашем сайте в разделе акции можно выгодно заказать 3 пиццы. Пицца Пушкин, пицца Славянка, а также Детскосельский, Ленсоветовский, Федоровское, Павловск, Коммунар. Доставка бесплатно. Минимальный заказ 700 р."
          collapse
        />
      </CategorySection>
      <CategorySection id="delivery">
        <Article
          title="Доставка"
          text={`Доставка пиццы, суши и роллов бесплатна при заказе от 700 рублей.

                Среднее время доставки 45 минут.

                Время доставки зависит от погодных условий и дорожной обстановки, в т.ч. ж/д переезда.

                Доставляем в следующие районы: Пушкин, Фёдоровское, Славянка, Московская Славянка, Павловск, Александровская.

                Продукция выпекается после оформления заказа и доставляется в термосумке.`}
        />
      </CategorySection>
      <CategorySection id="payment">
        <Article
          title="Оплата"
          text={`Оплата:
                - наличными курьеру
                - банковской картой через терминал
                `}
        />
      </CategorySection>
      <CategorySection id="accepting-orders">
        <Article title="Приём заказов" text="Ежедневно 11:00 — 22:30" />
      </CategorySection>
    </MainLayout>
  );
};

export default HomePage;
