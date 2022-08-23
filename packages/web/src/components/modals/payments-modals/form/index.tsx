import React from "react";
import { useFormik } from "formik";
import { Stack } from "@mui/material";
import {
  MemoTextField,
  ModalContent,
  ModalControl,
  ModalFooter,
  ModalHeader,
} from "~/ui";
import validationSchema from "../helpers/validation-schema";
import { Payment } from "~/services/payments.service";

export type PaymentFormSubmitData = Omit<Payment, "uuid">;

export interface PaymentFormProps {
  payment?: Payment;
  variant: "create" | "update";
  onSubmit?: (data: PaymentFormSubmitData) => void;
  onCancel?: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  payment,
  variant,
  onSubmit,
  onCancel,
}) => {
  const formik = useFormik({
    initialValues: {
      name: payment?.name ?? "",
      code: payment?.code.toString() ?? "",
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          name: value.name,
          code: Number.parseInt(value.code),
        });
    },
  });

  return (
    <ModalControl component="form" onSubmit={formik.handleSubmit}>
      <ModalHeader
        title={
          variant === "create"
            ? "Создание нового варианта оплаты"
            : "Изменение варианта оплаты"
        }
      />
      <ModalContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <MemoTextField
            id="code"
            name="code"
            label="Код"
            type="number"
            value={formik.values.code}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
            size="small"
            color="secondary"
            onChange={formik.handleChange}
          />
          <MemoTextField
            fullWidth
            required
            id="name"
            name="name"
            label="Название"
            value={formik.values.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            size="small"
            color="secondary"
            onChange={formik.handleChange}
          />
        </Stack>
      </ModalContent>
      <ModalFooter onCancel={onCancel} />
    </ModalControl>
  );
};

export default PaymentForm;
