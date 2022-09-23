import React from "react";
import { MaskedTextField, TextFieldProps } from ".";

export type NumberTextFieldProps = TextFieldProps & {
  min?: number;
  max?: number;
  value?: string | number;
};

export const NumberTextField: React.FC<NumberTextFieldProps> = React.memo(
  ({ min = 0, max, ...props }) => {
    return (
      <MaskedTextField
        {...props}
        options={{
          mask: Number,
          min,
          max,
        }}
      />
    );
  }
);

NumberTextField.displayName = "NumberTextField";

export default NumberTextField;
