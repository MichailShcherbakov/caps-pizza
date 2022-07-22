import { Grid } from "@mui/material";
import { NextPage } from "next";
import React from "react";
import Categories from "~/ui/components/categories";
import ProductCard from "~/ui/components/product-card";
import Article from "~/ui/components/article";
import MainLayout from "~/layouts/main";
import Title from "~/ui/components/title";
import CategorySection from "~/ui/components/category-section";
import { useAppSelector } from "~/store/hook";

export const HomePage: NextPage = () => {
  const products = useAppSelector((state) => state.products.value);
  const categories = useAppSelector((state) => state.categories.value);

  let sections: JSX.Element[] = [];

  for (const category of categories) {
    const p = products.filter((p) => p.categoryUUID === category.uuid);

    if (!p.length) continue;

    sections.push(
      <CategorySection key={category.uuid} id={category.name}>
        <Title text={category.name} />
        <Grid container spacing={2} className="ui-py-8">
          {p.map((p) => (
            <Grid key={p.uuid} item xl={3} lg={3} md={4} sm={6} xs={12}>
              <ProductCard
                name={p.name}
                desc={p.desc}
                imageURL={p.imageURL}
                specifics={`${"30см"} / ${"760г"}`}
                price={440}
                cover={category.name === "Роллы"}
              />
            </Grid>
          ))}
        </Grid>
      </CategorySection>
    );
  }

  return (
    <MainLayout>
      <Categories className="ui-py-8" />
      {sections}
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
