import React from "react";
import { MaskedTextField, TextFieldProps } from ".";

export type NumberTextFieldProps = TextFieldProps & {
  min?: number;
  max?: number;
};

export const NumberTextField: React.FC<NumberTextFieldProps> = React.memo(
  ({ min, max, ...props }) => {
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