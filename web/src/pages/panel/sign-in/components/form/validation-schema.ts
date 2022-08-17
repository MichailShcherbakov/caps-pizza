import * as yup from "yup";

export const validationSchema = yup.object({
  username: yup.string().required("Это поле обязательным"),
  password: yup.string().required("Это поле обязательным"),
});

export default validationSchema;
