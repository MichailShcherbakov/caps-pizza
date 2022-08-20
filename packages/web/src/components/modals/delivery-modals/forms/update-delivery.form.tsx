import React from "react";
import { useFormik } from "formik";
import { InputAdornment, Stack } from "@mui/material";
import {
  MemoTextField,
  ModalContent,
  ModalControl,
  ModalFooter,
  ModalHeader,
} from "~/ui";
import {
  DeliveryTypeEnum,
  DeliveryOperatorEnum,
  DeliveryCriteriaEnum,
  UpdateDeliveryPayload,
  Delivery,
} from "~/services/delivery.service";
import validationSchema from "../helpers/validation-schema";
import DeliveryCriteriaSelect from "./components/condition-criteria-select";
import DeliveryOperatorSelect from "./components/condition-operator-select";
import DeliveryTypeSelect from "./components/type-select";
import styles from "./index.module.scss";

export type UpdateDeliveryFormSubmitData = UpdateDeliveryPayload;

export interface UpdateDeliveryFormProps {
  delivery: Delivery;
  onSubmit?: (value: UpdateDeliveryFormSubmitData) => void;
  onCancel?: () => void;
}

export const UpdateDeliveryForm: React.FC<UpdateDeliveryFormProps> = ({
  delivery,
  onSubmit,
  onCancel,
}) => {
  const formik = useFormik({
    initialValues: {
      name: delivery.name,
      type: delivery.type,
      articleNumber: delivery.article_number,
      conditionCriteria: delivery.condition.criteria,
      conditionOp: delivery.condition.op,
      conditionValue: delivery.condition.value,
      conditionValue2: delivery.condition.value2,
      value: delivery.value,
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          uuid: delivery.uuid,
          name: value.name,
          article_number: value.articleNumber,
          type: value.type as DeliveryTypeEnum,
          condition: {
            criteria: value.conditionCriteria as DeliveryCriteriaEnum,
            op: value.conditionOp as DeliveryOperatorEnum,
            value: value.conditionValue,
            value2:
              value.conditionValue2 &&
              value.conditionOp === DeliveryOperatorEnum.BETWEEN
                ? value.conditionValue2
                : undefined,
          },
          value: value.value,
        });
    },
  });

  return (
    <ModalControl component="form" onSubmit={formik.handleSubmit}>
      <ModalHeader title="Изменение доставки" />
      <ModalContent>
        <MemoTextField
          fullWidth
          required
          id="name"
          name="name"
          label="Введите название"
          value={formik.values.name}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          size="small"
          color="secondary"
          onChange={formik.handleChange}
        />
        <MemoTextField
          fullWidth
          required
          id="articleNumber"
          name="articleNumber"
          type="number"
          label="Артикул"
          value={formik.values.articleNumber}
          error={
            formik.touched.articleNumber && Boolean(formik.errors.articleNumber)
          }
          helperText={
            formik.touched.articleNumber && formik.errors.articleNumber
          }
          size="small"
          color="secondary"
          onChange={formik.handleChange}
        />
        <Stack
          direction="row"
          alignItems="center"
          className={styles["delivery-condition"]}
        >
          <DeliveryCriteriaSelect
            value={formik.values.conditionCriteria}
            onChange={formik.handleChange}
          />
          <DeliveryOperatorSelect
            value={formik.values.conditionOp}
            onChange={formik.handleChange}
          />
          <MemoTextField
            fullWidth
            required
            id="conditionValue"
            name="conditionValue"
            type="number"
            label="Введите значение условия"
            value={formik.values.conditionValue}
            error={
              formik.touched.conditionValue &&
              Boolean(formik.errors.conditionValue)
            }
            helperText={
              formik.touched.conditionValue && formik.errors.conditionValue
            }
            size="small"
            color="secondary"
            onChange={formik.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {formik.values.conditionCriteria ===
                  DeliveryCriteriaEnum.PRICE
                    ? "₽"
                    : "шт"}
                </InputAdornment>
              ),
            }}
          />
          {formik.values.conditionOp === DeliveryOperatorEnum.BETWEEN ? (
            <MemoTextField
              fullWidth
              required
              id="conditionValue2"
              name="conditionValue2"
              type="number"
              label="Введите значение условия 2"
              value={formik.values.conditionValue2}
              error={
                formik.touched.conditionValue2 &&
                Boolean(formik.errors.conditionValue2)
              }
              helperText={
                formik.touched.conditionValue2 && formik.errors.conditionValue2
              }
              size="small"
              color="secondary"
              onChange={formik.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    {formik.values.conditionCriteria ===
                    DeliveryCriteriaEnum.PRICE
                      ? "₽"
                      : "шт"}
                  </InputAdornment>
                ),
              }}
            />
          ) : undefined}
        </Stack>
        <DeliveryTypeSelect
          value={formik.values.type}
          onChange={formik.handleChange}
        />
        <MemoTextField
          fullWidth
          required
          id="value"
          name="value"
          type="number"
          label="Введите значение"
          value={formik.values.value}
          error={formik.touched.value && Boolean(formik.errors.value)}
          helperText={formik.touched.value && formik.errors.value}
          size="small"
          color="secondary"
          onChange={formik.handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                {formik.values.type === DeliveryTypeEnum.PERCENT ? "%" : "₽"}
              </InputAdornment>
            ),
          }}
        />
      </ModalContent>
      <ModalFooter onCancel={onCancel} />
    </ModalControl>
  );
};

export default UpdateDeliveryForm;
