import DiscountProductEntity from "~/db/entities/discount-product.entity";
import ProductEntity from "~/db/entities/product.entity";
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

export const testValidDiscount: TestTemplateFunc = async (
  testingModule,
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
    products: [products[0], products[2]].map(
      p =>
        ({
          product_uuid: p.uuid,
          product: p as unknown as ProductEntity,
          modifiers: p.modifiers,
        } as DiscountProductEntity)
    ),
    product_categories: [],
    modifiers: [],
  });

  const { calculatedDiscount, totalOrderCost } = await testTemplate(
    testingModule,
    products,
    discount,
    counts
  );

  const availableProducts = products.map((p, idx) => ({
    ...p,
    count: counts[idx],
    full_price: p.fullPrice,
    final_cost: p.fullPrice * counts[idx],
  }));

  expect(calculatedDiscount).toEqual(
    getTruthyDiscount(discount, availableProducts, totalOrderCost)
  );
};

export const testInvalidDiscount: TestTemplateFunc = async (
  testingModule,
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
    products: [products[0], products[2]].map(
      p =>
        ({
          product_uuid: p.uuid,
          product: p as unknown as ProductEntity,
          modifiers: p.modifiers,
        } as DiscountProductEntity)
    ),
    product_categories: [],
    modifiers: [],
  });

  await expect(
    testTemplate(testingModule, products, discount, counts)
  ).rejects.toThrowError("The invalid discount");
};
