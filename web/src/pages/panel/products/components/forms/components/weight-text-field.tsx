import { SelectChangeEvent } from "@mui/material";
import React from "react";
import { ProductWeightType } from "~/services/products.service";
import { TextFieldWithSelect } from "~/ui";
import locale from "../../helpers/locale";

const WEIGHT_INPUT_OPTIONS = [
  { name: locale[ProductWeightType.GRAMS], value: ProductWeightType.GRAMS },
  { name: locale[ProductWeightType.LITERS], value: ProductWeightType.LITERS },
];

export interface WeightTextFieldProps {
  weight: string;
  touched?: boolean;
  errors?: string;
  weightType: ProductWeightType;
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
    weightType = ProductWeightType.GRAMS,
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
