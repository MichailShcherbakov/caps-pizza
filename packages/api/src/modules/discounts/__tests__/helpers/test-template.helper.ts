import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import DiscountEntity, {
  DiscountTypeEnum,
  DiscountСondition,
} from "~/db/entities/discount.entity";
import ProductEntity from "~/db/entities/product.entity";
import ModifiersService from "~/modules/modifiers/modifiers.service";
import { Order, OrderedProduct } from "~/modules/orders/orders.dto";
import ProductsService from "~/modules/products/products.service";
import { ITestingModule } from "~/utils/testing-module.interface";
import DiscountsService, { DiscountProduct } from "../../discounts.service";
import {
  TEST_FLUFFY_DOUGH_MODIFIER,
  TEST_TRADITIONAL_DOUGH_MODIFIER,
} from "../data/modifiers.data";
import computeFinalOrderCostHelper from "./compute-final-order-cost.helper";

export type TestFunc = (
  testingModule: ITestingModule,
  products: (ProductEntity & { full_price: number })[],
  discount: DiscountEntity,
  counts: Array<number>
) => Promise<{
  calculatedDiscount: number;
  totalOrderCost: number;
}>;

export type TestTemplateFunc = (
  testingModule: ITestingModule,
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

export const testTemplate: TestFunc = async (
  testingModule,
  products,
  discount,
  counts
) => {
  const discountsService =
    testingModule.get<DiscountsService>(DiscountsService);
  const productsService = testingModule.get<ProductsService>(ProductsService);
  const discountsRepository = testingModule.get<Repository<DiscountEntity>>(
    getRepositoryToken(DiscountEntity)
  );
  const modifiersService =
    testingModule.get<ModifiersService>(ModifiersService);

  jest.spyOn(productsService, "find").mockResolvedValueOnce(products);
  jest.spyOn(discountsRepository, "find").mockResolvedValueOnce([discount]);
  jest
    .spyOn(modifiersService, "find")
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

  const calculatedDiscount = await discountsService.calculate({
    products: orderedProducts,
  } as Order);

  return { calculatedDiscount, totalOrderCost };
};
