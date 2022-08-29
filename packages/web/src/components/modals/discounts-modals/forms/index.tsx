import React from "react";
import { FormikProps, withFormik } from "formik";
import {
  Button,
  IconButton,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import {
  DataTable,
  DataTableHead,
  MemoTextField,
  ModalContent,
  ModalControl,
  ModalFooter,
  ModalHeader,
} from "~/ui";
import {
  DiscountTypeEnum,
  DiscountOperatorEnum,
  DiscountCriteriaEnum,
  CreateDiscountPayload,
  Discount,
  DiscountStrategy,
} from "~/services/discounts.service";
import validationSchema from "../helpers/validation-schema";
import { Product } from "~/services/products.service";
import { ProductCategory } from "~/services/product-categories.service";
import { Modifier } from "~/services/modifiers.service";
import DiscountTypeSelect from "./components/type-select";
import AddIcon from "@mui/icons-material/Add";
import ValueField from "./components/value-field";
import { DiscountFormData } from "./types";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { locale } from "@monorepo/common";
import DiscountCriteriaSelect from "./components/condition-criteria-select";
import DiscountOperatorSelect from "./components/condition-operator-select";
import DiscountConditionValueField from "./components/discount-condition-value-field";
import Tabs from "./components/tabs";

export type DiscountFormSubmitData = CreateDiscountPayload;

export interface DiscountFormAuxiliaryData {
  products: Product[];
  productCategories: ProductCategory[];
  modifiers: Modifier[];
  onCancel?: () => void;
}

export interface DiscountFormProps extends DiscountFormAuxiliaryData {
  discount?: Discount;
  onSubmit?: (data: DiscountFormSubmitData) => void;
}

const Form: React.FC<
  DiscountFormAuxiliaryData & FormikProps<DiscountFormData>
> = props => {
  const {
    products,
    productCategories,
    modifiers,
    values,
    touched,
    errors,
    setFieldValue,
    handleChange,
    handleSubmit,
    onCancel,
  } = props;

  const onAddStrategy = React.useCallback(() => {
    setFieldValue(`strategies`, [
      ...values.strategies,
      {
        condition: {
          criteria: "",
          op: "",
          value: "",
          value2: "",
        },
        products_uuids: [],
        product_categories_uuids: [],
        modifiers_uuids: [],
      },
    ]);
  }, [setFieldValue, values.strategies]);

  const onDeleteStrategy = React.useCallback(
    strategy => {
      setFieldValue(
        "strategies",
        values.strategies.filter(s => s !== strategy)
      );
    },
    [setFieldValue, values.strategies]
  );

  const onDiscountTypeChange = React.useCallback(
    (e: SelectChangeEvent<string>) => {
      if (
        e.target.value === DiscountTypeEnum.PERCENT &&
        Number.parseFloat(values.value) > 100
      ) {
        setFieldValue("value", "");
      }

      handleChange(e);
    },
    [handleChange, setFieldValue, values.value]
  );

  const head = React.useMemo<DataTableHead>(
    () => ({
      cols: [
        {
          name: "condition",
          displayName: "Условия предоставления",
          align: "right",
          primary: true,
        },
        {
          type: "component",
          name: "controls",
          displayName: "",
          primary: true,
          component: strategy => {
            return (
              <IconButton
                aria-label="delete"
                size="small"
                color="error"
                onClick={() => onDeleteStrategy(strategy as DiscountStrategy)}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            );
          },
        },
      ],
    }),
    [onDeleteStrategy]
  );

  const rows = React.useMemo(
    () =>
      values.strategies.map((strategy, idx) => ({
        cols: [
          {
            name: "condition",
            value: `${locale[strategy.condition.criteria] ?? ""} ${
              locale[strategy.condition.op]?.toLocaleLowerCase() ?? ""
            } ${strategy.condition.value} ${
              strategy.condition.criteria === DiscountCriteriaEnum.PRICE
                ? "₽"
                : strategy.condition.criteria === DiscountCriteriaEnum.COUNT
                ? "шт."
                : ""
            }
${
  strategy.condition.value2
    ? `и ${strategy.condition.value2} ${
        strategy.condition.criteria === DiscountCriteriaEnum.PRICE
          ? "₽"
          : strategy.condition.criteria === DiscountCriteriaEnum.COUNT
          ? "шт."
          : ""
      }`
    : ""
}`,
          },
          {
            name: "controls",
            value: strategy,
          },
        ],
        collapsedRowSpace() {
          const strategyTouched = touched.strategies && touched.strategies[idx];
          const strategyErrors = errors.strategies && errors.strategies[idx];

          return (
            <Stack className="ui-gap-2 ui-w-full ui-overflow-auto">
              <DiscountCriteriaSelect
                id={`strategies[${idx}].condition.criteria`}
                name={`strategies[${idx}].condition.criteria`}
                value={strategy.condition.criteria}
                onChange={handleChange}
              />
              <DiscountOperatorSelect
                id={`strategies[${idx}].condition.op`}
                name={`strategies[${idx}].condition.op`}
                value={strategy.condition.op}
                onChange={handleChange}
              />
              <DiscountConditionValueField
                criteria={strategy.condition.criteria}
                id={`strategies[${idx}].condition.value`}
                name={`strategies[${idx}].condition.value`}
                value={strategy.condition.value}
                error={
                  strategyTouched?.condition?.value &&
                  Boolean((strategyErrors as any)?.condition?.value)
                }
                helperText={
                  strategyTouched?.condition?.value &&
                  (strategyErrors as any)?.condition?.value
                }
                onChange={handleChange}
              />
              <Tabs
                idx={idx}
                products={products}
                productCategories={productCategories}
                modifiers={modifiers}
              />
            </Stack>
          );
        },
      })),
    [
      errors.strategies,
      handleChange,
      modifiers,
      productCategories,
      products,
      values.strategies,
      touched.strategies,
    ]
  );

  return (
    <ModalControl component="form" onSubmit={handleSubmit}>
      <ModalHeader title="Создание новой скидки" />
      <ModalContent>
        <MemoTextField
          fullWidth
          required
          id="name"
          name="name"
          label="Введите название"
          value={values.name}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          size="small"
          color="secondary"
          onChange={handleChange}
        />
        <DiscountTypeSelect
          value={values.type}
          onChange={onDiscountTypeChange}
        />
        <ValueField
          type={values.type}
          value={values.value}
          error={touched.value && Boolean(errors.value)}
          helperText={touched.value && errors.value}
          onChange={handleChange}
        />
        {values.strategies.length ? (
          <DataTable head={head} rows={rows} />
        ) : undefined}
        <Button
          size="small"
          color="secondary"
          startIcon={<AddIcon fontSize="small" />}
          onClick={onAddStrategy}
        >
          <Typography>Добавить условие предоставления</Typography>
        </Button>
      </ModalContent>
      <ModalFooter onCancel={onCancel} />
    </ModalControl>
  );
};

export const DiscountForm = withFormik<DiscountFormProps, DiscountFormData>({
  mapPropsToValues: ({ discount }) => ({
    name: discount?.name ?? "",
    type: discount?.type ?? ("" as DiscountTypeEnum),
    value: discount?.value.toString() ?? "",
    strategies:
      discount?.strategies.map(s => ({
        condition: {
          criteria: s.condition.criteria,
          op: s.condition.op,
          value: s.condition.value.toString(),
          value2: s.condition.value2?.toString() ?? "",
        },
        products_uuids: s.products.map(p => p.uuid),
        product_categories_uuids: s.product_categories.map(c => c.uuid),
        modifiers_uuids: s.modifiers.map(m => m.uuid),
      })) ?? [],
  }),
  validationSchema,
  handleSubmit: (value, { props: { onSubmit } }) => {
    onSubmit &&
      onSubmit({
        name: value.name,
        type: value.type as DiscountTypeEnum,
        value: Number.parseFloat(value.value),
        strategies: value.strategies.map(s => ({
          condition: {
            criteria: s.condition.criteria as DiscountCriteriaEnum,
            op: s.condition.op as DiscountOperatorEnum,
            value: Number.parseFloat(s.condition.value),
            value2:
              s.condition.value2.length &&
              s.condition.op === DiscountOperatorEnum.BETWEEN
                ? Number.parseFloat(s.condition.value2)
                : undefined,
          },
          products_uuids: s.products_uuids,
          product_categories_uuids: s.product_categories_uuids,
          modifiers_uuids: s.modifiers_uuids,
        })),
      });
  },
})(Form);

export default DiscountForm;
