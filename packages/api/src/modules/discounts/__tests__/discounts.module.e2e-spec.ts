import { faker } from "@faker-js/faker";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import ModifierEntity from "~/db/entities/modifier.entity";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import ProductEntity from "~/db/entities/product.entity";
import ModifiersService from "~/modules/modifiers/modifiers.service";
import createModifierCategoriesHelper from "~/modules/modifiers/modules/categories/__tests__/helpers/create-modifier-categories.helper";
import createModifiersHelper from "~/modules/modifiers/__tests__/helpers/create-modifiers.helper";
import ProductCategoriesService from "~/modules/products/modules/categories/categories.service";
import createProductCategoriesHelper from "~/modules/products/modules/categories/__tests__/helpers/create-categories.helper";
import ProductsService from "~/modules/products/products.service";
import createProductsHelper from "~/modules/products/__tests__/helpers/create-products.helper";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/__tests__/helpers/delete-object-props.helper";
import { CreateDiscountDto, UpdateDiscountDto } from "../discounts.dto";
import DiscountsService from "../discounts.service";
import Api from "./helpers/api.helper";
import createDiscountsHelper, {
  createDiscountHelper,
  createDiscountStrategyHelper,
} from "./helpers/create-discounts.helper";
import TestingModule from "./helpers/testing-module.helper";

describe("[Discounts Module] ...", () => {
  let testingModule: TestingModule;
  let api: Api;
  let productCategories: ProductCategoryEntity[];
  let products: ProductEntity[];
  let modifiers: ModifierEntity[];

  beforeAll(async () => {
    testingModule = new TestingModule();

    await testingModule.init();

    api = new Api(testingModule.app);

    await api.init();

    productCategories = await createProductCategoriesHelper(testingModule);
    products = await createProductsHelper(testingModule, productCategories);

    const modifierCategories = await createModifierCategoriesHelper(
      testingModule
    );
    modifiers = await createModifiersHelper(testingModule, modifierCategories);
  });

  afterEach(async () => {
    await testingModule.clearDataSource();
  });

  afterAll(async () => {
    await testingModule.drop();
  });

  describe("[Get] /discounts", () => {
    it("should return all exists discounts", async () => {
      const discounts = await createDiscountsHelper(testingModule);

      const getDiscountsResponse = await api.getDiscounts();

      expect(getDiscountsResponse.status).toEqual(200);
      expect(getDiscountsResponse.body).toEqual({
        statusCode: 200,
        data: DiscountsService.sort(discounts),
      });
    });

    it("should return a special discount", async () => {
      const discounts = await createDiscountsHelper(testingModule);
      const discount = discounts[2];

      const getDiscountResponse = await api.getDiscount(discount.uuid);

      expect(getDiscountResponse.status).toEqual(200);
      expect(getDiscountResponse.body).toEqual({
        statusCode: 200,
        data: discount,
      });
    });

    it("should throw an error when the discount does not exist", async () => {
      const fakerDiscountUUID = faker.datatype.uuid();

      const getDiscountResponse = await api.getDiscount(fakerDiscountUUID);

      expect(getDiscountResponse.status).toEqual(404);
      expect(getDiscountResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The discount ${fakerDiscountUUID} does not exist`,
      });
    });
  });

  describe("[Post] /discounts", () => {
    it("should successfully create a discount with products", async () => {
      const chosenProducts = ProductsService.sort([
        products[2],
        products[1],
        products[6],
      ]);

      const dto: CreateDiscountDto = {
        name: faker.word.adjective(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            products_uuids: chosenProducts.map(p => p.uuid),
            product_categories_uuids: [],
            modifiers_uuids: [],
          },
        ],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(201);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 201,
        data: {
          uuid: createDiscountResponse.body.data.uuid,
          ...dto,
          strategies: dto.strategies.map((strategy, idx) =>
            deleteObjectPropsHelper(
              {
                ...strategy,
                uuid: createDiscountResponse.body.data.strategies[idx].uuid,
                discount_uuid: createDiscountResponse.body.data.uuid,
                products: deleteObjectsPropsHelper(chosenProducts, [
                  "category",
                  "modifiers",
                ]),
                product_categories: [],
                modifiers: [],
              },
              ["products_uuids", "product_categories_uuids", "modifiers_uuids"]
            )
          ),
        },
      });
    });

    it("should successfully create a discount with product categories", async () => {
      const chosenProductCategories = ProductCategoriesService.sort([
        productCategories[2],
        productCategories[1],
        productCategories[6],
      ]);

      const dto: CreateDiscountDto = {
        name: faker.word.adjective(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            products_uuids: [],
            product_categories_uuids: chosenProductCategories.map(c => c.uuid),
            modifiers_uuids: [],
          },
        ],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(201);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 201,
        data: {
          uuid: createDiscountResponse.body.data.uuid,
          ...dto,
          strategies: dto.strategies.map((strategy, idx) =>
            deleteObjectPropsHelper(
              {
                ...strategy,
                uuid: createDiscountResponse.body.data.strategies[idx].uuid,
                discount_uuid: createDiscountResponse.body.data.uuid,
                products: [],
                product_categories: chosenProductCategories,
                modifiers: [],
              },
              ["products_uuids", "product_categories_uuids", "modifiers_uuids"]
            )
          ),
        },
      });
    });

    it("should successfully create a discount with modifiers", async () => {
      const chosenModifiers = ModifiersService.sort([
        modifiers[2],
        modifiers[1],
        modifiers[6],
      ]);

      const dto: CreateDiscountDto = {
        name: faker.word.adjective(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            products_uuids: [],
            product_categories_uuids: [],
            modifiers_uuids: chosenModifiers.map(m => m.uuid),
          },
        ],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(201);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 201,
        data: {
          uuid: createDiscountResponse.body.data.uuid,
          ...dto,
          strategies: dto.strategies.map((strategy, idx) =>
            deleteObjectPropsHelper(
              {
                ...strategy,
                uuid: createDiscountResponse.body.data.strategies[idx].uuid,
                discount_uuid: createDiscountResponse.body.data.uuid,
                products: [],
                product_categories: [],
                modifiers: deleteObjectsPropsHelper(chosenModifiers, [
                  "category",
                ]),
              },
              ["products_uuids", "product_categories_uuids", "modifiers_uuids"]
            )
          ),
        },
      });
    });

    it("should throw an error when creating a discount with exists name", async () => {
      const otherDiscount = await createDiscountHelper(testingModule);

      const dto: CreateDiscountDto = {
        name: otherDiscount.name,
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            products_uuids: [],
            product_categories_uuids: [
              productCategories[2],
              productCategories[1],
              productCategories[6],
            ].map(c => c.uuid),
            modifiers_uuids: [],
          },
        ],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(400);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The discount ${otherDiscount.uuid} already has the ${dto.name} name`,
      });
    });

    it(`should throw an error when creating a discount with type ${DiscountTypeEnum.PERCENT} and the value greater then 100`, async () => {
      const dto: CreateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.PERCENT,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            products_uuids: [],
            product_categories_uuids: [
              productCategories[2],
              productCategories[1],
              productCategories[6],
            ].map(c => c.uuid),
            modifiers_uuids: [],
          },
        ],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(400);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The discount cannot has the value greater then 100 when it has ${DiscountTypeEnum.PERCENT} type`,
      });
    });

    it(`should throw an error when creating a discount with a non-exists product`, async () => {
      const fakeProductUUID = faker.datatype.uuid();
      const dto: CreateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            products_uuids: [
              products[2],
              products[6],
              { uuid: fakeProductUUID },
            ].map(p => p.uuid),
            product_categories_uuids: [],
            modifiers_uuids: [],
          },
        ],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(404);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product ${fakeProductUUID} does not exist`,
      });
    });

    it(`should throw an error when creating a discount with a non-exists product category`, async () => {
      const fakeProductCategoryUUID = faker.datatype.uuid();
      const dto: CreateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            products_uuids: [],
            product_categories_uuids: [
              productCategories[2],
              { uuid: fakeProductCategoryUUID },
              productCategories[6],
            ].map(c => c.uuid),
            modifiers_uuids: [],
          },
        ],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(404);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product category ${fakeProductCategoryUUID} does not exist`,
      });
    });

    it(`should throw an error when creating a discount with a non-exists modifier`, async () => {
      const fakeModifierUUID = faker.datatype.uuid();
      const dto: CreateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            products_uuids: [],
            product_categories_uuids: [],
            modifiers_uuids: [
              modifiers[2],
              { uuid: fakeModifierUUID },
              modifiers[6],
            ].map(m => m.uuid),
          },
        ],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(404);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier ${fakeModifierUUID} does not exist`,
      });
    });

    it(`should throw an error when creating a discount with a invalid product uuid`, async () => {
      const fakeProductUUID = faker.datatype.string();
      const dto: CreateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            products_uuids: [
              products[2],
              products[6],
              { uuid: fakeProductUUID },
            ].map(p => p.uuid),
            product_categories_uuids: [],
            modifiers_uuids: [],
          },
        ],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(400);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: ["strategies.0.each value in products_uuids must be a UUID"],
      });
    });

    it(`should throw an error when creating a discount with a invalid product category uuid`, async () => {
      const fakeProductCategoryUUID = faker.datatype.string();
      const dto: CreateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            products_uuids: [],
            product_categories_uuids: [
              productCategories[2],
              { uuid: fakeProductCategoryUUID },
              productCategories[6],
            ].map(c => c.uuid),
            modifiers_uuids: [],
          },
        ],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(400);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: [
          "strategies.0.each value in product_categories_uuids must be a UUID",
        ],
      });
    });

    it(`should throw an error when creating a discount with ${DiscountOperatorEnum.BETWEEN} criteria operator and without provided value2`, async () => {
      const dto: CreateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.BETWEEN,
              value: 1,
            },
            products_uuids: [],
            product_categories_uuids: [],
            modifiers_uuids: [],
          },
        ],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(400);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The discount has the ${DiscountOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`,
      });
    });

    describe(`should throw an erro when creating the discount with ${DiscountTypeEnum.FIXED_PRICE} and ...`, () => {
      test(`with global discount scope`, async () => {
        const dto: CreateDiscountDto = {
          name: faker.datatype.string(),
          type: DiscountTypeEnum.FIXED_PRICE,
          value: 1299,
          strategies: [
            {
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.EQUAL,
                value: 1000,
              },
              products_uuids: [],
              product_categories_uuids: [],
              modifiers_uuids: [],
            },
          ],
        };

        const createDiscountResponse = await api.createDiscount(dto);

        expect(createDiscountResponse.status).toEqual(400);
        expect(createDiscountResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The ${DiscountTypeEnum.FIXED_PRICE} discount type is not available in global discount scope`,
        });
      });

      test(`with ${DiscountCriteriaEnum.PRICE} discount criteria`, async () => {
        const dto: CreateDiscountDto = {
          name: faker.datatype.string(),
          type: DiscountTypeEnum.FIXED_PRICE,
          value: 1299,
          strategies: [
            {
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 1000,
              },
              products_uuids: [],
              product_categories_uuids: [
                productCategories[2],
                productCategories[6],
              ].map(c => c.uuid),
              modifiers_uuids: [],
            },
          ],
        };

        const createDiscountResponse = await api.createDiscount(dto);

        expect(createDiscountResponse.status).toEqual(400);
        expect(createDiscountResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountCriteriaEnum.COUNT} discount criteria`,
        });
      });

      test(`with not ${DiscountOperatorEnum.EQUAL} discount operator`, async () => {
        const dto: CreateDiscountDto = {
          name: faker.datatype.string(),
          type: DiscountTypeEnum.FIXED_PRICE,
          value: 1299,
          strategies: [
            {
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 1000,
              },
              products_uuids: [],
              product_categories_uuids: [
                productCategories[2],
                productCategories[6],
              ].map(c => c.uuid),
              modifiers_uuids: [],
            },
          ],
        };

        const createDiscountResponse = await api.createDiscount(dto);

        expect(createDiscountResponse.status).toEqual(400);
        expect(createDiscountResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountOperatorEnum.EQUAL} discount operator`,
        });
      });
    });
  });

  describe("[Put] /discounts", () => {
    it(`should successfully update a discount`, async () => {
      const discount = await createDiscountHelper(testingModule);
      const choisedProductCategories = [productCategories[2]];
      const choisedModifiers = [modifiers[3]];

      const dto: UpdateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            products_uuids: [],
            product_categories_uuids: choisedProductCategories.map(c => c.uuid),
            modifiers_uuids: choisedModifiers.map(m => m.uuid),
          },
        ],
      };

      const updateDiscountResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscountResponse.status).toEqual(200);
      expect(updateDiscountResponse.body).toEqual({
        statusCode: 200,
        data: {
          uuid: updateDiscountResponse.body.data.uuid,
          ...dto,
          strategies: dto.strategies?.map((strategy, idx) =>
            deleteObjectPropsHelper(
              {
                ...strategy,
                uuid: updateDiscountResponse.body.data.strategies[idx].uuid,
                discount_uuid: updateDiscountResponse.body.data.uuid,
                products: [],
                product_categories: choisedProductCategories,
                modifiers: deleteObjectsPropsHelper(choisedModifiers, [
                  "category",
                ]),
              },
              ["products_uuids", "product_categories_uuids", "modifiers_uuids"]
            )
          ),
        },
      });
    });

    it(`throw an error when updating a non-exists discount`, async () => {
      const fakeDiscountUUID = faker.datatype.uuid();

      const dto: UpdateDiscountDto = {
        value: 100,
      };

      const updateDiscountResponse = await api.updateDiscount(
        fakeDiscountUUID,
        dto
      );

      expect(updateDiscountResponse.status).toEqual(404);
      expect(updateDiscountResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The discount ${fakeDiscountUUID} does not exist`,
      });
    });

    it(`throw an error when updating a discount with exists name`, async () => {
      const otherDiscount = await createDiscountHelper(testingModule);
      const discount = await createDiscountHelper(testingModule, {
        type: DiscountTypeEnum.IN_CASH,
        value: 100,
      });

      const dto: UpdateDiscountDto = {
        name: otherDiscount.name,
      };

      const updateDiscountResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscountResponse.status).toEqual(400);
      expect(updateDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The discount ${otherDiscount.uuid} already has the ${dto.name} name`,
      });
    });

    it(`throw an error when updating a discount with a non-exists product`, async () => {
      const discount = await createDiscountHelper(testingModule);
      const fakeProductUUID = faker.datatype.uuid();
      const chosenProducts = [
        products[2],
        { uuid: fakeProductUUID },
        products[6],
      ];

      const dto: UpdateDiscountDto = {
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.PRICE,
              op: DiscountOperatorEnum.GREATER,
              value: 1000,
            },
            products_uuids: chosenProducts.map(p => p.uuid),
            product_categories_uuids: [],
            modifiers_uuids: [],
          },
        ],
      };

      const updateDiscountResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscountResponse.status).toEqual(404);
      expect(updateDiscountResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product ${fakeProductUUID} does not exist`,
      });
    });

    it(`throw an error when updating a discount with a non-exists product category`, async () => {
      const discount = await createDiscountHelper(testingModule);
      const fakeProductCategoryUUID = faker.datatype.uuid();
      const chosenProductCategories = [
        productCategories[2],
        { uuid: fakeProductCategoryUUID },
        productCategories[6],
      ];

      const dto: UpdateDiscountDto = {
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.PRICE,
              op: DiscountOperatorEnum.GREATER,
              value: 1000,
            },
            products_uuids: [],
            product_categories_uuids: chosenProductCategories.map(c => c.uuid),
            modifiers_uuids: [],
          },
        ],
      };

      const updateDiscountResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscountResponse.status).toEqual(404);
      expect(updateDiscountResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product category ${fakeProductCategoryUUID} does not exist`,
      });
    });

    it(`throw an error when updating a discount with a non-exists modifier`, async () => {
      const discount = await createDiscountHelper(testingModule);
      const fakeModifierUUID = faker.datatype.uuid();
      const chosenModifiers = [
        modifiers[2],
        { uuid: fakeModifierUUID },
        modifiers[6],
      ];

      const dto: UpdateDiscountDto = {
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.PRICE,
              op: DiscountOperatorEnum.GREATER,
              value: 1000,
            },
            products_uuids: [],
            product_categories_uuids: [],
            modifiers_uuids: chosenModifiers.map(m => m.uuid),
          },
        ],
      };

      const updateDiscountResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscountResponse.status).toEqual(404);
      expect(updateDiscountResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier ${fakeModifierUUID} does not exist`,
      });
    });

    it(`throw an error when updating a discount with ${DiscountTypeEnum.PERCENT} and the value greater then 100`, async () => {
      const discount = await createDiscountHelper(testingModule, {
        type: DiscountTypeEnum.IN_CASH,
        value: 1000,
      });

      const dto: UpdateDiscountDto = {
        type: DiscountTypeEnum.PERCENT,
        value: 10000,
      };

      const updateDiscountResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscountResponse.status).toEqual(400);
      expect(updateDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The discount cannot has the value greater then 100 when it has ${DiscountTypeEnum.PERCENT} type`,
      });
    });

    it(`throw an error when updating a discount with ${DiscountTypeEnum.PERCENT} and the exist value greater then 100`, async () => {
      const discount = await createDiscountHelper(testingModule, {
        type: DiscountTypeEnum.IN_CASH,
        value: 1000,
      });

      const dto: UpdateDiscountDto = {
        type: DiscountTypeEnum.PERCENT,
      };

      const updateDiscountResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscountResponse.status).toEqual(400);
      expect(updateDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The discount cannot has the value greater then 100 when it has ${DiscountTypeEnum.PERCENT} type`,
      });
    });

    it(`should throw an error when updating a discount with ${DiscountOperatorEnum.BETWEEN} criteria operator and without provided value2`, async () => {
      const discount = await createDiscountHelper(testingModule);

      const dto: UpdateDiscountDto = {
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.PRICE,
              op: DiscountOperatorEnum.BETWEEN,
              value: 1000,
            },
            products_uuids: [],
            product_categories_uuids: [],
            modifiers_uuids: [],
          },
        ],
      };

      const updateDiscountResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscountResponse.status).toEqual(400);
      expect(updateDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The discount has the ${DiscountOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`,
      });
    });

    describe(`should throw an error when upading the discount with ${DiscountTypeEnum.FIXED_PRICE} discount type and with global discount scope`, () => {
      test("with type update", async () => {
        const discount = await createDiscountHelper(testingModule, {
          type: DiscountTypeEnum.PERCENT,
        });
        await createDiscountStrategyHelper(testingModule, {
          discount_uuid: discount.uuid,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
          products: [],
          product_categories: [],
          modifiers: [],
        });

        const dto: UpdateDiscountDto = {
          type: DiscountTypeEnum.FIXED_PRICE,
        };

        const updateDiscountResponse = await api.updateDiscount(
          discount.uuid,
          dto
        );

        expect(updateDiscountResponse.status).toEqual(400);
        expect(updateDiscountResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The ${DiscountTypeEnum.FIXED_PRICE} discount type is not available in global discount scope`,
        });
      });

      test("with scope update", async () => {
        const discount = await createDiscountHelper(testingModule, {
          type: DiscountTypeEnum.FIXED_PRICE,
        });
        await createDiscountStrategyHelper(testingModule, {
          discount_uuid: discount.uuid,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
          products: [],
          product_categories: [],
          modifiers,
        });
        const dto: UpdateDiscountDto = {
          strategies: [
            {
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.EQUAL,
                value: 3,
              },
              products_uuids: [],
              product_categories_uuids: [],
              modifiers_uuids: [],
            },
          ],
        };

        const updateDiscountResponse = await api.updateDiscount(
          discount.uuid,
          dto
        );

        expect(updateDiscountResponse.status).toEqual(400);
        expect(updateDiscountResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The ${DiscountTypeEnum.FIXED_PRICE} discount type is not available in global discount scope`,
        });
      });
    });

    describe(`should throw an error when upading the discount with ${DiscountTypeEnum.FIXED_PRICE} discount type and with ${DiscountCriteriaEnum.PRICE} discount criteria`, () => {
      test("with full update", async () => {
        const discount = await createDiscountHelper(testingModule, {
          type: DiscountTypeEnum.PERCENT,
          value: 3,
        });
        await createDiscountStrategyHelper(testingModule, {
          discount_uuid: discount.uuid,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
          products: [],
          product_categories: [],
          modifiers,
        });

        const dto: UpdateDiscountDto = {
          type: DiscountTypeEnum.FIXED_PRICE,
          strategies: [
            {
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 3000,
              },
              products_uuids: [],
              product_categories_uuids: [],
              modifiers_uuids: modifiers.map(m => m.uuid),
            },
          ],
        };

        const updateDiscountResponse = await api.updateDiscount(
          discount.uuid,
          dto
        );

        expect(updateDiscountResponse.status).toEqual(400);
        expect(updateDiscountResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountCriteriaEnum.COUNT} discount criteria`,
        });
      });

      test("with criteria update", async () => {
        const discount = await createDiscountHelper(testingModule, {
          type: DiscountTypeEnum.FIXED_PRICE,
        });
        await createDiscountStrategyHelper(testingModule, {
          discount_uuid: discount.uuid,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
          products: [],
          product_categories: [],
          modifiers,
        });

        const dto: UpdateDiscountDto = {
          strategies: [
            {
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 3000,
              },
              products_uuids: [],
              product_categories_uuids: [],
              modifiers_uuids: modifiers.map(m => m.uuid),
            },
          ],
        };

        const updateDiscountResponse = await api.updateDiscount(
          discount.uuid,
          dto
        );

        expect(updateDiscountResponse.status).toEqual(400);
        expect(updateDiscountResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountCriteriaEnum.COUNT} discount criteria`,
        });
      });

      test("with type update", async () => {
        const discount = await createDiscountHelper(testingModule, {
          type: DiscountTypeEnum.PERCENT,
        });
        await createDiscountStrategyHelper(testingModule, {
          discount_uuid: discount.uuid,
          condition: {
            criteria: DiscountCriteriaEnum.PRICE,
            op: DiscountOperatorEnum.EQUAL,
            value: 3000,
          },
          products: [],
          product_categories: [],
          modifiers,
        });

        const dto: UpdateDiscountDto = {
          type: DiscountTypeEnum.FIXED_PRICE,
        };

        const updateDiscountResponse = await api.updateDiscount(
          discount.uuid,
          dto
        );

        expect(updateDiscountResponse.status).toEqual(400);
        expect(updateDiscountResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountCriteriaEnum.COUNT} discount criteria`,
        });
      });
    });

    describe(`should throw an error when upading the discount with ${DiscountTypeEnum.FIXED_PRICE} discount type and with not ${DiscountOperatorEnum.EQUAL} discount operator`, () => {
      test("with full update", async () => {
        const discount = await createDiscountHelper(testingModule, {
          type: DiscountTypeEnum.PERCENT,
        });
        await createDiscountStrategyHelper(testingModule, {
          discount_uuid: discount.uuid,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
          products: [],
          product_categories: [],
          modifiers,
        });

        const dto: UpdateDiscountDto = {
          type: DiscountTypeEnum.FIXED_PRICE,
          strategies: [
            {
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 3,
              },
              products_uuids: [],
              product_categories_uuids: [],
              modifiers_uuids: modifiers.map(m => m.uuid),
            },
          ],
        };

        const updateDiscountResponse = await api.updateDiscount(
          discount.uuid,
          dto
        );

        expect(updateDiscountResponse.status).toEqual(400);
        expect(updateDiscountResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountOperatorEnum.EQUAL} discount operator`,
        });
      });

      test("with operator update", async () => {
        const discount = await createDiscountHelper(testingModule, {
          type: DiscountTypeEnum.FIXED_PRICE,
        });
        await createDiscountStrategyHelper(testingModule, {
          discount_uuid: discount.uuid,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
          products: [],
          product_categories: [],
          modifiers,
        });

        const dto: UpdateDiscountDto = {
          strategies: [
            {
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 3,
              },
              products_uuids: [],
              product_categories_uuids: [],
              modifiers_uuids: modifiers.map(m => m.uuid),
            },
          ],
        };

        const updateDiscountResponse = await api.updateDiscount(
          discount.uuid,
          dto
        );

        expect(updateDiscountResponse.status).toEqual(400);
        expect(updateDiscountResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountOperatorEnum.EQUAL} discount operator`,
        });
      });

      test("with type update", async () => {
        const discount = await createDiscountHelper(testingModule, {
          type: DiscountTypeEnum.PERCENT,
        });
        await createDiscountStrategyHelper(testingModule, {
          discount_uuid: discount.uuid,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.GREATER,
            value: 3,
          },
          products: [],
          product_categories: [],
          modifiers,
        });

        const dto: UpdateDiscountDto = {
          type: DiscountTypeEnum.FIXED_PRICE,
        };

        const updateDiscountResponse = await api.updateDiscount(
          discount.uuid,
          dto
        );

        expect(updateDiscountResponse.status).toEqual(400);
        expect(updateDiscountResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountOperatorEnum.EQUAL} discount operator`,
        });
      });
    });
  });

  describe("[Delete] /discounts", () => {
    it(`should successfully delete a discount`, async () => {
      const discount = await createDiscountHelper(testingModule);

      const deleteDiscountResponse = await api.deleteDiscount(discount.uuid);

      expect(deleteDiscountResponse.status).toEqual(200);
      expect(deleteDiscountResponse.body).toEqual({
        statusCode: 200,
      });

      const getDiscoutResponse = await api.getDiscount(discount.uuid);

      expect(getDiscoutResponse.status).toEqual(404);
      expect(getDiscoutResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The discount ${discount.uuid} does not exist`,
      });
    });

    it(`should throw an error when deleting a non-exists discount`, async () => {
      const fakeDiscountUUID = faker.datatype.uuid();

      const deleteDiscountResponse = await api.deleteDiscount(fakeDiscountUUID);

      expect(deleteDiscountResponse.status).toEqual(404);
      expect(deleteDiscountResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The discount ${fakeDiscountUUID} does not exist`,
      });
    });
  });
});
