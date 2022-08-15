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
  DiscountScopeEnum,
  DiscountTypeEnum,
  DiscountOperatorEnum,
  DiscountCriteriaEnum,
  UpdateDiscountPayload,
  Discount,
} from "~/services/discounts.service";
import validationSchema from "../helpers/validation-schema";
import { Product } from "~/services/products.service";
import { ProductCategory } from "~/services/product-categories.service";
import { Modifier } from "~/services/modifiers.service";
import ProductFeaturesList from "../helpers/product-features-list";
import ProductsList from "../helpers/products-list";
import formatProductFeatures from "../helpers/format-product-features";
import DiscountScopeSelect from "./components/scope-select";
import DiscountCriteriaSelect from "./components/condition-criteria-select";
import DiscountOperatorSelect from "./components/condition-operator-select";
import DiscountTypeSelect from "./components/type-select";

export type UpdateDiscountFormSubmitData = UpdateDiscountPayload;

export interface UpdateDiscountFormProps {
  discount: Discount;
  products: Product[];
  productCategories: ProductCategory[];
  modifiers: Modifier[];
  onSubmit?: (value: UpdateDiscountFormSubmitData) => void;
  onCancel?: () => void;
}

export const UpdateDiscountForm: React.FC<UpdateDiscountFormProps> = ({
  discount,
  products,
  productCategories,
  modifiers,
  onSubmit,
  onCancel,
}) => {
  const productFeaturies = React.useMemo(
    () => formatProductFeatures(productCategories, modifiers),
    [productCategories, modifiers]
  );

  const formik = useFormik({
    initialValues: {
      name: discount.name,
      type: discount.type,
      scope: discount.scope,
      conditionCriteria: discount.condition.criteria,
      conditionOp: discount.condition.op,
      conditionValue: discount.condition.value.toString(),
      conditionValue2: discount.condition.value2?.toString() ?? "",
      value: discount.value.toString(),
      products: discount.products,
      product_categories: discount.product_categories,
      modifiers: discount.modifiers,
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          uuid: discount.uuid,
          name: value.name,
          type: value.type as DiscountTypeEnum,
          scope: value.scope as DiscountScopeEnum,
          condition: {
            criteria: value.conditionCriteria as DiscountCriteriaEnum,
            op: value.conditionOp as DiscountOperatorEnum,
            value: Number.parseFloat(value.conditionValue),
            value2:
              value.conditionOp === DiscountOperatorEnum.BETWEEN
                ? Number.parseFloat(value.conditionValue2)
                : undefined,
          },
          value: Number.parseFloat(value.value),
          products_uuids:
            value.scope === DiscountScopeEnum.PRODUCTS
              ? value.products.map(p => p.uuid)
              : [],
          product_categories_uuids:
            value.scope === DiscountScopeEnum.PRODUCT_FEATURES
              ? value.product_categories.map(c => c.uuid)
              : [],
          modifiers_uuids:
            value.scope === DiscountScopeEnum.PRODUCT_FEATURES
              ? value.modifiers.map(m => m.uuid)
              : [],
        });
    },
  });

  return (
    <ModalControl component="form" onSubmit={formik.handleSubmit}>
      <ModalHeader title="Создание новой скидки" />
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
        <DiscountScopeSelect
          value={formik.values.scope}
          onChange={formik.handleChange}
        />
        <Stack direction="row" alignItems="center" spacing={2}>
          <DiscountCriteriaSelect
            value={formik.values.conditionCriteria}
            onChange={formik.handleChange}
          />
          <DiscountOperatorSelect
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
                  DiscountCriteriaEnum.PRICE
                    ? "₽"
                    : "шт"}
                </InputAdornment>
              ),
            }}
          />
          {formik.values.conditionOp === DiscountOperatorEnum.BETWEEN ? (
            <MemoTextField
              fullWidth
              required
              id="conditionValue2"
              name="conditionValue2"
              type="number"
              label="Введите значение условия"
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
                    DiscountCriteriaEnum.PRICE
                      ? "₽"
                      : "шт"}
                  </InputAdornment>
                ),
              }}
            />
          ) : undefined}
        </Stack>
        <DiscountTypeSelect
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
                {formik.values.type === DiscountTypeEnum.PERCENT ? "%" : "₽"}
              </InputAdornment>
            ),
          }}
        />
        {formik.values.scope === DiscountScopeEnum.PRODUCT_FEATURES ? (
          <ProductFeaturesList
            features={productFeaturies}
            value={formatProductFeatures(
              formik.values.product_categories,
              formik.values.modifiers
            )}
            onChange={features => {
              const product_categories: ProductCategory[] = [];
              const modifiers: Modifier[] = [];

              for (const feature of features) {
                if (feature._type === `Категория`)
                  product_categories.push(feature as ProductCategory);
                else if (
                  feature._type ===
                  `Модификатор: ${
                    (feature as Modifier).category?.name ?? "Неизвестно"
                  } `
                )
                  modifiers.push(feature as Modifier);
              }

              formik.setFieldValue("product_categories", product_categories);
              formik.setFieldValue("modifiers", modifiers);
            }}
          />
        ) : undefined}
        {formik.values.scope === DiscountScopeEnum.PRODUCTS ? (
          <ProductsList
            products={products}
            value={formik.values.products}
            onChange={products => formik.setFieldValue("products", products)}
          />
        ) : undefined}
      </ModalContent>
      <ModalFooter onCancel={onCancel} />
    </ModalControl>
  );
};

export default UpdateDiscountForm;
