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

export class initialSeed1662919340693 implements MigrationInterface {
  name = "initialSeed1662919340693";

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

    await users.create({
      name: "admin",
      salt: "$2a$10$eDXmKeQFddc2fbRidQ8KOO",
      password_hash:
        "$2a$10$eDXmKeQFddc2fbRidQ8KOOEoWlwr9LLKJvkqb15Vja89mrqoS8.Ii",
    });

    const [pizzasBy1299] = await discounts.createManyFrom([
      {
        name: "3 за 1299",
        type: DiscountTypeEnum.FIXED_PRICE,
        value: 1299,
      },
    ]);

    await deliveries.createManyFrom([
      {
        name: "Доставка пиццы от Кэпа",
        article_number: 10001,
        type: DeliveryTypeEnum.IN_CASH,
        value: 100,
        condition: {
          criteria: DeliveryCriteriaEnum.PRICE,
          op: DeliveryOperatorEnum.BETWEEN,
          value: 0,
          value2: 700,
        },
      },
      {
        name: "Бесплатная доставка пиццы от Кэпа",
        article_number: 10002,
        type: DeliveryTypeEnum.IN_CASH,
        value: 0,
        condition: {
          criteria: DeliveryCriteriaEnum.PRICE,
          op: DeliveryOperatorEnum.GREATER,
          value: 700,
        },
      },
    ]);

    await payments.createManyFrom([
      {
        code: 861,
        name: "Оплата наличными, без сдачи",
      },
      {
        code: 862,
        name: "Оплата наличными, необходима сдача",
      },
      {
        code: 863,
        name: "Оплата картой",
      },
    ]);

    await promotions.createManyFrom([
      {
        name: "Три любые пиццы на традиционном тесте за 1299 рублей",
        image_url: "/images/promo1.svg",
        display: true,
        display_position: 1,
      },
      {
        name: "Бесплатная доставка при заказе от 700 рублей",
        image_url: "/images/promo2.svg",
        display: true,
        display_position: 2,
      },
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

    const [traditionalDough, _, yakiSauce, __, weekdayCombo] =
      await modifiers.createManyFrom([
        {
          name: "Традиционное тесто",
          article_number: 10003,
          price: 0,
          category_uuid: dough.uuid,
          display: true,
          display_position: 1,
        },
        {
          name: "Пышное тесто",
          article_number: 10004,
          price: 50,
          category_uuid: dough.uuid,
          display: true,
          display_position: 2,
        },
        {
          name: "Яки соус",
          article_number: 10005,
          price: 0,
          category_uuid: sauce.uuid,
          display: true,
          display_position: 1,
        },
        {
          name: "Спайси соус",
          article_number: 10006,
          price: 0,
          category_uuid: sauce.uuid,
          display: true,
          display_position: 2,
        },
        {
          name: "Будний день",
          article_number: 10007,
          price: 0,
          category_uuid: kit.uuid,
          display: true,
          display_position: 1,
        },
        {
          name: "Выходной день",
          article_number: 10008,
          price: 200,
          category_uuid: kit.uuid,
          display: true,
          display_position: 2,
        },
        {
          name: "Без добавлений",
          article_number: 10097,
          price: 0,
          category_uuid: addPizzaItems.uuid,
          display: false,
          display_position: 0,
        },
        {
          name: "Чеддер и пармезан",
          image_url: "/images/cheese.png",
          article_number: 10096,
          price: 79,
          category_uuid: addPizzaItems.uuid,
          display: true,
          display_position: 1,
        },
      ]);

    const [pizza, combo, rolls, snacks, drink] =
      await productCategories.createManyFrom([
        {
          name: "Пиццы",
          image_url: "/images/pizza.svg",
          display_position: 1,
        },
        {
          name: "Наборы",
          image_url: "/images/combo.svg",
          display_position: 2,
        },
        {
          name: "Роллы",
          image_url: "/images/rolls.svg",
          display_position: 3,
        },
        {
          name: "Закуски",
          image_url: "/images/snacks.svg",
          display_position: 4,
        },
        {
          name: "Напитки",
          image_url: "/images/drink.svg",
          display_position: 5,
        },
      ]);

    await discountStrategies.create({
      discount_uuid: pizzasBy1299.uuid,
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
        article_number: 10009,
        image_url: "/images/margarita.png",
        price: 440,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 420,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Пепперони",
        desc: "Томатный соус, сыр моцарелла, салями пепперони",
        article_number: 10010,
        image_url: "/images/pepperoni.png",
        price: 510,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 470,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Карбонара",
        desc: "Cоус карбонара, сыр моцарелла, бекон",
        article_number: 10011,
        image_url: "/images/karbonara.png",
        price: 500,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 470,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Жульен",
        desc: "Cливочный соус, куриное филе, свежие шампиньоны, сыр моцарелла, сыр чеддер, зеленый лук",
        article_number: 10012,
        image_url: "/images/zhulen.png",
        price: 510,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 535,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца 4 сезона",
        desc: "Томатный соус, сыр моцарелла, салями пепперони, ветчина, куриное филе, сыр чеддер, сыр горгонзола",
        article_number: 10013,
        image_url: "/images/4-sezona.png",
        price: 490,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 520,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Прошутто-фунги",
        desc: "Томатный соус, сыр моцарелла, ветчина, свежие шампиньоны, свежие томаты",
        article_number: 10014,
        image_url: "/images/proshutto-fungi.png",
        price: 510,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 510,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Вегетарианская",
        desc: "Сыр моцарелла, томатный соус, свежие шампиньоны, корнишоны, болгарский перец, свежие томаты, красный лук",
        article_number: 10015,
        image_url: "/images/vegetarianskaya.png",
        price: 490,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 470,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца 4 сыра",
        desc: "Сливочный соус, сыр моцарелла, сыр чеддер, сыр горгонзола, сыр пармезан",
        article_number: 10016,
        image_url: "/images/4 cheeses.png",
        price: 510,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 470,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Поло",
        desc: "Томатный соус, сливочный соус, сыр моцарелла, болгарский перец, корнишоны, красный лук, куриное филе",
        article_number: 10017,
        image_url: "/images/polo.png",
        price: 510,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 530,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Неаполитана",
        desc: "Томатный соус, сыр моцарелла, свежие томаты, сыр пармезан, чеснок",
        article_number: 10018,
        image_url: "/images/neapolitan.png",
        price: 470,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 520,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Мясная",
        desc: "Томатный соус, сыр моцарелла, свинина, куриное филе, ветчина, паприка, красный лук",
        article_number: 10019,
        image_url: "/images/myasnaya.png",
        price: 510,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 740,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Барбекю",
        desc: "Соус барбекю, сыр чеддер, сыр моцарелла, бекон, свинина, красный лук",
        article_number: 10020,
        image_url: "/images/barbekyu.png",
        price: 520,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 530,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Острая",
        desc: "Томатный соус, сыр моцарелла, салями пепперони, халапеньо, колбаски охотничьи, красный лук",
        article_number: 10021,
        image_url: "/images/ostraya.png",
        price: 490,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 540,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Морская",
        desc: "Розовый соус, сыр моцарелла, креветки, мидии, лосось, снежный краб",
        article_number: 10022,
        image_url: "/images/marine.jpg",
        price: 530,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Охотничья",
        desc: "Розовый соус, сыр моцарелла, куриное филе, колбаски охотничьи, белый соус",
        article_number: 10023,
        image_url: "/images/hunting.jpg",
        price: 500,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Пивная",
        desc: "Томатный соус, сыр моцарелла, салями пепперони, ветчина, колбаски охотничьи, халапеньо",
        article_number: 10024,
        image_url: "/images/pivnaya.png",
        price: 490,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 635,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца от Кэпа",
        desc: "Розовый соус, сыр моцарелла, куриное филе, свинина, бекон, свежие томаты, свежие шампиньоны",
        article_number: 10025,
        image_url: "/images/ot-kepa.png",
        price: 530,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 715,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Ди-феста",
        desc: "Томатный соус, сыр моцарелла, свежие шампиньоны, свинина, красный лук, соус белый",
        article_number: 10026,
        image_url: "/images/di-festa.png",
        price: 520,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 540,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Гавайская с ветчиной",
        desc: "Розовый соус, сыр моцарелла, ветчина, ананас",
        article_number: 10027,
        image_url: "/images/hawaiian-with-ham.jpg",
        price: 500,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 630,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Гавайская с курицей",
        desc: "Розовый соус, сыр моцарелла, курица, ананас",
        article_number: 10028,
        image_url: "/images/hawaiian-with-chicken.jpg",
        price: 510,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 650,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Детская",
        desc: "Томатный соус, соус белый, сыр моцарелла, сосиски",
        article_number: 10029,
        image_url: "/images/detskaya.png",
        price: 420,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 440,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца 4 сезона бьянко",
        desc: "Сливочный соус, сыр моцарелла, пепперони, ветчина, куриное филе, чеддер, сыр горгонзола",
        article_number: 10030,
        image_url: "/images/4-seasons-bianco.png",
        price: 490,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 520,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Пепперони бьянко",
        desc: "Сливочный соус, сыр моцарелла, пепперони",
        article_number: 10031,
        image_url: "/images/pepperoni-bianco.jpg",
        price: 510,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 470,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Мясная бьянко",
        desc: "Сливочный соус, сыр моцарелла, ветчина, свинина, куриное филе, паприка, красный лук",
        article_number: 10032,
        image_url: "/images/meat-bianco.jpg",
        price: 510,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 740,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Прошутто-фунги бьянко",
        desc: "Сливочный соус, сыр моцарелла, ветчина, свежие шампиньоны, свежие томаты",
        article_number: 10033,
        image_url: "/images/prosciutto-fungi-bianco.jpg",
        price: 510,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 510,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Сборная",
        desc: "Сливочный соус, сыр моцарелла, сыр пармезан, сыр чеддер, бекон, охотничьи колбаски, халапеньо",
        article_number: 10034,
        image_url: "/",
        price: 520,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 600,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Пушкинская",
        desc: "Сливочный соус, сыр моцарелла, красный лук, охотничьи колбаски, бекон, корнишоны",
        article_number: 10035,
        image_url: "/",
        price: 510,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 600,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      {
        name: "Пицца Пармеджано",
        desc: "Сливочный соус, сыр моцарелла, пепперони, пармезан, колбаски охотничьи, халапеньо, ветчина",
        article_number: 10036,
        image_url: "/",
        price: 550,
        category_uuid: pizza.uuid,
        volume: {
          type: ProductVolumeTypeEnum.DIAMETER,
          value: 30,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 540,
        },
        tags: [],
        modifiers: [traditionalDough],
      },
      // COMBO
      {
        name: "Название Италия-Япония 1:3",
        desc: "Пицца пушкинская, запеченный ролл мини лосось, запеченный ролл мини с креветкой, запеченный ролл мини с крабом",
        article_number: 10037,
        image_url: "/images/nabor-1.jpg",
        price: 1000,
        category_uuid: combo.uuid,
        tags: [],
        modifiers: [weekdayCombo],
      },
      // ROLLS
      {
        name: "Ролл сливочный лосось",
        desc: "Лосось, сливочный сыр, огурец, икра тобико",
        article_number: 10038,
        image_url: "/images/creamy.jpg",
        price: 360,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 240,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл мини угорь",
        article_number: 10039,
        image_url: "/images/m-acne.jpg",
        price: 240,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 105,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл острый мини лосось",
        article_number: 10040,
        image_url: "/images/o-m-salmon.jpg",
        price: 240,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 100,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл мини с Лососем",
        article_number: 10041,
        image_url: "/images/r-salmon.jpg",
        price: 240,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 100,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл с огурцом",
        article_number: 10042,
        image_url: "/images/cucumber.jpg",
        price: 130,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 100,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл острый мини угорь",
        article_number: 10043,
        image_url: "/images/o-m-acne.jpg",
        price: 240,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 110,
        },
        tags: ["классические:1"],
      },
      {
        name: "Мини ролл с креветкой",
        article_number: 10044,
        image_url: "/images/mini-roll-s-krevetkoy.jpg",
        price: 240,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 6,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 110,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл Чикен спайси",
        desc: "Cливочный сыр, кунжут, курица, спайси соус",
        article_number: 10045,
        image_url: "/images/spicy-chicken.jpg",
        price: 340,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 269,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл Калифорния с лососем",
        desc: "Лосось, огурец, икра тобико, авокадо, яки соус",
        article_number: 10046,
        image_url: "/images/california-salmon.png",
        price: 380,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 229,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл Калифорния со снежным крабом",
        desc: "Снежный краб, огурец, икра тобико, авокадо, яки соус",
        article_number: 10047,
        image_url: "/images/california-crab.png",
        price: 360,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 220,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл Филадельфия",
        desc: "Лосось, сливочный сыр, огурец",
        article_number: 10048,
        image_url: "/images/philadelphia.jpg",
        price: 390,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 250,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл Филадельфия в угре",
        desc: "Угорь, сливочный сыр, огурец, кунжут",
        article_number: 10049,
        image_url: "/images/philadelphia-and-eel.jpg",
        price: 420,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 220,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл Филадельфия с ананасом",
        desc: "Лосось, сливочный сыр, ананас",
        article_number: 10050,
        image_url: "/",
        price: 390,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл Аляска",
        desc: "Сливочный сыр, бекон, огурец, кунжут",
        article_number: 10051,
        image_url: "/images/alaska.png",
        price: 320,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 247,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл Камчатка",
        desc: "Лосось, сливочный сыр, тигровая креветка, огурец",
        article_number: 10052,
        image_url: "/images/roll-kamchatka.jpg",
        price: 420,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 257,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл Канада",
        desc: "Угорь, сливочный сыр, дайкон",
        article_number: 10053,
        image_url: "/",
        price: 420,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 290,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл с угрем в нори",
        desc: "Угорь, сливочный сыр, огурец, икра масаго",
        article_number: 10054,
        image_url: "/",
        price: 360,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 219,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл со снежным крабом в нори",
        desc: "Снежный краб, сливочный сыр, огурец, икра масаго, спайси соус",
        article_number: 10055,
        image_url: "/",
        price: 280,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 224,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл с креветкой в нори",
        desc: "Креветка, сливочный сыр, огурец, икра масаго, спайси соус",
        article_number: 10056,
        image_url: "/",
        price: 300,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 224,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл с лососем в нори",
        desc: "Лосось, сливочный сыр, огурец, икра масаго",
        article_number: 10057,
        image_url: "/",
        price: 320,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 219,
        },
        tags: ["классические:1"],
      },
      {
        name: "Ролл Сахалин",
        desc: "Лосось, снежный краб, спайси соус, огурец",
        article_number: 10058,
        image_url: "/images/roll-sahalin.jpg",
        price: 390,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 262,
        },
        tags: ["классические:1"],
      },
      {
        name: "Сладкий ролл шоколадно/фруктовый",
        desc: "Тесто харумаки, банан, киви, шоколадная паста, ананас, фруктовый топпинг",
        article_number: 10059,
        image_url: "/images/sladkiy-roll-shokoladnofruktovyy.jpg",
        price: 340,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        tags: ["классические:1"],
      },
      {
        name: "Сладкий ролл ванильно/фруктовый",
        desc: "Тесто харумаки, банан, киви, сыр Креметте, ананас, фруктовый топпинг",
        article_number: 10060,
        image_url: "/images/sladkiy-roll-vanilnofruktovyy.jpg",
        price: 310,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        tags: ["классические:1"],
      },
      {
        name: "Запеченный ролл Асама",
        desc: "Сливочный сыр, тамаго, креветка, окунь, яки соус, кунжут, соус унаги",
        article_number: 10061,
        image_url: "/images/asama.png",
        price: 340,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 264,
        },
        tags: ["запеченные:2"],
      },
      {
        name: "Запеченный ролл с курицей",
        desc: "Сливочный сыр, курица, огурец, сыр пармезан, соус унаги",
        article_number: 10062,
        image_url: "/images/z-chiken.jpg",
        price: 310,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 254,
        },
        tags: ["запеченные:2"],
      },
      {
        name: "Запеченный ролл острый лосось",
        desc: "Сливочный сыр, огурец, тобико, лосось, спайси соус",
        article_number: 10063,
        image_url: "/images/z-o-salmon.jpg",
        price: 370,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 274,
        },
        tags: ["запеченные:2"],
      },
      {
        name: "Запеченный ролл Безликий",
        desc: "Краб, тамаго, сыр чеддер, кунжут",
        article_number: 10064,
        image_url: "/images/faceless.jpg",
        price: 290,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 259,
        },
        tags: ["запеченные:2"],
      },
      {
        name: "Запеченный ролл Румяный",
        desc: "Сливочный сыр, креветка, яки соус, кунжут, унаги соус, тамаго",
        article_number: 10065,
        image_url: "/images/rosy.jpg",
        price: 290,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 170,
        },
        tags: ["запеченные:2"],
      },
      {
        name: "Запеченный ролл со снежный крабом",
        desc: "Снежный краб, сливочный сыр, соус шрирачи, яки соус",
        article_number: 10066,
        image_url: "/images/zapechennyy-roll-so-snezhnym-krabom.jpg",
        price: 290,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 299,
        },
        tags: ["запеченные:2"],
      },
      {
        name: "Запеченный ролл с мидиями и сливочным сыром",
        desc: "Мидии, огурец, тамаго, спайси соус, сыр сливочный",
        article_number: 10067,
        image_url: "/images/zapechennyy-roll-s-midiyami-i-slivochnym-syrom.jpg",
        price: 330,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 247,
        },
        tags: ["запеченные:2"],
      },
      {
        name: "Запеченный ролл с угрем",
        desc: "Угорь, авокадо, сливочный сыр, яки соус, тамаго",
        article_number: 10068,
        image_url: "/images/zapechennyy-roll-s-ugrem.jpg",
        price: 390,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 274,
        },
        tags: ["запеченные:2"],
      },
      {
        name: "Запеченный ролл со снежным крабом и креветками",
        desc: "Креветки, тамаго, снежный краб, яки соус, огурец, икра тобико",
        article_number: 10069,
        image_url:
          "/images/zapechennyy-roll-so-snezhnym-krabom-i-krevetkami.jpg",
        price: 360,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 329,
        },
        tags: ["запеченные:2"],
      },
      {
        name: "Запечёный ролл с креветкой",
        desc: "Сливочный сыр, креветка, яки соус, кунжут, унаги соус, тамаго, икра тобико",
        article_number: 10070,
        image_url: "/images/z-shrimp.jpg",
        price: 350,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 274,
        },
        tags: ["запеченные:2"],
      },
      {
        name: "Запеченный ролл с лососем",
        desc: "Сливочный сыр, огурец, икра масаго, лосось, яки соус",
        article_number: 10071,
        image_url: "/images/zapechennyj-roll-losos.jpg",
        price: 370,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 274,
        },
        tags: ["запеченные:2"],
      },
      {
        name: "Запеченный ролл со снежным крабом в нори",
        desc: "Снежный краб, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 10072,
        image_url: "/images/papech.jpg",
        price: 290,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        tags: ["запеченные:2"],
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с креветкой в нори",
        desc: "Креветка, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 10073,
        image_url: "/images/papech.jpg",
        price: 308,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        tags: ["запеченные:2"],
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с лососем в нори",
        desc: "Лосось, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 10074,
        image_url: "/images/papech.jpg",
        price: 328,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        tags: ["запеченные:2"],
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с мидиями в нори",
        desc: "Мидии, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 10075,
        image_url: "/images/papech.jpg",
        price: 290,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        tags: ["запеченные:2"],
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с окунем в нори",
        desc: "Окунь, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 10076,
        image_url: "/images/papech.jpg",
        price: 290,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        tags: ["запеченные:2"],
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с крабом и креветкой в нори",
        desc: "Снежный краб, креветка сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 10077,
        image_url: "/images/papech.jpg",
        price: 308,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        tags: ["запеченные:2"],
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с угрем в нори",
        desc: "Угорь, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 10078,
        image_url: "/images/papech.jpg",
        price: 350,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        tags: ["запеченные:2"],
        modifiers: [yakiSauce],
      },
      {
        name: "Запеченный ролл с беконом в нори",
        desc: "Бекон, сливочный сыр, огурец, омлет, унаги, кунжут",
        article_number: 10079,
        image_url: "/images/papech.jpg",
        price: 280,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 270,
        },
        tags: ["запеченные:2"],
        modifiers: [yakiSauce],
      },
      {
        name: "Темпурный ролл со снежным крабом",
        desc: "Сливочный сыр, снежный краб, огурцы, спайси соус, панировочные сухари, соус унаги, кунжут",
        article_number: 10080,
        image_url: "/images/tempur.jpg",
        price: 390,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 280,
        },
        tags: ["в темпуре:3"],
      },
      {
        name: "Темпурный ролл с лососем",
        desc: "Сливочный сыр, лосось, огурцы, панировочные сухари, соус унаги, кунжут",
        article_number: 10081,
        image_url: "/images/tempur.jpg",
        price: 390,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 280,
        },
        tags: ["в темпуре:3"],
      },
      {
        name: "Темпурный ролл с креветкой",
        desc: "Сливочный сыр, тигровая креветка, огурцы, панировочные сухари, соус унаги, кунжут",
        article_number: 10082,
        image_url: "/images/tempur.jpg",
        price: 390,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 280,
        },
        tags: ["в темпуре:3"],
      },
      {
        name: "Темпурный ролл с угрем",
        desc: "Сливочный сыр, угорь, болгарский перец, панировочные сухари, соус унаги, кунжут",
        article_number: 10083,
        image_url: "/images/tempur.jpg",
        price: 390,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 280,
        },
        tags: ["в темпуре:3"],
      },
      {
        name: "Темпурный ролл с курицей",
        desc: "Сливочный сыр, курица, сырный соус, огурцы, панировочные сухари, соус унаги, кунжут",
        article_number: 10084,
        image_url: "/images/tempur.jpg",
        price: 390,
        category_uuid: rolls.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 8,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 280,
        },
        tags: ["в темпуре:3"],
      },
      {
        name: "Дополнительный набор для суши",
        desc: "",
        article_number: 10085,
        image_url: "/images/dop-nabor.jpg",
        price: 50,
        category_uuid: rolls.uuid,
        tags: ["#Дополнительно:4"],
      },
      // SNACKS
      {
        name: "Мидии гигант (острые)",
        desc: "Cпайси соус, кунжут, унаги соус",
        article_number: 10086,
        image_url: "/images/midii-gigant-ostrye.jpg",
        price: 400,
        category_uuid: snacks.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
        tags: [],
      },
      {
        name: "Мидии гигант (не острые)",
        desc: "Яки соус, кунжут, унаги соус",
        article_number: 10087,
        image_url: "/images/midii-gigant-ne-ostrye.jpg",
        price: 400,
        category_uuid: snacks.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
        tags: [],
      },
      {
        name: "Мидии Гигант в сырном соусе",
        desc: "Сырный соус, кунжут, унаги соус",
        article_number: 10088,
        image_url: "/images/midii-v-syrnom-souse.jpg",
        price: 440,
        category_uuid: snacks.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
        tags: [],
      },
      {
        name: "Креветки в темпуре",
        desc: "Тигровые креветки, панировочные сухари, соус Унаги, кунжут. Комплектуются спайси соусом в отдельном контейнере.",
        article_number: 10089,
        image_url: "/images/tigrovye-krevetki-v-tempure.jpg",
        price: 390,
        category_uuid: snacks.uuid,
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 5,
        },
        tags: [],
      },
      // DRINKS
      {
        name: "Кола",
        desc: "",
        article_number: 10090,
        image_url: "/images/coca-cola.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 0.9,
        },
        price: 125,
        category_uuid: drink.uuid,
        tags: [],
      },
      {
        name: "Кола",
        desc: "",
        article_number: 10091,
        image_url: "/images/cola-0.33.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 0.33,
        },
        price: 60,
        category_uuid: drink.uuid,
        tags: [],
      },
      {
        name: "Сок яблочный",
        desc: "",
        article_number: 10092,
        image_url: "/images/apple-juice.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 1,
        },
        price: 130,
        category_uuid: drink.uuid,
        tags: [],
      },
      {
        name: "Сок апельсиновый",
        desc: "",
        article_number: 10093,
        image_url: "/images/orange-juice.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 1,
        },
        price: 130,
        category_uuid: drink.uuid,
        tags: [],
      },
      {
        name: "Сок вишневый",
        desc: "",
        article_number: 10094,
        image_url: "/images/cherry-juice.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 1,
        },
        price: 140,
        category_uuid: drink.uuid,
        tags: [],
      },
      {
        name: "Сок мультифрукт",
        desc: "",
        article_number: 10095,
        image_url: "/images/multifruit-juice.png",
        weight: {
          type: ProductWeightTypeEnum.LITERS,
          value: 1,
        },
        price: 130,
        category_uuid: drink.uuid,
        tags: [],
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
  }
}
