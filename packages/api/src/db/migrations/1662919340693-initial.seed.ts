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

    await users.seed({
      name: "admin",
      salt: "$2a$10$eDXmKeQFddc2fbRidQ8KOO",
      password_hash:
        "$2a$10$eDXmKeQFddc2fbRidQ8KOOEoWlwr9LLKJvkqb15Vja89mrqoS8.Ii",
    });

    const [pizzasBy1299] = await discounts.seeds([
      {
        name: "3 за 1299",
        type: DiscountTypeEnum.FIXED_PRICE,
        value: 1299,
      },
    ]);

    deliveries.seeds([
      {
        name: "Доставка пиццы от Кэпа",
        //article_number: 0,
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
        //article_number: 0,
        type: DeliveryTypeEnum.IN_CASH,
        value: 0,
        condition: {
          criteria: DeliveryCriteriaEnum.PRICE,
          op: DeliveryOperatorEnum.GREATER,
          value: 700,
        },
      },
    ]);

    await promotions.seeds([
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

    const [dough, sauce, kit] = await modifierCategories.seeds([
      {
        name: "Тесто",
        image_url: "",
        display_position: 1,
      },
      {
        name: "Соус",
        image_url: "",
        display_position: 1,
      },
      {
        name: "Набор",
        image_url: "",
        display_position: 1,
      },
    ]);

    const [traditionalDough, _, yakiSauce, __, weekdayCombo] =
      await modifiers.seeds([
        {
          name: "Традиционное",
          display_position: 1,
          price: 0,
          category_uuid: dough.uuid,
        },
        {
          name: "Пышное",
          display_position: 2,
          price: 50,
          category_uuid: dough.uuid,
        },
        {
          name: "Яки соус",
          display_position: 1,
          price: 0,
          category_uuid: sauce.uuid,
        },
        {
          name: "Спайси соус",
          display_position: 2,
          price: 0,
          category_uuid: sauce.uuid,
        },
        {
          name: "Будний день",
          display_position: 1,
          price: 0,
          category_uuid: kit.uuid,
        },
        {
          name: "Выходной день",
          display_position: 2,
          price: 200,
          category_uuid: kit.uuid,
        },
      ]);

    const [pizza, combo, rolls, snacks, drink] = await productCategories.seeds([
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

    await discountStrategies.seed({
      discount_uuid: pizzasBy1299.uuid,
      condition: {
        criteria: DiscountCriteriaEnum.COUNT,
        op: DiscountOperatorEnum.EQUAL,
        value: 3,
      },
      modifiers: [traditionalDough],
      product_categories: [pizza],
    });

    await products.seeds([
      {
        name: "Пицца Маргарита",
        desc: "Томатный соус, сыр моцарелла, базилик",
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
        image_url: "/images/M-acne.jpg",
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
        // article_number: 0,
        image_url: "/images/O-M-salmon.jpg",
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
        // article_number: 0,
        image_url: "/images/R-salmon.jpg",
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
        // article_number: 0,
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
        // article_number: 0,
        image_url: "/images/O-M-acne.jpg",
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
        image_url: "/images/Asama.png",
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
        // article_number: 0,
        image_url: "/images/Z-chiken.jpg",
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
        // article_number: 0,
        image_url: "/images/Z-O-salmon.jpg",
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
        image_url: "/images/Z-shrimp.jpg",
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
        image_url: "/images/dop-nabor.jpg",
        price: 50,
        category_uuid: rolls.uuid,
        tags: ["Дополнительно:4"],
      },
      // SNACKS
      {
        name: "Мидии гигант (острые)",
        desc: "Cпайси соус, кунжут, унаги соус",
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        // article_number: 0,
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
        name: "Кола 0,9л",
        desc: "",
        // article_number: 0,
        image_url: "/images/coca-cola.png",
        price: 125,
        category_uuid: drink.uuid,
        tags: [],
      },
      {
        name: "Кола 0,33л",
        desc: "",
        // article_number: 0,
        image_url: "/images/Cola-0.33.png",
        price: 60,
        category_uuid: drink.uuid,
        tags: [],
      },
      {
        name: "Сок яблочный 1л",
        desc: "",
        // article_number: 0,
        image_url: "/images/Apple-juice.png",
        price: 130,
        category_uuid: drink.uuid,
        tags: [],
      },
      {
        name: "Сок апельсиновый 1л",
        desc: "",
        // article_number: 0,
        image_url: "/images/Orange-juice.png",
        price: 130,
        category_uuid: drink.uuid,
        tags: [],
      },
      {
        name: "Сок вишневый 1л",
        desc: "",
        // article_number: 0,
        image_url: "/images/Сherry-juice.png",
        price: 140,
        category_uuid: drink.uuid,
        tags: [],
      },
      {
        name: "Сок мультифрукт 1л",
        desc: "",
        // article_number: 0,
        image_url: "/images/Multifruit-juice.png",
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
