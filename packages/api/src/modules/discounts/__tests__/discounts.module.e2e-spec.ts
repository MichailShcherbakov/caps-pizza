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
} from "~/utils/delete-object-props.helper";
import { fromJson, toJson } from "~/utils/json.helper";
import { CreateDiscountDto, UpdateDiscountDto } from "../discounts.dto";
import DiscountsService from "../discounts.service";
import Api from "./helpers/api.helper";
import createDiscountsHelper, {
  createDiscountHelper,
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

    productCategories = await createProductCategoriesHelper(
      testingModule.dataSource
    );
    products = await createProductsHelper(
      testingModule.dataSource,
      productCategories
    );

    const modifierCategories = await createModifierCategoriesHelper(
      testingModule.dataSource
    );
    modifiers = await createModifiersHelper(
      testingModule.dataSource,
      modifierCategories
    );
  });

  afterEach(async () => {
    await testingModule.clearDataSource();
  });

  afterAll(async () => {
    await testingModule.drop();
  });

  describe("[Get] /discounts", () => {
    it("should return all exists discounts", async () => {
      const discounts = await createDiscountsHelper(testingModule.dataSource);

      const getDiscountsResponse = await api.getDiscounts();

      expect(getDiscountsResponse.status).toEqual(200);
      expect(getDiscountsResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectsPropsHelper(DiscountsService.sort(discounts), [
              "updated_at",
              "created_at",
            ])
          )
        ),
      });
    });

    it("should return a special discount", async () => {
      const discounts = await createDiscountsHelper(testingModule.dataSource);
      const discount = discounts[2];

      const getDiscountResponse = await api.getDiscount(discount.uuid);

      expect(getDiscountResponse.status).toEqual(200);
      expect(getDiscountResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectPropsHelper(discount, ["updated_at", "created_at"])
          )
        ),
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
      const choicedProducts = ProductsService.sort([
        products[2],
        products[1],
        products[6],
      ]).map(p => ({
        ...p,
        category:
          p.category &&
          deleteObjectPropsHelper(p.category, ["updated_at", "created_at"]),
      }));

      const dto: CreateDiscountDto = {
        name: faker.word.adjective(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        products: choicedProducts.map(p => ({
          product_uuid: p.uuid,
          modifiers_uuids: p.modifiers.map(m => m.uuid),
        })),
        product_categories: [],
        modifiers: [],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(201);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 201,
        data: {
          uuid: createDiscountResponse.body.data.uuid,
          ...deleteObjectPropsHelper(dto, ["products"]),
          products: choicedProducts.map(p => ({
            product_uuid: p.uuid,
            modifiers: p.modifiers,
          })),
        },
      });
    });

    it("should successfully create a discount with product categories", async () => {
      const choicedProductCategories = ProductCategoriesService.sort([
        productCategories[2],
        productCategories[1],
        productCategories[6],
      ]);

      const dto: CreateDiscountDto = {
        name: faker.word.adjective(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        products: [],
        product_categories: choicedProductCategories.map(c => ({
          category_uuid: c.uuid,
          modifiers_uuids: [],
        })),
        modifiers: [],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(201);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 201,
        data: {
          uuid: createDiscountResponse.body.data.uuid,
          ...deleteObjectPropsHelper(dto, ["product_categories"]),
          product_categories: choicedProductCategories.map(c => ({
            category_uuid: c.uuid,
            modifiers: [],
          })),
        },
      });
    });

    it("should successfully create a discount with modifiers", async () => {
      const choicedModifiers = ModifiersService.sort([
        modifiers[2],
        modifiers[1],
        modifiers[6],
      ]);

      const dto: CreateDiscountDto = {
        name: faker.word.adjective(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        products: [],
        product_categories: [],
        modifiers: choicedModifiers.map(m => ({
          modifier_uuid: m.uuid,
        })),
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(201);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 201,
        data: {
          uuid: createDiscountResponse.body.data.uuid,
          ...deleteObjectPropsHelper(dto, ["modifiers"]),
          modifiers: deleteObjectsPropsHelper(choicedModifiers, [
            "updated_at",
            "created_at",
          ]),
        },
      });
    });

    it("should throw an error when creating a discount with exists name", async () => {
      const otherDiscount = await createDiscountHelper(
        testingModule.dataSource
      );

      const dto: CreateDiscountDto = {
        name: otherDiscount.name,
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        products: [],
        product_categories: [
          productCategories[2],
          productCategories[1],
          productCategories[6],
        ].map(c => ({
          category_uuid: c.uuid,
          modifiers_uuids: [],
        })),
        modifiers: [],
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
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        products: [],
        product_categories: [
          productCategories[2],
          productCategories[1],
          productCategories[6],
        ].map(c => ({
          category_uuid: c.uuid,
          modifiers_uuids: [],
        })),
        modifiers: [],
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
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        products: [products[2], products[6], { uuid: fakeProductUUID }].map(
          p => ({
            product_uuid: p.uuid,
            modifiers_uuids: [],
          })
        ),
        product_categories: [],
        modifiers: [],
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
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        products: [],
        product_categories: [
          productCategories[2],
          { uuid: fakeProductCategoryUUID },
          productCategories[6],
        ].map(c => ({
          category_uuid: c.uuid,
          modifiers_uuids: [],
        })),
        modifiers: [],
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
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        products: [],
        product_categories: [],
        modifiers: [modifiers[2], { uuid: fakeModifierUUID }, modifiers[6]].map(
          m => ({
            modifier_uuid: m.uuid,
          })
        ),
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
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        products: [products[2], products[6], { uuid: fakeProductUUID }].map(
          p => ({
            product_uuid: p.uuid,
            modifiers_uuids: [],
          })
        ),
        product_categories: [],
        modifiers: [],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(400);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: ["products.2.product_uuid must be a UUID"],
      });
    });

    it(`should throw an error when creating a discount with a invalid product category uuid`, async () => {
      const fakeProductCategoryUUID = faker.datatype.string();
      const dto: CreateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        products: [],
        product_categories: [
          productCategories[2],
          { uuid: fakeProductCategoryUUID },
          productCategories[6],
        ].map(c => ({
          category_uuid: c.uuid,
          modifiers_uuids: [],
        })),
        modifiers: [],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(400);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: ["product_categories.1.category_uuid must be a UUID"],
      });
    });

    it(`should throw an error when creating a discount with ${DiscountOperatorEnum.BETWEEN} criteria operator and without provided value2`, async () => {
      const dto: CreateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.BETWEEN,
          value: 1,
        },
        products: [],
        product_categories: [],
        modifiers: [],
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
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 1000,
          },
          products: [],
          product_categories: [],
          modifiers: [],
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
          condition: {
            criteria: DiscountCriteriaEnum.PRICE,
            op: DiscountOperatorEnum.EQUAL,
            value: 1000,
          },
          products: [],
          product_categories: [productCategories[2], productCategories[6]].map(
            c => ({
              category_uuid: c.uuid,
              modifiers_uuids: [],
            })
          ),
          modifiers: [],
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
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.GREATER,
            value: 1000,
          },
          products: [],
          product_categories: [productCategories[2], productCategories[6]].map(
            c => ({
              category_uuid: c.uuid,
              modifiers_uuids: [],
            })
          ),
          modifiers: [],
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
      const discount = await createDiscountHelper(testingModule.dataSource);
      const choisedProductCategories = ProductCategoriesService.sort([
        productCategories[2],
        productCategories[6],
      ]);
      const choisedModifiers = [modifiers[3]];

      const dto: UpdateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        product_categories: choisedProductCategories.map(c => ({
          category_uuid: c.uuid,
          modifiers_uuids: choisedModifiers.map(m => m.uuid),
        })),
      };

      const updateDiscountResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscountResponse.status).toEqual(200);
      expect(updateDiscountResponse.body).toEqual({
        statusCode: 200,
        data: deleteObjectPropsHelper(
          {
            ...discount,
            ...dto,
            product_categories: choisedProductCategories.map(c => ({
              category_uuid: c.uuid,
              modifiers: deleteObjectsPropsHelper(choisedModifiers, [
                "updated_at",
                "created_at",
              ]),
            })),
          },
          ["updated_at", "created_at"]
        ),
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
      const otherDiscount = await createDiscountHelper(
        testingModule.dataSource
      );
      const discount = await createDiscountHelper(testingModule.dataSource, {
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
      const discount = await createDiscountHelper(testingModule.dataSource);
      const fakeProductUUID = faker.datatype.uuid();
      const choicedProducts = [
        products[2],
        { uuid: fakeProductUUID },
        products[6],
      ];

      const dto: UpdateDiscountDto = {
        products: choicedProducts.map(p => ({
          product_uuid: p.uuid,
          modifiers_uuids: [],
        })),
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
      const discount = await createDiscountHelper(testingModule.dataSource);
      const fakeProductCategoryUUID = faker.datatype.uuid();
      const choicedProductCategories = [
        productCategories[2],
        { uuid: fakeProductCategoryUUID },
        productCategories[6],
      ];

      const dto: UpdateDiscountDto = {
        product_categories: choicedProductCategories.map(c => ({
          category_uuid: c.uuid,
          modifiers_uuids: [],
        })),
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
      const discount = await createDiscountHelper(testingModule.dataSource);
      const fakeModifierUUID = faker.datatype.uuid();
      const choicedModifiers = [
        modifiers[2],
        { uuid: fakeModifierUUID },
        modifiers[6],
      ];

      const dto: UpdateDiscountDto = {
        modifiers: choicedModifiers.map(m => ({
          modifier_uuid: m.uuid,
        })),
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
      const discount = await createDiscountHelper(testingModule.dataSource, {
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
      const discount = await createDiscountHelper(testingModule.dataSource, {
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
      const discount = await createDiscountHelper(testingModule.dataSource);

      const dto: UpdateDiscountDto = {
        condition: {
          criteria: DiscountCriteriaEnum.PRICE,
          op: DiscountOperatorEnum.BETWEEN,
          value: 1000,
        },
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
        const discount = await createDiscountHelper(testingModule.dataSource, {
          type: DiscountTypeEnum.PERCENT,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
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
        const discount = await createDiscountHelper(testingModule.dataSource, {
          type: DiscountTypeEnum.FIXED_PRICE,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
          modifiers,
        });

        const dto: UpdateDiscountDto = {
          modifiers: [],
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
        const discount = await createDiscountHelper(testingModule.dataSource, {
          type: DiscountTypeEnum.PERCENT,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
        });

        const dto: UpdateDiscountDto = {
          type: DiscountTypeEnum.FIXED_PRICE,
          condition: {
            criteria: DiscountCriteriaEnum.PRICE,
            op: DiscountOperatorEnum.EQUAL,
            value: 3000,
          },
          modifiers: modifiers.map(m => ({
            modifier_uuid: m.uuid,
          })),
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
        const discount = await createDiscountHelper(testingModule.dataSource, {
          type: DiscountTypeEnum.FIXED_PRICE,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
          modifiers,
        });

        const dto: UpdateDiscountDto = {
          condition: {
            criteria: DiscountCriteriaEnum.PRICE,
            op: DiscountOperatorEnum.EQUAL,
            value: 3000,
          },
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
        const discount = await createDiscountHelper(testingModule.dataSource, {
          type: DiscountTypeEnum.PERCENT,
          condition: {
            criteria: DiscountCriteriaEnum.PRICE,
            op: DiscountOperatorEnum.EQUAL,
            value: 3000,
          },
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
        const discount = await createDiscountHelper(testingModule.dataSource, {
          type: DiscountTypeEnum.PERCENT,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
        });

        const dto: UpdateDiscountDto = {
          type: DiscountTypeEnum.FIXED_PRICE,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.GREATER,
            value: 3,
          },
          modifiers: modifiers.map(m => ({
            modifier_uuid: m.uuid,
          })),
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
        const discount = await createDiscountHelper(testingModule.dataSource, {
          type: DiscountTypeEnum.FIXED_PRICE,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
          modifiers,
        });

        const dto: UpdateDiscountDto = {
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.GREATER,
            value: 3,
          },
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
        const discount = await createDiscountHelper(testingModule.dataSource, {
          type: DiscountTypeEnum.PERCENT,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.GREATER,
            value: 3,
          },
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
      const discount = await createDiscountHelper(testingModule.dataSource);

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
