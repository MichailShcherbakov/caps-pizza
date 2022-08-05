import { faker } from "@faker-js/faker";
import ModifierEntity from "~/db/entities/modifier.entity";
import ProductEntity from "~/db/entities/product.entity";
import createModifierCategoriesHelper from "~/modules/modifiers/modules/categories/__tests__/helpers/create-modifier-categories.helper";
import createModifiersHelper from "~/modules/modifiers/__tests__/helpers/create-modifiers.helper";
import createProductCategoriesHelper from "~/modules/products/modules/categories/__tests__/helpers/create-categories.helper";
import createProductsHelper from "~/modules/products/__tests__/helpers/create-products.helper";
import {
  FrontPadResponse,
  MakeAnOrderDto,
  OrderedProduct,
  PaymentType,
} from "../orders.dto";
import OrdersService, { FIXED_MODIFIER_COUNT } from "../orders.service";
import Api from "./helpers/api.helper";
import TestingModule from "./helpers/testing-module.helper";

interface IFormDataMock {
  append: jest.Mock;
}

function FormDataMock() {
  this.append = jest.fn();
}

jest.mock("form-data", () => FormDataMock);

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
      .mockImplementation(() =>
        Promise.resolve<FrontPadResponse>({} as FrontPadResponse)
      );
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

      const payload = sendToFrontPadFunc.mock.calls[0][0] as IFormDataMock;

      let currentProductIndex = 0;
      let callsCount = 0;

      for (const product of dto.products) {
        const foundProduct = products.find(
          p => p.uuid === product.uuid
        ) as ProductEntity;

        const productIndex = currentProductIndex++;

        expect(payload.append).toBeCalledWith(
          `product[${productIndex}]`,
          foundProduct.article_number
        );
        expect(payload.append).toBeCalledWith(
          `product_kol[${productIndex}]`,
          product.count
        );
        expect(payload.append).toBeCalledWith(
          `product_price[${productIndex}]`,
          foundProduct.price
        );

        callsCount += 3;

        for (const modifier of product.modifiers) {
          const foundModifier = modifiers.find(
            m => m.uuid === modifier.uuid
          ) as ModifierEntity;

          const modifierIndex = currentProductIndex++;

          expect(payload.append).toBeCalledWith(
            `product[${modifierIndex}]`,
            foundModifier.article_number
          );
          expect(payload.append).toBeCalledWith(
            `product_kol[${modifierIndex}]`,
            FIXED_MODIFIER_COUNT
          );
          expect(payload.append).toBeCalledWith(
            `product_price[${modifierIndex}]`,
            foundModifier.price
          );
          expect(payload.append).toBeCalledWith(
            `product_mod[${modifierIndex}]`,
            productIndex
          );

          callsCount += 4;
        }
      }

      expect(payload.append).toBeCalledWith("sale", 0);
      expect(payload.append).toBeCalledWith("sale_amount", 0);
      expect(payload.append).toBeCalledWith(
        "street",
        dto.delivery_address.street
      );
      expect(payload.append).toBeCalledWith("home", dto.delivery_address.house);
      expect(payload.append).toBeCalledWith(
        "pod",
        dto.delivery_address.entrance
      );
      expect(payload.append).toBeCalledWith("et", dto.delivery_address.floor);
      expect(payload.append).toBeCalledWith(
        "apart",
        dto.delivery_address.apartment
      );
      expect(payload.append).toBeCalledWith("name", dto.client_info.name);
      expect(payload.append).toBeCalledWith("phone", dto.client_info.phone);
      expect(payload.append).toBeCalledWith("mail", dto.client_info.mail || "");
      expect(payload.append).toBeCalledWith("descr", dto.description || "");

      callsCount += 11;

      expect(payload.append).toBeCalledTimes(callsCount);
    });
  });
});
