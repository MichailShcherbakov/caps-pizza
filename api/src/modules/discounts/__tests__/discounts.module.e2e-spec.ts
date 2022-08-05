import { faker } from "@faker-js/faker";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import ProductEntity from "~/db/entities/product.entity";
import createProductCategoriesHelper from "~/modules/products/modules/categories/__tests__/helpers/create-categories.helper";
import createProductsHelper from "~/modules/products/__tests__/helpers/create-products.helper";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";
import { fromJson, toJson } from "~/utils/json.helper";
import { CreateDiscountDto, UpdateDiscountDto } from "../discounts.dto";
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

  beforeAll(async () => {
    testingModule = new TestingModule();

    await testingModule.init();

    api = new Api(testingModule.app);

    productCategories = await createProductCategoriesHelper(
      testingModule.dataSource
    );
    products = await createProductsHelper(
      testingModule.dataSource,
      productCategories
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
            deleteObjectsPropsHelper(
              discounts.sort((a, b) =>
                a.created_at < b.created_at
                  ? -1
                  : a.created_at > b.created_at
                  ? 1
                  : 0
              ),
              ["updated_at", "created_at"]
            )
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
    it("should successfully create a discount", async () => {
      const choicedProductCategories = [
        productCategories[2],
        productCategories[1],
        productCategories[6],
      ];

      const dto: CreateDiscountDto = {
        name: faker.word.adjective(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        products_uuids: [],
        product_categories_uuids: choicedProductCategories.map(c => c.uuid),
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(201);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 201,
        data: {
          ...createDiscountResponse.body.data,
          ...deleteObjectPropsHelper(dto, [
            "product_categories_uuids",
            "products_uuids",
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
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        products_uuids: [],
        product_categories_uuids: [
          productCategories[2],
          productCategories[1],
          productCategories[6],
        ].map(c => c.uuid),
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
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        products_uuids: [],
        product_categories_uuids: [
          productCategories[2],
          productCategories[1],
          productCategories[6],
        ].map(c => c.uuid),
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(400);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The discount cannot has the value greater then 100 when it has ${DiscountTypeEnum.PERCENT} type`,
      });
    });

    it(`should throw an error when creating a discount with scope ${DiscountScopeEnum.PRODUCTS} and a non-exists product`, async () => {
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
        scope: DiscountScopeEnum.PRODUCTS,
        products_uuids: [
          products[2],
          products[6],
          { uuid: fakeProductUUID },
        ].map(c => c.uuid),
        product_categories_uuids: [],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(404);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product ${fakeProductUUID} does not exist`,
      });
    });

    it(`should throw an error when creating a discount with scope ${DiscountScopeEnum.PRODUCT_CATEGORIES} and a non-exists product category`, async () => {
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
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        products_uuids: [],
        product_categories_uuids: [
          productCategories[2],
          { uuid: fakeProductCategoryUUID },
          productCategories[6],
        ].map(c => c.uuid),
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(404);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product category ${fakeProductCategoryUUID} does not exist`,
      });
    });

    it(`should throw an error when creating a discount with scope ${DiscountScopeEnum.PRODUCTS} and a invalid product uuid`, async () => {
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
        scope: DiscountScopeEnum.PRODUCTS,
        products_uuids: [
          products[2],
          products[6],
          { uuid: fakeProductUUID },
        ].map(c => c.uuid),
        product_categories_uuids: [],
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(400);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: ["each value in products_uuids must be a UUID"],
      });
    });

    it(`should throw an error when creating a discount with scope ${DiscountScopeEnum.PRODUCT_CATEGORIES} and a invalid product category uuid`, async () => {
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
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        products_uuids: [],
        product_categories_uuids: [
          productCategories[2],
          { uuid: fakeProductCategoryUUID },
          productCategories[6],
        ].map(c => c.uuid),
      };

      const createDiscountResponse = await api.createDiscount(dto);

      expect(createDiscountResponse.status).toEqual(400);
      expect(createDiscountResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: ["each value in product_categories_uuids must be a UUID"],
      });
    });
  });

  describe("[Put] /discounts", () => {
    it(`should successfully update a discount`, async () => {
      const discount = await createDiscountHelper(testingModule.dataSource);
      const choisedProductCategories = [
        productCategories[2],
        productCategories[6],
      ];

      const dto: UpdateDiscountDto = {
        name: faker.datatype.string(),
        type: DiscountTypeEnum.IN_CASH,
        value: 1299,
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        products_uuids: [],
        product_categories_uuids: choisedProductCategories.map(c => c.uuid),
      };

      const updateDiscoutResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscoutResponse.status).toEqual(200);
      expect(updateDiscoutResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectPropsHelper(
              {
                ...discount,
                ...dto,
                product_categories:
                  updateDiscoutResponse.body.data.product_categories,
              },
              [
                "updated_at",
                "created_at",
                "products_uuids",
                "product_categories_uuids",
              ]
            )
          )
        ),
      });
    });

    it(`should clear products when a discount scope has been changed (${DiscountScopeEnum.PRODUCT_CATEGORIES})`, async () => {
      const discount = await createDiscountHelper(testingModule.dataSource, {
        scope: DiscountScopeEnum.PRODUCTS,
        products: [products[5], products[1], products[3]],
      });
      const choisedProductCategories = [
        productCategories[2],
        productCategories[6],
      ];

      const dto: UpdateDiscountDto = {
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        product_categories_uuids: choisedProductCategories.map(c => c.uuid),
      };

      const updateDiscoutResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscoutResponse.status).toEqual(200);
      expect(updateDiscoutResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectPropsHelper(
              {
                ...discount,
                ...dto,
                products: [],
                product_categories:
                  updateDiscoutResponse.body.data.product_categories,
              },
              [
                "updated_at",
                "created_at",
                "products_uuids",
                "product_categories_uuids",
              ]
            )
          )
        ),
      });
    });

    it(`should clear product categories when a discount scope has been changed (${DiscountScopeEnum.PRODUCTS})`, async () => {
      const discount = await createDiscountHelper(testingModule.dataSource, {
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        product_categories: [
          productCategories[5],
          productCategories[1],
          productCategories[3],
        ],
      });
      const choisedProducts = [products[2], products[6]];

      const dto: UpdateDiscountDto = {
        scope: DiscountScopeEnum.PRODUCTS,
        products_uuids: choisedProducts.map(c => c.uuid),
      };

      const updateDiscoutResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscoutResponse.status).toEqual(200);
      expect(updateDiscoutResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectPropsHelper(
              {
                ...discount,
                ...dto,
                product_categories: [],
                products: updateDiscoutResponse.body.data.products,
              },
              [
                "updated_at",
                "created_at",
                "products_uuids",
                "product_categories_uuids",
              ]
            )
          )
        ),
      });
    });

    it(`should clear products and product categories when a discount scope has been changed (${DiscountScopeEnum.GLOBAL})`, async () => {
      const discount = await createDiscountHelper(testingModule.dataSource, {
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        product_categories: [
          productCategories[5],
          productCategories[1],
          productCategories[3],
        ],
      });

      const dto: UpdateDiscountDto = {
        scope: DiscountScopeEnum.GLOBAL,
      };

      const updateDiscoutResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscoutResponse.status).toEqual(200);
      expect(updateDiscoutResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectPropsHelper(
              {
                ...discount,
                ...dto,
                product_categories: [],
                products: [],
              },
              [
                "updated_at",
                "created_at",
                "products_uuids",
                "product_categories_uuids",
              ]
            )
          )
        ),
      });
    });

    it(`throw an error when updating a non-exists discount`, async () => {
      const fakeDiscountUUID = faker.datatype.uuid();

      const dto: UpdateDiscountDto = {
        scope: DiscountScopeEnum.GLOBAL,
      };

      const updateDiscoutResponse = await api.updateDiscount(
        fakeDiscountUUID,
        dto
      );

      expect(updateDiscoutResponse.status).toEqual(404);
      expect(updateDiscoutResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The discount ${fakeDiscountUUID} does not exist`,
      });
    });

    it(`throw an error when updating a discount with exists name`, async () => {
      const otherDiscount = await createDiscountHelper(
        testingModule.dataSource,
        {
          scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        }
      );
      const discount = await createDiscountHelper(testingModule.dataSource, {
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        product_categories: [
          productCategories[5],
          productCategories[1],
          productCategories[3],
        ],
      });

      const dto: UpdateDiscountDto = {
        name: otherDiscount.name,
        scope: DiscountScopeEnum.GLOBAL,
      };

      const updateDiscoutResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscoutResponse.status).toEqual(400);
      expect(updateDiscoutResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The discount ${otherDiscount.uuid} already has the ${dto.name} name`,
      });
    });

    it(`throw an error when updating a discount with ${DiscountTypeEnum.PERCENT} and the value greater then 100`, async () => {
      const discount = await createDiscountHelper(testingModule.dataSource, {
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        product_categories: [
          productCategories[5],
          productCategories[1],
          productCategories[3],
        ],
        type: DiscountTypeEnum.IN_CASH,
        value: 1000,
      });

      const dto: UpdateDiscountDto = {
        type: DiscountTypeEnum.PERCENT,
        value: 10000,
      };

      const updateDiscoutResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscoutResponse.status).toEqual(400);
      expect(updateDiscoutResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The discount cannot has the value greater then 100 when it has ${DiscountTypeEnum.PERCENT} type`,
      });
    });

    it(`throw an error when updating a discount with ${DiscountTypeEnum.PERCENT} and the exist value greater then 100`, async () => {
      const discount = await createDiscountHelper(testingModule.dataSource, {
        scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
        product_categories: [
          productCategories[5],
          productCategories[1],
          productCategories[3],
        ],
        type: DiscountTypeEnum.IN_CASH,
        value: 1000,
      });

      const dto: UpdateDiscountDto = {
        type: DiscountTypeEnum.PERCENT,
      };

      const updateDiscoutResponse = await api.updateDiscount(
        discount.uuid,
        dto
      );

      expect(updateDiscoutResponse.status).toEqual(400);
      expect(updateDiscoutResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The discount cannot has the value greater then 100 when it has ${DiscountTypeEnum.PERCENT} type`,
      });
    });
  });
});
