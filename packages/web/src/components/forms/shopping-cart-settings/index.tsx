import { useFormik } from "formik";
import React from "react";
import {
  LoadingBackdrop,
  MemoTextField,
  ModalContent,
  ModalControl,
  ModalFooter,
  ModalHeader,
} from "~/ui";
import validationSchema from "./helpers/validation-schema";
import {
  useGetSettingsQuery,
  useSetSettingsMutation,
} from "~/services/shopping-cart-settings.service";

const ShoppingCartSettingsForm: React.FC = () => {
  const { data: settings, isLoading: isGetSettingsLoading } =
    useGetSettingsQuery();

  const [setSettings, { isLoading: isSetSettingsLoading }] =
    useSetSettingsMutation();

  const formik = useFormik({
    initialValues: { minimum_order_amount: 0 },
    validationSchema,
    onSubmit: value => {
      setSettings(value);
    },
  });

  const { setValues } = formik;

  React.useEffect(() => {
    settings && setValues(settings);
  }, [settings, setValues]);

  if (isGetSettingsLoading || isSetSettingsLoading)
    return <LoadingBackdrop color="secondary" open />;

  return (
    <ModalControl component="form" onSubmit={formik.handleSubmit} px={2}>
      <ModalHeader title="Настройки корзины покупок" />
      <ModalContent>
        <MemoTextField
          id="minimum_order_amount"
          name="minimum_order_amount"
          label="Минимальная сумма заказа"
          type="number"
          value={formik.values.minimum_order_amount}
          error={
            formik.touched.minimum_order_amount &&
            Boolean(formik.errors.minimum_order_amount)
          }
          helperText={
            formik.touched.minimum_order_amount &&
            formik.errors.minimum_order_amount
          }
          size="small"
          color="secondary"
          onChange={formik.handleChange}
        />
      </ModalContent>
      <ModalFooter
        variant="accept"
        AcceptButtonProps={{ children: "Сохранить" }}
      />
    </ModalControl>
  );
};

export default ShoppingCartSettingsForm;
