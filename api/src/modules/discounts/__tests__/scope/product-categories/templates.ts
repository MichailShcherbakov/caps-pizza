import { DiscountScopeEnum } from "~/db/entities/discount.entity";
import {
  TEST_FLUFFY_DOUGH_MODIFIER,
  TEST_TRADITIONAL_DOUGH_MODIFIER,
} from "../../data/modifiers.data";
import {
  TEST_PIZZA_PRODUCT_CATEGORY,
  TEST_ROLL_PRODUCT_CATEGORY,
} from "../../data/product-categories.data";
import createDiscountHelper from "../../helpers/create-discount.helper";
import createProductHelper from "../../helpers/create-product.helper";
import {
  testTemplate,
  TestTemplateFunc,
} from "../../helpers/test-template.helper";

export const testValidDiscountWithProductCategories: TestTemplateFunc = async (
  discountOptions,
  counts,
  getTruthyDiscount = () => -1
) => {
  const products = [
    createProductHelper({
      price: 540, // + 50
      modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 440, // + 50
      modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 510, // + 100
      modifiers: [TEST_FLUFFY_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 220,
      modifiers: [],
      category_uuid: TEST_ROLL_PRODUCT_CATEGORY.uuid,
      category: TEST_ROLL_PRODUCT_CATEGORY,
    }),
  ];

  const discount = createDiscountHelper({
    type: discountOptions.type,
    value: discountOptions.value,
    condition: discountOptions.condition,
    scope: DiscountScopeEnum.PRODUCT_FEATURES,
    products: [],
    product_categories: [TEST_PIZZA_PRODUCT_CATEGORY],
    modifiers: [],
  });

  const { calculatedDiscount, totalOrderCost } = await testTemplate(
    products,
    discount,
    counts
  );

  const availableProducts = products.map((p, idx) => ({
    ...p,
    count: counts[idx],
    full_price: p.full_price,
    final_cost: p.full_price * counts[idx],
  }));

  expect(calculatedDiscount).toEqual(
    getTruthyDiscount(discount, availableProducts, totalOrderCost)
  );
};

export const testValidDiscountWithModifiers: TestTemplateFunc = async (
  discountOptions,
  counts,
  getTruthyDiscount = () => -1
) => {
  const products = [
    createProductHelper({
      price: 540, // + 50
      modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 440, // + 50
      modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 510, // + 100
      modifiers: [TEST_FLUFFY_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 220,
      modifiers: [],
      category_uuid: TEST_ROLL_PRODUCT_CATEGORY.uuid,
      category: TEST_ROLL_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 410, // + 50
      modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
  ];

  const discount = createDiscountHelper({
    type: discountOptions.type,
    value: discountOptions.value,
    condition: discountOptions.condition,
    scope: DiscountScopeEnum.PRODUCT_FEATURES,
    products: [],
    product_categories: [TEST_PIZZA_PRODUCT_CATEGORY],
    modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
  });

  const { calculatedDiscount, totalOrderCost } = await testTemplate(
    products,
    discount,
    counts
  );

  const availableProducts = products.map((p, idx) => ({
    ...p,
    count: counts[idx],
    full_price: p.full_price,
    final_cost: p.full_price * counts[idx],
  }));

  expect(calculatedDiscount).toEqual(
    getTruthyDiscount(discount, availableProducts, totalOrderCost)
  );
};

export const testValidDiscountWithOnlyModifiers: TestTemplateFunc = async (
  discountOptions,
  counts,
  getTruthyDiscount = () => -1
) => {
  const products = [
    createProductHelper({
      price: 540, // + 50
      modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 440, // + 50
      modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 510, // + 100
      modifiers: [TEST_FLUFFY_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 220,
      modifiers: [],
      category_uuid: TEST_ROLL_PRODUCT_CATEGORY.uuid,
      category: TEST_ROLL_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 410, // + 50
      modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
  ];

  const discount = createDiscountHelper({
    type: discountOptions.type,
    value: discountOptions.value,
    condition: discountOptions.condition,
    scope: DiscountScopeEnum.PRODUCT_FEATURES,
    products: [],
    product_categories: [],
    modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
  });

  const { calculatedDiscount, totalOrderCost } = await testTemplate(
    products,
    discount,
    counts
  );

  const availableProducts = products.map((p, idx) => ({
    ...p,
    count: counts[idx],
    full_price: p.full_price,
    final_cost: p.full_price * counts[idx],
  }));

  expect(calculatedDiscount).toEqual(
    getTruthyDiscount(discount, availableProducts, totalOrderCost)
  );
};

export const testInvalidDiscount: TestTemplateFunc = async (
  discountOptions,
  counts,
  _ = () => -1
) => {
  _;

  const products = [
    createProductHelper({
      price: 540, // + 50
      modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 440, // + 50
      modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 510, // + 100
      modifiers: [TEST_FLUFFY_DOUGH_MODIFIER],
      category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
      category: TEST_PIZZA_PRODUCT_CATEGORY,
    }),
    createProductHelper({
      price: 220,
      modifiers: [],
      category_uuid: TEST_ROLL_PRODUCT_CATEGORY.uuid,
      category: TEST_ROLL_PRODUCT_CATEGORY,
    }),
  ];

  const discount = createDiscountHelper({
    type: discountOptions.type,
    value: discountOptions.value,
    condition: discountOptions.condition,
    scope: DiscountScopeEnum.PRODUCT_FEATURES,
    products: [],
    product_categories: [TEST_PIZZA_PRODUCT_CATEGORY],
    modifiers: [],
  });

  await expect(testTemplate(products, discount, counts)).rejects.toThrowError(
    "The invalid discount"
  );
};
