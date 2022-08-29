import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
} from "~/services/discounts.service";

export interface DiscountFormData {
  name: string;
  type: DiscountTypeEnum;
  value: string;
  strategies: {
    condition: {
      criteria: DiscountCriteriaEnum;
      op: DiscountOperatorEnum;
      value: string;
      value2: string;
    };
    products_uuids: string[];
    product_categories_uuids: string[];
    modifiers_uuids: string[];
  }[];
}
