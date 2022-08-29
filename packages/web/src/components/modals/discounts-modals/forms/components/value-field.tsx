import { InputAdornment } from "@mui/material";
import React from "react";
import { DiscountTypeEnum } from "~/services/discounts.service";
import { MemoTextField, MemoTextFieldProps } from "~/ui";

export type ValueFieldProps = MemoTextFieldProps & {
  type: DiscountTypeEnum;
};

export const ValueField: React.FC<ValueFieldProps> = React.memo(
  ({ type, onChange, ...props }) => {
    return (
      <MemoTextField
        {...props}
        fullWidth
        required
        id="value"
        name="value"
        type="number"
        label="Введите значение"
        size="small"
        color="secondary"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              {type === DiscountTypeEnum.PERCENT ? "%" : "₽"}
            </InputAdornment>
          ),
        }}
        onChange={e => {
          if (
            type === DiscountTypeEnum.PERCENT &&
            Number.parseFloat(e.target.value) > 100
          ) {
            return;
          }

          onChange && onChange(e);
        }}
      />
    );
  }
);

ValueField.displayName = "ValueField";

export default ValueField;
