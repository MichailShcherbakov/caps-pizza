import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup
    .string()
    .max(50, "Название модификатора не должно превышать 50 символов")
    .required("Это поле является обязательным"),
  desc: yup
    .string()
    .max(50, "Описание модификатора не должно превышать 50 символов"),
  article_number: yup
    .number()
    .positive("Артикул модификатора должен быть положительным")
    .required("Это поле является обязательным"),
  price: yup
    .number()
    .min(0, "Цена модификатора должена быть положительной")
    .required("Это поле является обязательным"),
  category_uuid: yup.string().required("Это поле является обязательным"),
  display_position: yup.number().min(1, "Позиция не должна быть меньше 1"),
});

export default validationSchema;
