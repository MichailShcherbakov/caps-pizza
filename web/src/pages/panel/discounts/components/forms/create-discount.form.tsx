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
  CreateDiscountPayload,
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
import styles from "./index.module.scss";

export type CreateDiscountFormSubmitData = CreateDiscountPayload;

export interface CreateDiscountFormProps {
  products: Product[];
  productCategories: ProductCategory[];
  modifiers: Modifier[];
  onSubmit?: (value: CreateDiscountFormSubmitData) => void;
  onCancel?: () => void;
}

export const CreateDiscountForm: React.FC<CreateDiscountFormProps> = ({
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
      name: "",
      type: "" as DiscountTypeEnum,
      scope: "" as DiscountScopeEnum,
      conditionCriteria: "" as DiscountCriteriaEnum,
      conditionOp: "" as DiscountOperatorEnum,
      conditionValue: "",
      conditionValue2: "",
      value: "",
      products: [] as Product[],
      product_categories: [] as ProductCategory[],
      modifiers: [] as Modifier[],
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          name: value.name,
          type: value.type as DiscountTypeEnum,
          scope: value.scope as DiscountScopeEnum,
          condition: {
            criteria: value.conditionCriteria as DiscountCriteriaEnum,
            op: value.conditionOp as DiscountOperatorEnum,
            value: Number.parseFloat(value.conditionValue),
            value2:
              value.conditionValue2.length &&
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
          type={formik.values.type}
          conditionCriteria={formik.values.conditionCriteria}
          value={formik.values.scope}
          onChange={formik.handleChange}
        />
        <Stack
          direction="row"
          alignItems="center"
          className={styles["discount-condition"]}
        >
          <DiscountCriteriaSelect
            type={formik.values.type}
            scope={formik.values.scope}
            value={formik.values.conditionCriteria}
            onChange={formik.handleChange}
          />
          <DiscountOperatorSelect
            type={formik.values.type}
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
          scope={formik.values.scope}
          conditionCriteria={
            formik.values.conditionCriteria.length
              ? formik.values.conditionCriteria
              : undefined
          }
          conditionOp={
            formik.values.conditionOp.length
              ? formik.values.conditionOp
              : undefined
          }
          value={formik.values.type}
          onChange={e => {
            if (
              e.target.value === DiscountTypeEnum.PERCENT &&
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
                {formik.values.type === DiscountTypeEnum.PERCENT ? "%" : "₽"}
              </InputAdornment>
            ),
          }}
        />
        {formik.values.scope === DiscountScopeEnum.PRODUCT_FEATURES &&
        productFeaturies.length ? (
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
        {formik.values.scope === DiscountScopeEnum.PRODUCTS &&
        products.length ? (
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

export default CreateDiscountForm;
