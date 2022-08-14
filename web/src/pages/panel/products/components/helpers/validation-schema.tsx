import * as yup from "yup";
import {
  ProductVolumeType,
  ProductWeightType,
} from "~/services/products.service";

export const validationSchema = yup.object({
  name: yup
    .string()
    .max(50, "Название товара не должно превышать 50 символов")
    .required("Это поле является обязательным"),
  desc: yup
    .string()
    .max(200, "Описание товара не должно превышать 50 символов"),
  articleNumber: yup
    .number()
    .positive("Артикул товара должен быть положительным")
    .required("Это поле является обязательным"),
  imageURL: yup.string().required("Это поле является обязательным"),
  price: yup
    .number()
    .min(0, "Цена товара должена быть положительной")
    .required("Это поле является обязательным"),
  categoryUUID: yup.string().required("Это поле является обязательным"),
  volume: yup
    .number()
    .min(0, "Объем товара должен быть положительным")
    .required("Это поле является обязательным"),
  volumeType: yup
    .string()
    .oneOf([ProductVolumeType.DIAMETER, ProductVolumeType.QUANTITY])
    .required("Это поле является обязательным"),
  weight: yup
    .number()
    .min(0, "Вес товара должен быть положительным")
    .required("Это поле является обязательным"),
  weightType: yup
    .string()
    .oneOf([ProductWeightType.GRAMS, ProductWeightType.LITERS])
    .required("Это поле является обязательным"),
});

export default validationSchema;
