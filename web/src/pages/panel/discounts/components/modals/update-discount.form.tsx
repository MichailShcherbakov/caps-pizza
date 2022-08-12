import React from "react";
import { useFormik } from "formik";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import UiKit, { FormModalProps } from "~/ui";
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
import locale from "../helpers/locale";
import formatProductFeatures from "../helpers/format-product-features";

export interface UpdateDiscountFormProps
  extends Omit<FormModalProps, "title" | "onSubmit"> {
  discount: Discount;
  products: Product[];
  productCategories: ProductCategory[];
  modifiers: Modifier[];
  onSubmit?: (value: UpdateDiscountPayload) => void;
}

export default function UpdateDiscountForm({
  discount,
  products,
  productCategories,
  modifiers,
  onSubmit,
  ...props
}: UpdateDiscountFormProps) {
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
    <UiKit.FormModal
      {...props}
      title="Создание новой скидки"
      onSubmit={formik.handleSubmit}
      onCancel={props.onClose}
    >
      <TextField
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
      <FormControl color="secondary" fullWidth>
        <InputLabel size="small">Область действия</InputLabel>
        <Select
          id="scope"
          name="scope"
          value={formik.values.scope}
          label="Область действия"
          size="small"
          onChange={formik.handleChange}
        >
          <MenuItem value={DiscountScopeEnum.PRODUCTS}>
            {locale[DiscountScopeEnum.PRODUCTS]}
          </MenuItem>
          <MenuItem value={DiscountScopeEnum.PRODUCT_FEATURES}>
            {locale[DiscountScopeEnum.PRODUCT_FEATURES]}
          </MenuItem>
          <MenuItem value={DiscountScopeEnum.GLOBAL}>
            {locale[DiscountScopeEnum.GLOBAL]}
          </MenuItem>
        </Select>
      </FormControl>
      <Stack direction="row" alignItems="center" spacing={2}>
        <FormControl color="secondary" fullWidth>
          <InputLabel size="small">Критерий</InputLabel>
          <Select
            id="conditionCriteria"
            name="conditionCriteria"
            value={formik.values.conditionCriteria}
            label="Критерий"
            size="small"
            onChange={formik.handleChange}
          >
            <MenuItem value={DiscountCriteriaEnum.COUNT}>
              {locale[DiscountCriteriaEnum.COUNT]}
            </MenuItem>
            <MenuItem value={DiscountCriteriaEnum.PRICE}>
              {locale[DiscountCriteriaEnum.PRICE]}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl color="secondary" fullWidth>
          <InputLabel size="small">Оператор</InputLabel>
          <Select
            id="conditionOp"
            name="conditionOp"
            value={formik.values.conditionOp}
            label="Оператор"
            size="small"
            onChange={formik.handleChange}
          >
            <MenuItem value={DiscountOperatorEnum.EQUAL}>
              {locale[DiscountOperatorEnum.EQUAL]}
            </MenuItem>
            <MenuItem value={DiscountOperatorEnum.LESS}>
              {locale[DiscountOperatorEnum.LESS]}
            </MenuItem>
            <MenuItem value={DiscountOperatorEnum.GREATER}>
              {locale[DiscountOperatorEnum.GREATER]}
            </MenuItem>
            <MenuItem value={DiscountOperatorEnum.BETWEEN}>
              {locale[DiscountOperatorEnum.BETWEEN]}
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
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
        />
        {formik.values.conditionOp === DiscountOperatorEnum.BETWEEN ? (
          <TextField
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
          />
        ) : undefined}
      </Stack>
      <FormControl color="secondary" fullWidth>
        <InputLabel size="small">Тип</InputLabel>
        <Select
          id="type"
          name="type"
          value={formik.values.type}
          label="Тип"
          size="small"
          onChange={formik.handleChange}
        >
          <MenuItem value={DiscountTypeEnum.PERCENT}>
            {locale[DiscountTypeEnum.PERCENT]}
          </MenuItem>
          <MenuItem value={DiscountTypeEnum.IN_CASH}>
            {locale[DiscountTypeEnum.IN_CASH]}
          </MenuItem>
          <MenuItem value={DiscountTypeEnum.FIXED_PRICE}>
            {locale[DiscountTypeEnum.FIXED_PRICE]}
          </MenuItem>
        </Select>
      </FormControl>
      <TextField
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
    </UiKit.FormModal>
  );
}
