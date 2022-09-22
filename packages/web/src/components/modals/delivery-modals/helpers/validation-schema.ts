import * as yup from "yup";
import {
  DeliveryCriteriaEnum,
  DeliveryOperatorEnum,
  DeliveryTypeEnum,
} from "~/services/delivery.service";

export const validationSchema = yup.object({
  name: yup
    .string()
    .max(30, "Название не должно превышать 30 символов")
    .required("Это поле является обязательным"),
  articleNumber: yup
    .number()
    .min(0, "Артикул доставки должен быть положительным")
    .max(99999, "Значение артикла невалидно")
    .required("Это поле является обязательным"),
  type: yup
    .string()
    .oneOf([DeliveryTypeEnum.PERCENT, DeliveryTypeEnum.IN_CASH])
    .required("Это поле является обязательным"),
  conditionCriteria: yup
    .string()
    .oneOf([DeliveryCriteriaEnum.PRICE, DeliveryCriteriaEnum.COUNT])
    .required("Это поле является обязательным"),
  conditionOp: yup
    .string()
    .oneOf([
      DeliveryOperatorEnum.LESS,
      DeliveryOperatorEnum.GREATER,
      DeliveryOperatorEnum.EQUAL,
      DeliveryOperatorEnum.BETWEEN,
    ])
    .required("Это поле является обязательным"),
  conditionValue: yup
    .number()
    .min(0, "Значение скидки должно быть положительным")
    .max(99999, "Значение скидки невалидно")
    .required("Это поле является обязательным"),
  conditionValue2: yup
    .number()
    .min(0, "Значение скидки должно быть положительным")
    .max(99999, "Значение скидки невалидно"),
  value: yup
    .number()
    .min(0, "Значение доставки должена быть положительной")
    .max(99999, "Значение доставки невалидно")
    .required("Это поле является обязательным"),
});

export default validationSchema;
