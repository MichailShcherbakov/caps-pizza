import * as yup from "yup";

export const validationSchema = yup.object({
  username: yup
    .string()
    .max(50, "Слишком длинное значение")
    .required("Это поле обязательным"),
  password: yup
    .string()
    .max(50, "Слишком длинное значение")
    .required("Это поле обязательным"),
});

export default validationSchema;
