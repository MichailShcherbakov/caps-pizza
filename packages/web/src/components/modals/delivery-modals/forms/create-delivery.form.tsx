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
  CreateDeliveryPayload,
} from "~/services/delivery.service";
import validationSchema from "../helpers/validation-schema";
import DeliveryCriteriaSelect from "./components/condition-criteria-select";
import DeliveryOperatorSelect from "./components/condition-operator-select";
import DeliveryTypeSelect from "./components/type-select";
import { DiscountTypeEnum } from "~/services/discounts.service";
import { useStyle } from "./index.style";

export type CreateDeliveryFormSubmitData = CreateDeliveryPayload;

export interface CreateDeliveryFormProps {
  onSubmit?: (value: CreateDeliveryFormSubmitData) => void;
  onCancel?: () => void;
}

export const CreateDeliveryForm: React.FC<CreateDeliveryFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { classes } = useStyle();
  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      articleNumber: "",
      conditionCriteria: "",
      conditionOp: "",
      conditionValue: "",
      conditionValue2: "",
      value: "",
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          name: value.name,
          article_number: Number.parseFloat(value.articleNumber),
          type: value.type as DeliveryTypeEnum,
          condition: {
            criteria: value.conditionCriteria as DeliveryCriteriaEnum,
            op: value.conditionOp as DeliveryOperatorEnum,
            value: Number.parseFloat(value.conditionValue),
            value2:
              value.conditionValue2 &&
              value.conditionOp === DeliveryOperatorEnum.BETWEEN
                ? Number.parseFloat(value.conditionValue2)
                : undefined,
          },
          value: Number.parseFloat(value.value),
        });
    },
  });

  return (
    <ModalControl component="form" onSubmit={formik.handleSubmit}>
      <ModalHeader title="Создание новой доставки" />
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
          className={classes.deliveryCondition}
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
          onChange={e => {
            if (
              e.target.value === DeliveryTypeEnum.PERCENT &&
              Number.parseFloat(formik.values.value) > 100
            ) {
              formik.setFieldValue("value", "");
            }

            formik.handleChange(e);
          }}
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
          onChange={e => {
            if (
              formik.values.type === DiscountTypeEnum.PERCENT &&
              Number.parseFloat(e.target.value) > 100
            ) {
              return;
            }

            formik.handleChange(e);
          }}
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

export default CreateDeliveryForm;
