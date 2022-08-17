import * as yup from "yup";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "~/services/discounts.service";

export const validationSchema = yup.object({
  name: yup
    .string()
    .max(50, "Название не должно превышать 50 символов")
    .required("Это поле является обязательным"),
  type: yup
    .string()
    .oneOf([
      DiscountTypeEnum.PERCENT,
      DiscountTypeEnum.IN_CASH,
      DiscountTypeEnum.FIXED_PRICE,
    ])
    .required("Это поле является обязательным"),
  scope: yup
    .string()
    .oneOf([
      DiscountScopeEnum.PRODUCTS,
      DiscountScopeEnum.PRODUCT_FEATURES,
      DiscountScopeEnum.GLOBAL,
    ])
    .required("Это поле является обязательным"),
  conditionCriteria: yup
    .string()
    .oneOf([DiscountCriteriaEnum.PRICE, DiscountCriteriaEnum.COUNT])
    .required("Это поле является обязательным"),
  conditionOp: yup
    .string()
    .oneOf([
      DiscountOperatorEnum.LESS,
      DiscountOperatorEnum.GREATER,
      DiscountOperatorEnum.EQUAL,
      DiscountOperatorEnum.BETWEEN,
    ])
    .required("Это поле является обязательным"),
  conditionValue: yup
    .number()
    .min(0, "Значение скидки должно быть положительным")
    .required("Это поле является обязательным"),
  conditionValue2: yup
    .number()
    .min(0, "Значение скидки должно быть положительным"),
  value: yup
    .number()
    .min(0, "Значение скидки должно быть положительным")
    .required("Это поле является обязательным"),
});

export default validationSchema;
