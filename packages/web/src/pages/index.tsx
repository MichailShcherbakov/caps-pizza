import React from "react";
import MainLayout from "~/layouts/main";
import AppPage from "~/interfaces/app-page.interface";
import CategoriesList from "~/components/categories-list";
import {
  getProductCategories,
  ProductCategory,
  useGetProductCategoriesQuery,
} from "~/services/product-categories.service";
import CategorySection from "~/components/sections/category.section";
import { GetServerSideProps } from "next";
import { wrapper } from "~/store";
import { getRunningOperationPromises } from "~/services/api.service";
import { getProducts } from "~/services/products.service";
import { LoadingBackdrop } from "~/ui";
import { getModifiers } from "~/services/modifiers.service";
import ArticleSection from "~/components/sections/article.section";
import useScroll from "~/hooks/use-scroll";

export interface SectionContainerProps {
  categories: ProductCategory[];
}

export const HomePage: AppPage = () => {
  const { scrollToSection } = useScroll();
  const { data: productCategories = [], isLoading } =
    useGetProductCategoriesQuery();

  React.useEffect(() => {
    const hash = decodeURIComponent(document.location.hash);

    if (!hash.length) return;

    scrollToSection(hash.slice(1)); /// #Роллы -> Роллы
  }, [scrollToSection]);

  return isLoading ? (
    <LoadingBackdrop open={isLoading} />
  ) : (
    <>
      <CategoriesList
        className="ui-py-8"
        categories={productCategories}
        CategoryCardProps={{ size: "medium" }}
      />
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
      <ArticleSection id="О доставке" title="Доставка">
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
      <ArticleSection id="О приёме заказов" title="Приём заказов">
        Ежедневно 11:00 — 22:30
      </ArticleSection>
    </>
  );
};

HomePage.getLayout = page => {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async () => {
    store.dispatch(getProducts.initiate());
    store.dispatch(getProductCategories.initiate());
    store.dispatch(getModifiers.initiate());

    await Promise.all(getRunningOperationPromises());

    return {
      props: {},
    };
  });

export default HomePage;