import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup
    .string()
    .max(100, "Название акции не должно превышать 100 символов")
    .required("Это поле является обязательным"),
  image_url: yup.string().required("Это поле является обязательным"),
  display: yup.boolean().required("Это поле является обязательным"),
  display_position: yup
    .number()
    .min(1, "Позиция не должна быть меньше 1")
    .max(99999, "Позиция не должна быть больше 99999"),
});

export default validationSchema;
