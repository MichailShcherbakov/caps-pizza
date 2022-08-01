import { faker } from "@faker-js/faker";
import ModifierEntity from "~/db/entities/modifier.entity";
import ProductEntity from "~/db/entities/product.entity";
import createModifierCategoriesHelper from "~/modules/modifiers/modules/categories/__tests__/helpers/create-modifier-categories.helper";
import createModifiersHelper from "~/modules/modifiers/__tests__/helpers/create-modifiers.helper";
import createProductCategoriesHelper from "~/modules/products/modules/categories/__tests__/helpers/create-categories.helper";
import createProductsHelper from "~/modules/products/__tests__/helpers/create-products.helper";
import {
  FrontPadPayload,
  MakeAnOrderDto,
  OrderedProduct,
  PaymentType,
} from "../orders.dto";
import OrdersService, { FIXED_MODIFIER_COUNT } from "../orders.service";
import Api from "./helpers/api.helper";
import TestingModule from "./helpers/testing-module.helper";

describe("[Orders Module] ...", () => {
  let testingModule: TestingModule;
  let api: Api;
  let products: ProductEntity[];
  let modifiers: ModifierEntity[];
  let sendToFrontPadFunc: jest.SpyInstance;

  beforeAll(async () => {
    testingModule = new TestingModule();

    await testingModule.init();

    api = new Api(testingModule.app);

    await testingModule.clearDataSource();

    const entities = await Promise.all<
      [Promise<ProductEntity[]>, Promise<ModifierEntity[]>]
    >([
      new Promise((res, rej) => {
        createProductCategoriesHelper(testingModule.dataSource)
          .then(categories =>
            createProductsHelper(testingModule.dataSource, categories)
          )
          .then(products => res(products))
          .catch(e => rej(e));
      }),
      new Promise((res, rej) => {
        createModifierCategoriesHelper(testingModule.dataSource)
          .then(categories =>
            createModifiersHelper(testingModule.dataSource, categories)
          )
          .then(modifiers => res(modifiers))
          .catch(e => rej(e));
      }),
    ]);

    products = entities[0];
    modifiers = entities[1];

    const orderService = testingModule.app.get<OrdersService>(OrdersService);

    sendToFrontPadFunc = jest
      .spyOn(orderService, "sendToFrontPad")
      .mockImplementation(() => ({} as any));
  });

  afterAll(async () => {
    await testingModule.clearDataSource();
    await testingModule.drop();
  });

  describe("[Post] /orders", () => {
    it("should correct make an order", async () => {
      const orderedProducts = products.slice(2, 7);
      const usedModifiers = modifiers.slice(1, 5);

      const dto: MakeAnOrderDto = {
        products: orderedProducts.map<OrderedProduct>(p => ({
          uuid: p.uuid,
          count: faker.datatype.number({ max: 10, min: 1 }),
          modifiers: [
            usedModifiers[
              faker.datatype.number({ min: 0, max: usedModifiers.length - 1 })
            ],
          ],
        })),
        delivery_address: {
          street: faker.datatype.string(),
          house: faker.datatype.string(),
          entrance: faker.datatype.number({ max: 99, min: 0 }),
          floor: faker.datatype.number({ max: 99, min: 0 }),
          apartment: faker.datatype.number({ max: 99, min: 0 }),
        },
        payment: {
          type: PaymentType.IN_CASH,
        },
        client_info: {
          name: faker.datatype.string(),
          phone: faker.datatype.string(),
        },
      };

      const makeAnOrderResponse = await api.makeAnOrder(dto);

      expect(makeAnOrderResponse.status).toEqual(201);
      expect(makeAnOrderResponse.body).toEqual({
        statusCode: 201,
        data: makeAnOrderResponse.body.data,
      });

      const productArticleNumbers: Record<number, number> = {};
      const productPrice: Record<number, number> = {};
      const productCount: Record<number, number> = {};
      const productModifiers: Record<number, number> = {};

      for (const product of dto.products) {
        const foundProduct = orderedProducts.find(
          p => p.uuid === product.uuid
        ) as ProductEntity;

        const productIndex = Object.keys(productArticleNumbers).length;

        productArticleNumbers[productIndex] = foundProduct.article_number;
        productPrice[productIndex] = foundProduct.price;
        productCount[productIndex] = product.count;

        for (const modifier of product.modifiers) {
          const foundModifier = usedModifiers.find(
            m => m.uuid === modifier.uuid
          ) as ModifierEntity;

          const modifierIndex = Object.keys(productArticleNumbers).length;

          productArticleNumbers[modifierIndex] = foundModifier.article_number;
          productPrice[modifierIndex] = foundModifier.price;
          productCount[modifierIndex] = FIXED_MODIFIER_COUNT;
          productModifiers[modifierIndex] = productIndex;
        }
      }

      expect(sendToFrontPadFunc).toBeCalledWith({
        product: productArticleNumbers,
        product_kol: productCount,
        product_price: productPrice,
        product_mod: productModifiers,
        street: dto.delivery_address.street,
        home: dto.delivery_address.house,
        pod: dto.delivery_address.entrance,
        et: dto.delivery_address.floor,
        apart: dto.delivery_address.apartment,
        name: dto.client_info.name,
        phone: dto.client_info.phone,
        mail: dto.client_info.mail,
        descr: dto.description,
        sale: 0,
        sale_amount: 0,
        tags: [],
      } as FrontPadPayload);
    });
  });
});
