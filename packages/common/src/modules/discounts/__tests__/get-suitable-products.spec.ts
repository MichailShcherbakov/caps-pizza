import { faker } from "@faker-js/faker";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  IDiscountModifier,
  IDiscountProduct,
} from "../../../interfaces";
import getSuitableProducts from "../get-suitable-products";
import createDiscount from "./helpers/create-discount.helper";
import createModifier from "./helpers/create-modifier.helper";
import { createProductCategory } from "./helpers/create-product-category.helper";
import createProduct, { createProducts } from "./helpers/create-product.helper";

describe("[Helper] [getSuitableProducts] ...", () => {
  describe("[Products + Modifiers] ...", () => {
    it("should return product of a special product list, but some of theme has modifiers", () => {
      const productCategories = [
        createProductCategory(),
        createProductCategory(),
      ];
      const modifiers = [createModifier()];
      const products = [
        createProduct({
          modifiers,
          category: productCategories[0],
          category_uuid: productCategories[0].uuid,
        }),
        createProduct({
          modifiers,
          category: productCategories[0],
          category_uuid: productCategories[0].uuid,
        }),
        /// same product category, but it does not have modifiers
        createProduct({
          category: productCategories[0],
          category_uuid: productCategories[0].uuid,
        }),
        /// other product
        createProduct({
          category: productCategories[1],
          category_uuid: productCategories[1].uuid,
        }),
        /// other product
        createProduct({
          category: productCategories[1],
          category_uuid: productCategories[1].uuid,
        }),
        /// other product
        createProduct({
          category: productCategories[1],
          category_uuid: productCategories[1].uuid,
        }),
      ];

      const needsProducts = [products[0], products[1]];

      const discount = createDiscount({
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 1,
        },
        value: 1250,
        product_categories: [
          {
            category_uuid: productCategories[0].uuid,
            category: productCategories[0],
            modifiers: modifiers.map(
              m =>
                ({
                  uuid: m.uuid,
                } as IDiscountModifier)
            ),
          },
        ],
      });

      expect(getSuitableProducts(discount, products)).toEqual(needsProducts);
    });
  });

  describe("[Products] ...", () => {
    it("should return product of a special product list", () => {
      const products = createProducts(20);
      const needsProducts = products.slice(
        faker.datatype.number({ min: 0, max: products.length / 2 }),
        faker.datatype.number({
          min: products.length / 2,
          max: products.length,
        })
      );

      const discount = createDiscount({
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 1,
        },
        value: 1250,
        products: needsProducts.map<IDiscountProduct>(p => ({
          product: p,
          product_uuid: p.uuid,
          modifiers: [],
        })),
      });

      expect(getSuitableProducts(discount, products)).toEqual(needsProducts);
    });
  });

  describe("[Product categories + Modifiers] ...", () => {
    it("should return product of a special product list, but all of them should have the same category and modifiers", () => {
      const productCategory = createProductCategory();
      const otherProductCategory = createProductCategory();
      const modifier = createModifier();
      const products = [
        /// is fulfill product
        createProduct({
          modifiers: [modifier],
          category: productCategory,
          category_uuid: productCategory.uuid,
        }),
        /// is fulfill product
        createProduct({
          modifiers: [modifier],
          category: productCategory,
          category_uuid: productCategory.uuid,
        }),
        /// same product category, but it does not have modifiers
        createProduct({
          category: productCategory,
          category_uuid: productCategory.uuid,
        }),
        /// same modifiers, but it has other product category
        createProduct({
          modifiers: [modifier],
          category: otherProductCategory,
          category_uuid: otherProductCategory.uuid,
        }),
        /// other product
        createProduct({
          category: otherProductCategory,
          category_uuid: otherProductCategory.uuid,
        }),
      ];

      const needsProducts = [products[0], products[1]];

      const discount = createDiscount({
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 1,
        },
        value: 1250,
        product_categories: [
          {
            category_uuid: productCategory.uuid,
            category: productCategory,
            modifiers: [modifier],
          },
        ],
      });

      expect(getSuitableProducts(discount, products)).toEqual(needsProducts);
    });
  });

  describe("[Product categories] ...", () => {
    it("should return product of a special product list, but all of them should have the same category", () => {
      const productCategory = createProductCategory();
      const otherProductCategory = createProductCategory();
      const products = [
        /// is fulfill product
        createProduct({
          category: productCategory,
          category_uuid: productCategory.uuid,
        }),
        /// is fulfill product
        createProduct({
          category: productCategory,
          category_uuid: productCategory.uuid,
        }),
        /// other product category
        createProduct({
          category: otherProductCategory,
          category_uuid: otherProductCategory.uuid,
        }),
        /// other product category
        createProduct({
          category: otherProductCategory,
          category_uuid: otherProductCategory.uuid,
        }),
      ];

      const needsProducts = [products[0], products[1]];

      const discount = createDiscount({
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 1,
        },
        value: 1250,
        product_categories: [
          {
            category_uuid: productCategory.uuid,
            category: productCategory,
            modifiers: [],
          },
        ],
      });

      expect(getSuitableProducts(discount, products)).toEqual(needsProducts);
    });
  });

  describe("[Modifiers] ...", () => {
    it("should return product of a special product list, but all of them should have the same modifiers", () => {
      const productCategory = createProductCategory();
      const otherProductCategory = createProductCategory();
      const modifier = createModifier();
      const products = [
        /// is fulfill product
        createProduct({
          modifiers: [modifier],
          category: productCategory,
          category_uuid: productCategory.uuid,
        }),
        /// is fulfill product
        createProduct({
          modifiers: [modifier],
          category: productCategory,
          category_uuid: productCategory.uuid,
        }),
        /// same product category, but it does not have modifiers
        createProduct({
          category: productCategory,
          category_uuid: productCategory.uuid,
        }),
        /// other product category, but still it has correct modifiers
        createProduct({
          modifiers: [modifier],
          category: otherProductCategory,
          category_uuid: otherProductCategory.uuid,
        }),
      ];

      const needsProducts = [products[0], products[1], products[3]];

      const discount = createDiscount({
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 1,
        },
        value: 1250,
        modifiers: [modifier],
      });

      expect(getSuitableProducts(discount, products)).toEqual(needsProducts);
    });
  });

  describe("[Global] ...", () => {
    it("should return all products, without filters", () => {
      const products = createProducts(20);

      const needsProducts = products;

      const discount = createDiscount({
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 1,
        },
        value: 1250,
      });

      expect(getSuitableProducts(discount, products)).toEqual(needsProducts);
    });
  });
});
