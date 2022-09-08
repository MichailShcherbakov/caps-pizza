import * as yup from "yup";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
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
  value: yup
    .number()
    .min(0, "Значение скидки должно быть положительным")
    .max(99999, "Значение скидки невалидно")
    .required("Это поле является обязательным"),
  strategies: yup
    .array()
    .min(1, "Для скидок необходима как минимум одна стратегия")
    .of(
      yup.object({
        condition: yup
          .object({
            criteria: yup
              .string()
              .oneOf([DiscountCriteriaEnum.PRICE, DiscountCriteriaEnum.COUNT])
              .required("Это поле является обязательным"),
            op: yup
              .string()
              .oneOf([
                DiscountOperatorEnum.LESS,
                DiscountOperatorEnum.GREATER,
                DiscountOperatorEnum.EQUAL,
                DiscountOperatorEnum.BETWEEN,
              ])
              .required("Это поле является обязательным"),
            value: yup
              .number()
              .min(0, "Значение скидки должно быть положительным")
              .required("Это поле является обязательным"),
            value2: yup
              .number()
              .min(0, "Значение скидки должно быть положительным"),
          })
          .required(),
        products_uuids: yup.array().of(yup.string()).required(),
        product_categories_uuids: yup.array().of(yup.string()).required(),
        modifiers_uuids: yup.array().of(yup.string()).required(),
      })
    ),
});

export default validationSchema;
