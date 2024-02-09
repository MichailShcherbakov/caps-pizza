import * as yup from "yup";

export const validationSchema = yup.object({
  minimum_order_amount: yup
    .number()
    .min(0, "Минимальная сумма заказа не может быть меньше 0")
    .required("Это поле является обязательным"),
});

export default validationSchema;
