import * as yup from "yup";
import {
  DeliveryCriteriaEnum,
  DeliveryOperatorEnum,
  DeliveryTypeEnum,
} from "~/services/delivery.service";

export const validationSchema = yup.object({
  name: yup
    .string()
    .max(50, "Название не должно превышать 50 символов")
    .required("Это поле является обязательным"),
  articleNumber: yup
    .number()
    .min(0, "Артикул доставки должен быть положительным")
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
    .required("Это поле является обязательным"),
  conditionValue2: yup
    .number()
    .min(0, "Значение скидки должно быть положительным"),
  value: yup
    .number()
    .min(0, "Значение доставки должена быть положительной")
    .required("Это поле является обязательным"),
});

export default validationSchema;
