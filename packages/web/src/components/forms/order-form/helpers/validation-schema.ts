import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup
    .string()
    .max(50, "Имя не должно превышать 50 символов")
    .required("Это поле является обязательным"),
  phoneNumber: yup
    .string()
    .matches(
      /^\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/,
      "Номер телефона указан неверно"
    )
    .required("Это поле является обязательным"),
  email: yup.string().max(50, "Адрес почты не должен превышать 50 символов"),
  address: yup
    .string()
    .max(50, "Адрес не должен превышать 50 символов")
    .required("Это поле является обязательным"),
  house: yup
    .string()
    .max(50, "Номер дома не должен превышать 50 символов")
    .required("Это поле является обязательным"),
  entrance: yup
    .string()
    .max(2, "Номер парадной не должен превышать 2-х символов")
    .required("Это поле является обязательным"),
  floor: yup
    .string()
    .max(2, "Номер этажа не должен превышать 2-х символов")
    .required("Это поле является обязательным"),
  apartment: yup
    .string()
    .max(3, "Номер квартиры не должен превышать 2-х символов")
    .required("Это поле является обязательным"),
  description: yup
    .string()
    .max(100, "Комментарий не должен превышать 100 символов"),
  payment_uuid: yup.string().required("Это поле является обязательным"),
});

export default validationSchema;