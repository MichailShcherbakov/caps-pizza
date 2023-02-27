import React from "react";
import { MaskedTextField, TextFieldProps } from ".";

export type NumberTextFieldProps = TextFieldProps & {
  maxLength?: number;
  value?: string | number;
};

export const LimitedTextField: React.FC<NumberTextFieldProps> = React.memo(
  props => {
    return (
      <MaskedTextField
        {...props}
        inputProps={{ maxLength: props.maxLength }}
        options={{
          mask: /[ЁёА-я0-9A-Za-z ]$/,
          maxLength: props.maxLength,
        }}
      />
    );
  }
);

LimitedTextField.displayName = "NumberTextField";

export default LimitedTextField;
