import { faker } from "@faker-js/faker";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
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
      const modifiers = [
        createModifier({
          price: 0,
        }),
      ];
      const products = [
        createProduct({
          modifiers,
          categories: [productCategories[0]],
        }),
        createProduct({
          modifiers,
          categories: [productCategories[0]],
        }),
        /// same product category, but it does not have modifiers
        createProduct({
          categories: [productCategories[0]],
        }),
        /// other product
        createProduct({
          categories: [productCategories[1]],
        }),
        /// other product
        createProduct({
          categories: [productCategories[1]],
        }),
        /// other product
        createProduct({
          categories: [productCategories[1]],
        }),
      ].map(p => ({ ...p, fullPrice: p.price, count: 1 }));

      const needsProducts = [products[0], products[1]];

      const discount = createDiscount({
        type: DiscountTypeEnum.FIXED_PRICE,
        value: 1250,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 1,
            },
            product_categories: productCategories,
            products: [],
            modifiers: modifiers,
          },
        ],
      });

      expect(getSuitableProducts(discount.strategies[0], products)).toEqual(
        needsProducts
      );
    });
  });

  describe("[Products] ...", () => {
    it("should return product of a special product list", () => {
      const products = createProducts(20).map(p => ({
        ...p,
        fullPrice: p.price,
        count: 1,
      }));
      const needsProducts = products.slice(
        faker.datatype.number({ min: 0, max: products.length / 2 }),
        faker.datatype.number({
          min: products.length / 2,
          max: products.length,
        })
      );

      const discount = createDiscount({
        type: DiscountTypeEnum.FIXED_PRICE,
        value: 1250,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 1,
            },
            products: needsProducts,
            product_categories: [],
            modifiers: [],
          },
        ],
      });

      expect(getSuitableProducts(discount.strategies[0], products)).toEqual(
        needsProducts
      );
    });
  });

  describe("[Product categories + Modifiers] ...", () => {
    it("should return product of a special product list, but all of them should have the same category and modifiers", () => {
      const productCategory = createProductCategory();
      const otherProductCategory = createProductCategory();
      const modifier = createModifier({
        price: 0,
      });
      const products = [
        /// is fulfill product
        createProduct({
          modifiers: [modifier],
          categories: [productCategory],
        }),
        /// is fulfill product
        createProduct({
          modifiers: [modifier],
          categories: [productCategory],
        }),
        /// same product category, but it does not have modifiers
        createProduct({
          categories: [productCategory],
        }),
        /// same modifiers, but it has other product category
        createProduct({
          modifiers: [modifier],
          categories: [otherProductCategory],
        }),
        /// other product
        createProduct({
          categories: [otherProductCategory],
        }),
      ].map(p => ({ ...p, fullPrice: p.price, count: 1 }));

      const needsProducts = [products[0], products[1]];

      const discount = createDiscount({
        type: DiscountTypeEnum.FIXED_PRICE,
        value: 1250,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 1,
            },
            products: [],
            product_categories: [productCategory],
            modifiers: [modifier],
          },
        ],
      });

      expect(getSuitableProducts(discount.strategies[0], products)).toEqual(
        needsProducts
      );
    });
  });

  describe("[Product categories] ...", () => {
    it("should return product of a special product list, but all of them should have the same category", () => {
      const productCategory = createProductCategory();
      const otherProductCategory = createProductCategory();
      const products = [
        /// is fulfill product
        createProduct({
          categories: [productCategory],
        }),
        /// is fulfill product
        createProduct({
          categories: [productCategory],
        }),
        /// other product category
        createProduct({
          categories: [otherProductCategory],
        }),
        /// other product category
        createProduct({
          categories: [otherProductCategory],
        }),
      ].map(p => ({ ...p, fullPrice: p.price, count: 1 }));

      const needsProducts = [products[0], products[1]];

      const discount = createDiscount({
        type: DiscountTypeEnum.FIXED_PRICE,
        value: 1250,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 1,
            },
            products: [],
            product_categories: [productCategory],
            modifiers: [],
          },
        ],
      });

      expect(getSuitableProducts(discount.strategies[0], products)).toEqual(
        needsProducts
      );
    });
  });

  describe("[Modifiers] ...", () => {
    it("should return product of a special product list, but all of them should have the same modifiers", () => {
      const productCategory = createProductCategory();
      const otherProductCategory = createProductCategory();
      const modifier = createModifier({
        price: 0,
      });
      const products = [
        /// is fulfill product
        createProduct({
          modifiers: [modifier],
          categories: [productCategory],
        }),
        /// is fulfill product
        createProduct({
          modifiers: [modifier],
          categories: [productCategory],
        }),
        /// same product category, but it does not have modifiers
        createProduct({
          categories: [productCategory],
        }),
        /// other product category, but still it has correct modifiers
        createProduct({
          modifiers: [modifier],
          categories: [otherProductCategory],
        }),
      ].map(p => ({ ...p, fullPrice: p.price, count: 1 }));

      const needsProducts = [products[0], products[1], products[3]];

      const discount = createDiscount({
        type: DiscountTypeEnum.FIXED_PRICE,
        value: 1250,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 1,
            },
            products: [],
            product_categories: [],
            modifiers: [modifier],
          },
        ],
      });

      expect(getSuitableProducts(discount.strategies[0], products)).toEqual(
        needsProducts
      );
    });
  });

  describe("[Global] ...", () => {
    it("should return all products, without filters", () => {
      const products = createProducts(20).map(p => ({
        ...p,
        fullPrice: p.price,
        count: 1,
      }));

      const needsProducts = products;

      const discount = createDiscount({
        type: DiscountTypeEnum.FIXED_PRICE,
        value: 1250,
        strategies: [
          {
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 1,
            },
            products: [],
            product_categories: [],
            modifiers: [],
          },
        ],
      });

      expect(getSuitableProducts(discount.strategies[0], products)).toEqual(
        needsProducts
      );
    });
  });
});
