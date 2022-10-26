import React from "react";
import MainLayout from "~/layouts/main";
import AppPage from "~/interfaces/app-page.interface";
import CategoriesList from "~/components/categories-list";
import {
  getProductCategories,
  ProductCategory,
} from "~/services/product-categories.service";
import CategorySection from "~/components/sections/category.section";
import { wrapper } from "~/store";
import { getRunningOperationPromises } from "~/services/api.service";
import { getProducts } from "~/services/products.service";
import { LoadingBackdrop } from "~/ui";
import { getModifiers } from "~/services/modifiers.service";
import ArticleSection from "~/components/sections/article.section";
import useScroll from "~/hooks/use-scroll";
import useProductCategories from "~/hooks/use-product-categories";
import PromotionSlider from "~/components/promotion-slider";
import { Stack } from "@mui/system";
import Head from "next/head";
import ErrorBoundary from "~/components/error-boundary";

export interface SectionContainerProps {
  categories: ProductCategory[];
}

export const HomePage: AppPage = () => {
  const { scrollToSection } = useScroll();
  const { productCategories, isLoading } = useProductCategories();

  React.useEffect(() => {
    const hash = decodeURIComponent(document.location.hash);

    if (!hash.length) return;

    scrollToSection(hash.slice(1)); /// #Роллы -> Роллы
  }, [scrollToSection]);

  return isLoading ? (
    <LoadingBackdrop open />
  ) : (
    <>
      <Stack
        sx={{
          paddingY: 2,
        }}
      >
        <CategoriesList
          id="app_bar_stopper"
          categories={productCategories}
          CategoryCardProps={{ size: "medium" }}
        />
      </Stack>
      <PromotionSlider />
      {productCategories.map(category => (
        <CategorySection key={category.uuid} category={category} />
      ))}
      <ArticleSection id="О нас" title="Что мы предлагаем?" collapse>
        Если хочется вкусного ужина (приготовленного не вами) или вдруг к вам
        пришли гости – выручит доставка пиццы на дом. А еще можно заказать суши
        и роллы. Или все сразу. Садишься, вводишь в поисковике: заказать пиццу в
        Пушкине, заказать пиццу в Пушкине на дом, заказать Wok с доставкой на
        дом. Пусть твой выбор не будет опрометчивым. Наши роллы, суши, мидии,
        креветки, пицца на тонком тесте, разные напитки – ваш ужин будет
        особенным. Наше меню – это вкусная еда, итальянская пицца на дом, мидии,
        креветки, вкусные суши и роллы. Заказав у нас один раз, люди
        возвращаются к нам снова и снова. Потому что мы следим за качеством –
        маленький бизнес обречен быть честным. Многое, что простится гигантской
        сети доставки, на небольшой территории станет грубейшей ошибкой. Наша
        пицца приходит горячей, а это, согласитесь, редкость при доставке еды. У
        нас можно заказать Вок, заказать суши, и, поверьте, наши суши выгодно
        отличаются от того, что доставляет большинство компаний. Наша зона
        покрытия невелика – доставка пиццы по Пушкинскому району, Павловск,
        Славянка, Ленсоветовский, – но мы стали любимцами сотен людей. Ни одного
        плохого отзыва о нашей продукции за всё время работы, мы следим за своей
        репутацией. Заглядывайте в наши социальные сети, там часто проводим
        розыгрыши, конкурсы. На нашем сайте в разделе акции можно выгодно
        заказать 3 пиццы. Пицца Пушкин, пицца Славянка, а также Детскосельский,
        Ленсоветовский, Федоровское, Павловск, Коммунар. Доставка бесплатно.
        Минимальный заказ 700 р.
      </ArticleSection>
      <ArticleSection id="Доставка и оплата" title="Доставка">
        {`Доставка пиццы, суши и роллов бесплатна при заказе от 700 рублей.

              Среднее время доставки 45 минут.

              Время доставки зависит от погодных условий и дорожной обстановки, в т.ч. ж/д переезда.

              Доставляем в следующие районы: Пушкин, Фёдоровское, Славянка, Московская Славянка, Павловск, Александровская.

              Продукция выпекается после оформления заказа и доставляется в термосумке.`}
      </ArticleSection>
      <ArticleSection id="Об оплате" title="Оплата">
        {`Оплата:
                - наличными курьеру
                - банковской картой через терминал
                `}
      </ArticleSection>
      <ArticleSection id="Контакты" title="Приём заказов">
        Ежедневно 11:00 — 22:30
      </ArticleSection>
    </>
  );
};

HomePage.getLayout = page => {
  return (
    <MainLayout>
      <ErrorBoundary>
        <Head>
          <title>
            Заказать пиццу, суши и роллы у Кэпа в Пушкине с доставкой на дом
          </title>
          <meta name="keywords" content="заказ, пицца, доставка, пушкин" />
          <meta
            name="description"
            content="Заказ пиццы, роллов и суши с доставкой в Славянке, Павловске, Глинка, Войскорово, Федоровское, Ленсоветовский, Никольское, Коммунаре. Купить пиццу с бесплатной доставкой по Пушкину СПб."
          />
        </Head>
        {page}
      </ErrorBoundary>
    </MainLayout>
  );
};

export const getStaticProps = wrapper.getStaticProps(store => async () => {
  store.dispatch(getProducts.initiate());
  store.dispatch(getProductCategories.initiate());
  store.dispatch(getModifiers.initiate());

  await Promise.all(getRunningOperationPromises());

  return {
    props: {},
    revalidate: 60, // In seconds
  };
});

export default HomePage;
