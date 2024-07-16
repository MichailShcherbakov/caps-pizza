import { MigrationInterface, QueryRunner } from "typeorm";
import {
  ProductVolumeTypeEnum,
  ProductWeightTypeEnum,
} from "../entities/product.entity";
import {
  DeliveryCriteriaEnum,
  DeliveryOperatorEnum,
  DeliveryTypeEnum,
} from "../entities/delivery.entity";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
} from "../entities/discount.entity";
import UsersSeeder from "../seeders/users.seeder";
import ModifierCategoriesSeeder from "../seeders/modifier-categories.seeder";
import ModifiersSeeder from "../seeders/modifier.seeder";
import ProductCategoriesSeeder from "../seeders/product-category.seeder";
import DeliverySeeder from "../seeders/delivery.seeder";
import ProductsSeeder from "../seeders/product.seeder";
import PromotionSeeder from "../seeders/promotion.seeder";
import DiscountsSeeder from "../seeders/discount.seeder";
import DiscountStrategiesSeeder from "../seeders/discount-strategy.seeder";
import PaymentSeeder from "../seeders/payment.seeder";
import {
  ModifierCategoryChoiceOptionEnum,
  ModifierCategoryDisplayVariantEnum,
} from "@monorepo/common";
import ShoppingCartSettingsSeeder from "../seeders/shopping-cart-settings.seeder";

export class initialSeed1720348356653 implements MigrationInterface {
  name = "initialSeed1720348356653";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = new UsersSeeder(queryRunner);
    const modifierCategories = new ModifierCategoriesSeeder(queryRunner);
    const modifiers = new ModifiersSeeder(queryRunner);
    const productCategories = new ProductCategoriesSeeder(queryRunner);
    const products = new ProductsSeeder(queryRunner);
    const deliveries = new DeliverySeeder(queryRunner);
    const promotions = new PromotionSeeder(queryRunner);
    const discounts = new DiscountsSeeder(queryRunner);
    const discountStrategies = new DiscountStrategiesSeeder(queryRunner);
    const payments = new PaymentSeeder(queryRunner);
    const shoppingCartSettings = new ShoppingCartSettingsSeeder(queryRunner);

    await shoppingCartSettings.create({
      minimum_order_amount: 1000,
    });

    await users.create({
      name: "admin",
      salt: "$2a$10$eDXmKeQFddc2fbRidQ8KOO",
      password_hash:
        "$2a$10$eDXmKeQFddc2fbRidQ8KOOEoWlwr9LLKJvkqb15Vja89mrqoS8.Ii",
    });

    const [pizzasByFixedPrice] = await discounts.createManyFrom([
      {
        name: "3 за 1550",
        type: DiscountTypeEnum.FIXED_PRICE,
        value: 1550,
      },
    ]);

    await deliveries.createManyFrom([
      {
        name: "Доставка пиццы от Кэпа",
        article_number: 9999999,
        type: DeliveryTypeEnum.IN_CASH,
        value: 30,
        condition: {
          criteria: DeliveryCriteriaEnum.COUNT,
          op: DeliveryOperatorEnum.GREATER,
          value: 0,
        },
      },
      // {
      //   name: "Бесплатная доставка пиццы от Кэпа",
      //   article_number: 9999998,
      //   type: DeliveryTypeEnum.IN_CASH,
      //   value: 0,
      //   condition: {
      //     criteria: DeliveryCriteriaEnum.PRICE,
      //     op: DeliveryOperatorEnum.GREATER,
      //     value: 700,
      //   },
      // },
    ]);

    await payments.createManyFrom([
      {
        code: 1,
        name: "Оплата наличными, без сдачи",
      },
      {
        code: 1742,
        name: "Оплата наличными, необходима сдача",
      },
      {
        code: 2,
        name: "Оплата картой",
      },
    ]);

    await promotions.createManyFrom([
      {
        name: "Три любые пиццы на традиционном тесте за 1550 рублей",
        image_url: "/images/promo1.svg",
        display: true,
        display_position: 1,
      },
      /*   {
        name: "Бесплатная доставка при заказе от 700 рублей",
        image_url: "/images/promo2.svg",
        display: true,
        display_position: 2,
      }, */
    ]);

    const [dough, sauce, kit, addPizzaItems] =
      await modifierCategories.createManyFrom([
        {
          name: "Тесто",
          image_url: "",
          choice_option: ModifierCategoryChoiceOptionEnum.ONE,
          display: true,
          display_variant: ModifierCategoryDisplayVariantEnum.SWITCHER,
          display_position: 1,
        },
        {
          name: "Соус",
          image_url: "",
          choice_option: ModifierCategoryChoiceOptionEnum.ONE,
          display: true,
          display_variant: ModifierCategoryDisplayVariantEnum.SWITCHER,
          display_position: 1,
        },
        {
          name: "Набор",
          image_url: "",
          choice_option: ModifierCategoryChoiceOptionEnum.ONE,
          display: true,
          display_variant: ModifierCategoryDisplayVariantEnum.SWITCHER,
          display_position: 1,
        },
        {
          name: "Доп. ингредиенты для пиццы",
          image_url: "",
          choice_option: ModifierCategoryChoiceOptionEnum.MANY,
          display: true,
          display_name: "Добавить в пиццу",
          display_variant: ModifierCategoryDisplayVariantEnum.LIST,
          display_position: 2,
        },
      ]);

    const [
      traditionalDough,
      _,
      yakiSauce,
      __,
      weekdayCombo,
      ____,
      withoutAdds,
    ] = await modifiers.createManyFrom([
      {
        name: "Традиционное тесто",
        article_number: 140102,
        price: 0,
        category_uuid: dough.uuid,
        display: true,
        display_position: 1,
      },
      {
        name: "Пышное тесто",
        article_number: 140103,
        price: 50,
        category_uuid: dough.uuid,
        display: true,
        display_position: 2,
      },
      {
        name: "Яки соус",
        article_number: 140104,
        price: 0,
        category_uuid: sauce.uuid,
        display: true,
        display_position: 1,
      },
      {
        name: "Спайси соус",
        article_number: 140105,
        price: 0,
        category_uuid: sauce.uuid,
        display: true,
        display_position: 2,
      },
      {
        name: "Будний день",
        article_number: 140106,
        price: 0,
        category_uuid: kit.uuid,
        display: true,
        display_position: 1,
      },
      {
        name: "Выходной день",
        article_number: 140107,
        price: 200,
        category_uuid: kit.uuid,
        display: true,
        display_position: 2,
      },
      {
        name: "Без добавлений",
        article_number: 140100,
        price: 0,
        category_uuid: addPizzaItems.uuid,
        display: false,
        display_position: 0,
      },
      {
        name: "Моцарелла",
        image_url: "/images/cheese.png",
        article_number: 140101,
        price: 100,
        category_uuid: addPizzaItems.uuid,
        display: true,
        display_position: 1,
      },
    ]);

    const [_news, pizza, combo, rolls, snacks, drink] =
      await productCategories.createManyFrom([
        {
          name: "Новинки",
          image_url: "/images/news.svg",
          display: false,
          display_position: 1,
        },
        {
          name: "Пиццы",
          image_url: "/images/pizza.svg",
          display: true,
          display_position: 2,
        },
        {
          name: "Наборы",
          image_url: "/images/combo.svg",
          display: true,
          display_position: 3,
        },
        {
          name: "Роллы",
          image_url: "/images/rolls.svg",
          display: true,
          display_position: 4,
        },
        {
          name: "Закуски",
          image_url: "/images/snacks.svg",
          display: true,
          display_position: 5,
        },
        {
          name: "Напитки",
          image_url: "/images/drink.svg",
          display: true,
          display_position: 6,
        },
      ]);

    const [classicRolls, bakedRolls, tempuraRolls, addition] =
      await productCategories.createManyFrom([
        {
          name: "Роллы классические",
          display: true,
          display_position: 1,
          parent: rolls,
        },
        {
          name: "Роллы запеченные",
          display: true,
          display_position: 2,
          parent: rolls,
        },
        {
          name: "Роллы в темпуре",
          display: true,
          display_position: 3,
          parent: rolls,
        },
        {
          name: "Дополнительно",
          display: true,
          display_position: 4,
          parent: rolls,
        },
      ]);

    await discountStrategies.create({
      discount_uuid: pizzasByFixedPrice.uuid,
      condition: {
        criteria: DiscountCriteriaEnum.COUNT,
        op: DiscountOperatorEnum.EQUAL,
        value: 3,
      },
      modifiers: [traditionalDough],
      product_categories: [pizza],
    });

    await products.createManyFrom([
      {
        name: "Пицца Маргарита",
        desc: "Томатный соус, сыр моцарелла, базилик",
        article_number: 134943,
        image_url: "/images/margarita.png",
        price: 540,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 420,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Пепперони",
        desc: "Томатный соус, сыр моцарелла, салями пепперони",
        article_number: 134947,
        image_url: "/images/pepperoni.png",
        price: 590,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 470,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Карбонара",
        desc: "Cоус карбонара, сыр моцарелла, бекон",
        article_number: 134948,
        image_url: "/images/karbonara.png",
        price: 590,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 470,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Жульен",
        desc: "Cливочный соус, куриное филе, свежие шампиньоны, сыр моцарелла, сыр чеддер, зеленый лук",
        article_number: 134949,
        image_url: "/images/zhulen.png",
        price: 640,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 535,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца 4 сезона",
        desc: "Томатный соус, сыр моцарелла, салями пепперони, ветчина, куриное филе, сыр чеддер, сыр горгонзола",
        article_number: 134950,
        image_url: "/images/4-sezona.png",
        price: 580,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 520,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Прошутто-фунги",
        desc: "Томатный соус, сыр моцарелла, ветчина, свежие шампиньоны, свежие томаты",
        article_number: 134951,
        image_url: "/images/proshutto-fungi.png",
        price: 610,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 510,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Вегетарианская",
        desc: "Сыр моцарелла, томатный соус, свежие шампиньоны, корнишоны, болгарский перец, свежие томаты, красный лук",
        article_number: 134952,
        image_url: "/images/vegetarianskaya.png",
        price: 590,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 470,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца 4 сыра",
        desc: "Сливочный соус, сыр моцарелла, сыр чеддер, сыр горгонзола, сыр пармезан",
        article_number: 134954,
        image_url: "/images/4 cheeses.png",
        price: 610,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 470,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Поло",
        desc: "Томатный соус, сливочный соус, сыр моцарелла, болгарский перец, корнишоны, красный лук, куриное филе",
        article_number: 134955,
        image_url: "/images/polo.png",
        price: 630,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 530,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Неаполитана",
        desc: "Томатный соус, сыр моцарелла, свежие томаты, сыр пармезан, чеснок",
        article_number: 134957,
        image_url: "/images/neapolitan.png",
        price: 570,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 520,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Мясная",
        desc: "Томатный соус, сыр моцарелла, свинина, куриное филе, ветчина, паприка, красный лук",
        article_number: 134959,
        image_url: "/images/myasnaya.png",
        price: 630,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 740,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Барбекю",
        desc: "Соус барбекю, сыр чеддер, сыр моцарелла, бекон, свинина, красный лук",
        article_number: 134960,
        image_url: "/images/barbekyu.png",
        price: 640,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 530,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Острая",
        desc: "Томатный соус, сыр моцарелла, салями пепперони, халапеньо, колбаски охотничьи, красный лук",
        article_number: 134961,
        image_url: "/images/ostraya.png",
        price: 600,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 540,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Морская",
        desc: "Розовый соус, сыр моцарелла, креветки, мидии, лосось, снежный краб",
        article_number: 134962,
        image_url: "/images/marine.jpg",
        price: 620,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Охотничья",
        desc: "Розовый соус, сыр моцарелла, куриное филе, колбаски охотничьи, белый соус",
        article_number: 134964,
        image_url: "/images/hunting.jpg",
        price: 610,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Пивная",
        desc: "Томатный соус, сыр моцарелла, салями пепперони, ветчина, колбаски охотничьи, халапеньо",
        article_number: 134965,
        image_url: "/images/pivnaya.png",
        price: 600,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 635,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца от Кэпа",
        desc: "Розовый соус, сыр моцарелла, куриное филе, свинина, бекон, свежие томаты, свежие шампиньоны",
        article_number: 134966,
        image_url: "/images/ot-kepa.png",
        price: 650,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 715,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Ди-феста",
        desc: "Томатный соус, сыр моцарелла, свежие шампиньоны, свинина, красный лук, соус белый",
        article_number: 150196,
        image_url: "/images/di-festa.png",
        price: 630,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 540,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Гавайская с ветчиной",
        desc: "Розовый соус, сыр моцарелла, ветчина, ананас",
        article_number: 150198,
        image_url: "/images/hawaiian-with-ham.jpg",
        price: 590,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 630,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Гавайская с курицей",
        desc: "Розовый соус, сыр моцарелла, курица, ананас",
        article_number: 150200,
        image_url: "/images/hawaiian-with-chicken.jpg",
        price: 590,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 650,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Детская",
        desc: "Томатный соус, соус белый, сыр моцарелла, сосиски",
        article_number: 150202,
        image_url: "/images/detskaya.png",
        price: 540,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 440,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца 4 сезона бьянко",
        desc: "Сливочный соус, сыр моцарелла, пепперони, ветчина, куриное филе, чеддер, сыр горгонзола",
        article_number: 150218,
        image_url: "/images/4-seasons-bianco.png",
        price: 580,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 520,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Пепперони бьянко",
        desc: "Сливочный соус, сыр моцарелла, пепперони",
        article_number: 150220,
        image_url: "/images/pepperoni-bianco.jpg",
        price: 590,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 470,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Мясная бьянко",
        desc: "Сливочный соус, сыр моцарелла, ветчина, свинина, куриное филе, паприка, красный лук",
        article_number: 150222,
        image_url: "/images/meat-bianco.jpg",
        price: 630,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 740,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Прошутто-фунги бьянко",
        desc: "Сливочный соус, сыр моцарелла, ветчина, свежие шампиньоны, свежие томаты",
        article_number: 150224,
        image_url: "/images/prosciutto-fungi-bianco.jpg",
        price: 610,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 510,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Сборная",
        desc: "Сливочный соус, сыр моцарелла, сыр пармезан, сыр чеддер, бекон, охотничьи колбаски, халапеньо",
        article_number: 279335,
        image_url: "/",
        price: 640,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 600,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Пушкинская",
        desc: "Сливочный соус, сыр моцарелла, красный лук, охотничьи колбаски, бекон, корнишоны",
        article_number: 279337,
        image_url: "/",
        price: 590,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 600,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      {
        name: "Пицца Пармеджано",
        desc: "Сливочный соус, сыр моцарелла, пепперони, пармезан, колбаски охотничьи, халапеньо, ветчина",
        article_number: 285812,
        image_url: "/",
        price: 640,
        categories: [pizza],
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 540,
        },
        modifiers: [traditionalDough, withoutAdds],
      },
      // COMBO
      {
        name: "Набор Италия-Япония 1:3",
        desc: "Пицца пушкинская, запеченный ролл мини лосось, запеченный ролл мини с креветкой, запеченный ролл мини с крабом",
        article_number: 184151,
        image_url: "/images/nabor-1.jpg",
        price: 1200,
        categories: [combo],
        modifiers: [weekdayCombo],
      },
      // ROLLS
      {
        name: "Ролл сливочный лосось",
        desc: "Лосось, сливочный сыр, огурец, икра тобико",
        article_number: 150111,
        image_url: "/images/creamy.jpg",
        price: 440,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 240,
        },
      },
      {
        name: "Ролл мини угорь",
        article_number: 145372,
        image_url: "/images/m-acne.jpg",
        price: 310,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 105,
        },
      },
      {
        name: "Ролл острый мини лосось",
        article_number: 145373,
        image_url: "/images/o-m-salmon.jpg",
        price: 310,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 100,
        },
      },
      {
        name: "Ролл мини с Лососем",
        article_number: 150101,
        image_url: "/images/r-salmon.jpg",
        price: 310,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 100,
        },
      },
      {
        name: "Ролл с огурцом",
        article_number: 150102,
        image_url: "/images/cucumber.jpg",
        price: 190,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 100,
        },
      },
      {
        name: "Ролл острый мини угорь",
        article_number: 150106,
        image_url: "/images/o-m-acne.jpg",
        price: 310,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 110,
        },
      },
      {
        name: "Мини ролл с креветкой",
        article_number: 184143,
        image_url: "/images/mini-roll-s-krevetkoy.jpg",
        price: 310,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 110,
        },
      },
      {
        name: "Ролл Чикен спайси",
        desc: "Cливочный сыр, кунжут, курица, спайси соус",
        article_number: 150107,
        image_url: "/images/spicy-chicken.jpg",
        price: 410,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 269,
        },
      },
      {
        name: "Ролл Калифорния с лососем",
        desc: "Лосось, огурец, икра тобико, авокадо, яки соус",
        article_number: 150112,
        image_url: "/images/california-salmon.png",
        price: 450,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 229,
        },
      },
      {
        name: "Ролл Калифорния со снежным крабом",
        desc: "Снежный краб, огурец, икра тобико, авокадо, яки соус",
        article_number: 150113,
        image_url: "/images/california-crab.png",
        price: 440,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 220,
        },
      },
      {
        name: "Ролл Филадельфия",
        desc: "Лосось, сливочный сыр, огурец",
        article_number: 150103,
        image_url: "/images/philadelphia.jpg",
        price: 500,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 250,
        },
      },
      {
        name: "Ролл Филадельфия в угре",
        desc: "Угорь, сливочный сыр, огурец, кунжут",
        article_number: 150104,
        image_url: "/images/philadelphia-and-eel.jpg",
        price: 480,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 220,
        },
      },
      {
        name: "Ролл Филадельфия с ананасом",
        desc: "Лосось, сливочный сыр, ананас",
        article_number: 279334,
        image_url: "/",
        price: 480,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
      },
      {
        name: "Ролл Аляска",
        desc: "Сливочный сыр, бекон, огурец, кунжут",
        article_number: 150105,
        image_url: "/images/alaska.png",
        price: 390,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 247,
        },
      },
      {
        name: "Ролл Камчатка",
        desc: "Лосось, сливочный сыр, тигровая креветка, огурец",
        article_number: 184144,
        image_url: "/images/roll-kamchatka.jpg",
        price: 520,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 257,
        },
      },
      {
        name: "Ролл Канада",
        desc: "Угорь, сливочный сыр, дайкон",
        article_number: 285829,
        image_url: "/",
        price: 480,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 290,
        },
      },
      {
        name: "Ролл с угрем в нори",
        desc: "Угорь, сливочный сыр, огурец, икра масаго",
        article_number: 285830,
        image_url: "/",
        price: 415,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 219,
        },
      },
      {
        name: "Ролл со снежным крабом в нори",
        desc: "Снежный краб, сливочный сыр, огурец, икра масаго, спайси соус",
        article_number: 285831,
        image_url: "/",
        price: 385,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 224,
        },
      },
      {
        name: "Ролл с креветкой в нори",
        desc: "Креветка, сливочный сыр, огурец, икра масаго, спайси соус",
        article_number: 285832,
        image_url: "/",
        price: 385,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 224,
        },
      },
      {
        name: "Ролл с лососем в нори",
        desc: "Лосось, сливочный сыр, огурец, икра масаго",
        article_number: 285833,
        image_url: "/",
        price: 395,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 219,
        },
      },
      {
        name: "Ролл Сахалин",
        desc: "Лосось, снежный краб, спайси соус, огурец",
        article_number: 184145,
        image_url: "/images/roll-sahalin.jpg",
        price: 510,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 262,
        },
      },
      {
        name: "Сладкий ролл шоколадно/фруктовый",
        desc: "Тесто харумаки, банан, киви, шоколадная паста, ананас, фруктовый топпинг",
        article_number: 184146,
        image_url: "/images/sladkiy-roll-shokoladnofruktovyy.jpg",
        price: 410,
        display: false,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
      },
      {
        name: "Сладкий ролл ванильно/фруктовый",
        desc: "Тесто харумаки, банан, киви, сыр Креметте, ананас, фруктовый топпинг",
        article_number: 184147,
        image_url: "/images/sladkiy-roll-vanilnofruktovyy.jpg",
        price: 370,
        categories: [classicRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
      },
      {
        name: "Запеченный ролл Асама",
        desc: "Сливочный сыр, тамаго, креветка, окунь, яки соус, кунжут, соус унаги",
        article_number: 145368,
        image_url: "/images/asama.png",
        price: 400,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 264,
        },
      },
      {
        name: "Запеченный ролл с курицей",
        desc: "Сливочный сыр, курица, огурец, сыр пармезан, соус унаги",
        article_number: 145369,
        image_url: "/images/z-chiken.jpg",
        price: 370,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 254,
        },
      },
      {
        name: "Запеченный ролл острый лосось",
        desc: "Сливочный сыр, огурец, тобико, лосось, спайси соус",
        article_number: 145370,
        image_url: "/images/z-o-salmon.jpg",
        price: 390,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 274,
        },
      },
      {
        name: "Запеченный ролл Безликий",
        desc: "Краб, тамаго, сыр чеддер, кунжут",
        article_number: 145371,
        image_url: "/images/faceless.jpg",
        price: 360,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 259,
        },
      },
      {
        name: "Запеченный ролл Румяный",
        desc: "Сливочный сыр, креветка, яки соус, кунжут, унаги соус, тамаго",
        article_number: 150114,
        image_url: "/images/rosy.jpg",
        price: 360,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 170,
        },
      },
      {
        name: "Запеченный ролл со снежный крабом",
        desc: "Снежный краб, сливочный сыр, соус шрирачи, яки соус",
        article_number: 150108,
        image_url: "/images/zapechennyy-roll-so-snezhnym-krabom.jpg",
        price: 370,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 299,
        },
      },
      {
        name: "Запеченный ролл с мидиями и сливочным сыром",
        desc: "Мидии, огурец, тамаго, спайси соус, сыр сливочный",
        article_number: 150109,
        image_url: "/images/zapechennyy-roll-s-midiyami-i-slivochnym-syrom.jpg",
        price: 390,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 247,
        },
      },
      {
        name: "Запеченный ролл с угрем",
        desc: "Угорь, авокадо, сливочный сыр, яки соус, тамаго",
        article_number: 150110,
        image_url: "/images/zapechennyy-roll-s-ugrem.jpg",
        price: 420,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 274,
        },
      },
      {
        name: "Запеченный ролл со снежным крабом и креветками",
        desc: "Креветки, тамаго, снежный краб, яки соус, огурец, икра тобико",
        article_number: 150115,
        image_url:
          "/images/zapechennyy-roll-so-snezhnym-krabom-i-krevetkami.jpg",
        price: 390,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 329,
        },
      },
      {
        name: "Запечёный ролл с креветкой",
        desc: "Сливочный сыр, креветка, яки соус, кунжут, унаги соус, тамаго, икра тобико",
        article_number: 145374,
        image_url: "/images/z-shrimp.jpg",
        price: 380,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 274,
        },
      },
      {
        name: "Запеченный ролл с лососем",
        desc: "Сливочный сыр, огурец, икра масаго, лосось, яки соус",
        article_number: 285810,
        image_url: "/images/zapechennyj-roll-losos.jpg",
        price: 390,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 274,
        },
      },
      {
        name: "Запеченный ролл со снежным крабом в нори",
        desc: "Снежный краб, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 285834,
        image_url: "/images/papech.jpg",
        price: 350,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с креветкой в нори",
        desc: "Креветка, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 285836,
        image_url: "/images/papech.jpg",
        price: 368,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с лососем в нори",
        desc: "Лосось, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 287929,
        image_url: "/images/papech.jpg",
        price: 378,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с мидиями в нори",
        desc: "Мидии, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 287931,
        image_url: "/images/papech.jpg",
        price: 360,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с окунем в нори",
        desc: "Окунь, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 287933,
        image_url: "/images/papech.jpg",
        price: 340,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с крабом и креветкой в нори",
        desc: "Снежный краб, креветка сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 287935,
        image_url: "/images/papech.jpg",
        price: 368,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с угрем в нори",
        desc: "Угорь, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 287937,
        image_url: "/images/papech.jpg",
        price: 380,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с беконом в нори",
        desc: "Бекон, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 287939,
        image_url: "/images/papech.jpg",
        price: 350,
        categories: [bakedRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        modifiers: [yakiSauce],
      },
      {
        name: "Темпурный ролл со снежным крабом",
        desc: "Сливочный сыр, снежный краб, огурцы, спайси соус, панировочные сухари, соус унаги, кунжут",
        article_number: 285804,
        image_url: "/images/tempur.jpg",
        price: 450,
        categories: [tempuraRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 280,
        },
      },
      {
        name: "Темпурный ролл с лососем",
        desc: "Сливочный сыр, лосось, огурцы, панировочные сухари, соус унаги, кунжут",
        article_number: 285805,
        image_url: "/images/tempur.jpg",
        price: 450,
        categories: [tempuraRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 280,
        },
      },
      {
        name: "Темпурный ролл с креветкой",
        desc: "Сливочный сыр, тигровая креветка, огурцы, панировочные сухари, соус унаги, кунжут",
        article_number: 285806,
        image_url: "/images/tempur.jpg",
        price: 450,
        categories: [tempuraRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 280,
        },
      },
      {
        name: "Темпурный ролл с угрем",
        desc: "Сливочный сыр, угорь, болгарский перец, панировочные сухари, соус унаги, кунжут",
        article_number: 285807,
        image_url: "/images/tempur.jpg",
        price: 450,
        categories: [tempuraRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 280,
        },
      },
      {
        name: "Темпурный ролл с курицей",
        desc: "Сливочный сыр, курица, сырный соус, огурцы, панировочные сухари, соус унаги, кунжут",
        article_number: 285809,
        image_url: "/images/tempur.jpg",
        price: 450,
        categories: [tempuraRolls],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 280,
        },
      },
      {
        name: "Дополнительный набор для суши",
        desc: "",
        article_number: 150010,
        image_url: "/images/dop-nabor.jpg",
        price: 50,
        categories: [addition],
      },
      {
        name: "Дополнительный спайси соус",
        desc: "",
        article_number: 140108,
        image_url: "/images/spacy-souce.png",
        price: 50,
        categories: [addition],
      },
      // SNACKS
      {
        name: "Мидии гигант (острые)",
        desc: "Cпайси соус, кунжут, унаги соус",
        article_number: 150232,
        image_url: "/images/midii-gigant-ostrye.jpg",
        price: 450,
        categories: [snacks],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
      },
      {
        name: "Мидии гигант (не острые)",
        desc: "Яки соус, кунжут, унаги соус",
        article_number: 155865,
        image_url: "/images/midii-gigant-ne-ostrye.jpg",
        price: 450,
        categories: [snacks],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
      },
      {
        name: "Мидии Гигант в сырном соусе",
        desc: "Сырный соус, кунжут, унаги соус",
        article_number: 285811,
        image_url: "/images/midii-v-syrnom-souse.jpg",
        price: 470,
        categories: [snacks],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
      },
      {
        name: "Креветки в темпуре",
        desc: "Тигровые креветки, панировочные сухари, соус Унаги, кунжут. Комплектуются спайси соусом в отдельном контейнере.",
        article_number: 287945,
        image_url: "/images/tigrovye-krevetki-v-tempure.jpg",
        price: 420,
        categories: [snacks],
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
      },
      // DRINKS
      {
        name: "Кола",
        desc: "",
        article_number: 145367,
        image_url: "/images/coca-cola.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 0.9,
        },
        price: 160,
        categories: [drink],
      },
      {
        name: "Кола",
        desc: "",
        article_number: 135679,
        image_url: "/images/cola-0.33.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 0.33,
        },
        price: 130,
        categories: [drink],
      },
      {
        name: "Сок яблочный",
        desc: "",
        article_number: 135767,
        image_url: "/images/apple-juice.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 1,
        },
        price: 170,
        categories: [drink],
      },
      {
        name: "Сок апельсиновый",
        desc: "",
        article_number: 135768,
        image_url: "/images/orange-juice.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 1,
        },
        price: 170,
        categories: [drink],
      },
      {
        name: "Сок вишневый",
        desc: "",
        article_number: 145365,
        image_url: "/images/cherry-juice.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 1,
        },
        price: 180,
        categories: [drink],
      },
      {
        name: "Сок мультифрукт",
        desc: "",
        article_number: 145366,
        image_url: "/images/multifruit-juice.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 1,
        },
        price: 170,
        categories: [drink],
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable("deliveries");
    await queryRunner.clearTable("discount_strategies");
    await queryRunner.clearTable("discounts");
    await queryRunner.clearTable("modifier_categories");
    await queryRunner.clearTable("modifiers");
    await queryRunner.clearTable("payments");
    await queryRunner.clearTable("product_categories");
    await queryRunner.clearTable("products");
    await queryRunner.clearTable("promotions");
    await queryRunner.clearTable("users");
    await queryRunner.clearTable("shopping_cart_settings");
  }
}
