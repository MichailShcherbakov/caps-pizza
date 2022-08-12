import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup
    .string()
    .max(50, "Название товара не должно превышать 50 символов")
    .required("Это поле является обязательным"),
  desc: yup
    .string()
    .max(200, "Описание товара не должно превышать 50 символов"),
  article_number: yup
    .number()
    .positive("Артикул товара должен быть положительным")
    .required("Это поле является обязательным"),
  image_url: yup.string().required("Это поле является обязательным"),
  price: yup
    .number()
    .min(0, "Цена товара должена быть положительной")
    .required("Это поле является обязательным"),
  category_uuid: yup.string().required("Это поле является обязательным"),
});

export default validationSchema;
