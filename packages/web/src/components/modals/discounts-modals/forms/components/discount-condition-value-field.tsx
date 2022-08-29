import { InputAdornment } from "@mui/material";
import React from "react";
import { DiscountCriteriaEnum } from "~/services/discounts.service";
import { MemoTextField, MemoTextFieldProps } from "~/ui";

export type DiscountConditionValueFieldProps = MemoTextFieldProps & {
  criteria: DiscountCriteriaEnum;
};

export const DiscountConditionValueField: React.FC<DiscountConditionValueFieldProps> =
  React.memo(({ criteria, ...props }) => {
    return (
      <MemoTextField
        {...props}
        fullWidth
        required
        type="number"
        label="Введите значение условия"
        size="small"
        color="secondary"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              {criteria === DiscountCriteriaEnum.PRICE ? "₽" : "шт"}
            </InputAdornment>
          ),
        }}
      />
    );
  });

DiscountConditionValueField.displayName = "DiscountConditionValueField";

export default DiscountConditionValueField;
