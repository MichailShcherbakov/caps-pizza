import { SelectChangeEvent } from "@mui/material";
import React from "react";
import { ProductWeightTypeEnum } from "~/services/products.service";
import { TextFieldWithSelect } from "~/ui";
import { locale } from "@monorepo/common";

const WEIGHT_INPUT_OPTIONS = [
  {
    name: locale[ProductWeightTypeEnum.GRAMS],
    value: ProductWeightTypeEnum.GRAMS,
  },
  {
    name: locale[ProductWeightTypeEnum.LITERS],
    value: ProductWeightTypeEnum.LITERS,
  },
];

export interface WeightTextFieldProps {
  weight: string;
  touched?: boolean;
  errors?: string;
  weightType: ProductWeightTypeEnum;
  onChange: (
    e: React.ChangeEvent | SelectChangeEvent<unknown>,
    child?: React.ReactNode
  ) => void;
}

export const WeightTextField: React.FC<WeightTextFieldProps> = React.memo(
  ({
    weight,
    touched,
    errors,
    weightType = ProductWeightTypeEnum.GRAMS,
    onChange,
  }) => {
    return (
      <TextFieldWithSelect
        TextFieldProps={{
          id: "weight",
          name: "weight",
          type: "number",
          label: "Вес",
          value: weight,
          error: touched && Boolean(errors),
          helperText: touched && errors,
          onChange,
        }}
        SelectProps={{
          id: "weightType",
          name: "weightType",
          label: "Тип",
          value: weightType,
          onChange,
        }}
        options={WEIGHT_INPUT_OPTIONS}
      />
    );
  }
);

WeightTextField.displayName = "WeightTextField";

export default WeightTextField;
