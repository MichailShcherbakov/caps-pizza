import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
  IDiscount,
  IProduct,
} from "../../../interfaces";
import calculateDiscount, { IOrderedProduct } from "../calculate-discount";
import createDiscount from "./helpers/create-discount.helper";
import createProduct from "./helpers/create-product.helper";

describe("[Discount Module] ...", () => {
  it("should correct calculate a discount", () => {
    const orderCost = 440 * 3;
    const discountValue = 1199;
    const products: IOrderedProduct[] = [
      createProduct({
        fullPrice: 440,
        count: 3,
      }),
    ];
    const discounts: IDiscount[] = [
      createDiscount({
        type: DiscountTypeEnum.FIXED_PRICE,
        value: discountValue,
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
      }),
    ];

    const discount = calculateDiscount({
      products,
      discounts,
    });

    expect(discount).toEqual(orderCost - discountValue);
  });
});
