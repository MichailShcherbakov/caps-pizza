import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup
    .string()
    .max(50, "Название не должно превышать 50 символов")
    .required("Это поле является обязательным"),
  code: yup
    .number()
    .min(1, "Позиция не должна быть меньше 1")
    .max(99999, "Значение позиции невалидно")
    .required("Это поле является обязательным"),
});

export default validationSchema;
