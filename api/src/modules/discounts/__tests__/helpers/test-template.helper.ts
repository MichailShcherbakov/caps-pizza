import DiscountEntity, {
  DiscountTypeEnum,
  DiscountСondition,
} from "~/db/entities/discount.entity";
import ProductEntity from "~/db/entities/product.entity";
import { Order, OrderedProduct } from "~/modules/orders/orders.dto";
import { DiscountProduct } from "../../discounts.service";
import {
  TEST_FLUFFY_DOUGH_MODIFIER,
  TEST_TRADITIONAL_DOUGH_MODIFIER,
} from "../data/modifiers.data";
import {
  discountsServiceWrapper,
  modifiersServiceWrapper,
  productsServiceWrapper,
} from "../__mocks__/discounts.service";
import computeFinalOrderCostHelper from "./compute-final-order-cost.helper";

export type TestFunc = (
  products: (ProductEntity & { full_price: number })[],
  discount: DiscountEntity,
  counts: Array<number>
) => Promise<{
  calculatedDiscount: number;
  totalOrderCost: number;
}>;

export type TestTemplateFunc = (
  discountOptions: {
    type: DiscountTypeEnum;
    value: number;
    condition: DiscountСondition;
  },
  counts: Array<number>,
  getTruthyDiscount?: (
    discount: DiscountEntity,
    products: (DiscountProduct & { final_cost: number })[],
    totalOrderCost: number
  ) => number
) => void;

export const testTemplate: TestFunc = async (products, discount, counts) => {
  jest.spyOn(productsServiceWrapper, "find").mockResolvedValueOnce(products);
  jest.spyOn(discountsServiceWrapper, "find").mockResolvedValueOnce([discount]);
  jest
    .spyOn(modifiersServiceWrapper, "find")
    .mockResolvedValueOnce([
      TEST_TRADITIONAL_DOUGH_MODIFIER,
      TEST_FLUFFY_DOUGH_MODIFIER,
    ]);

  const orderedProducts: OrderedProduct[] = products.map((p, idx) => ({
    uuid: p.uuid,
    count: counts[idx],
    modifiers: p.modifiers,
  }));

  const totalOrderCost = computeFinalOrderCostHelper(
    products,
    counts,
    products.map(p => p.modifiers)
  );

  const calculatedDiscount = await discountsServiceWrapper.calculate({
    products: orderedProducts,
  } as Order);

  return { calculatedDiscount, totalOrderCost };
};
