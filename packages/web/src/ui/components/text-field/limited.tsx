import React from "react";
import { MaskedTextField, MemoTextField, TextFieldProps } from ".";

export type LimitedTextFieldProps = TextFieldProps & {
  maxLength?: number;
  value?: string | number;
  masked?: boolean;
};

export const LimitedTextField: React.FC<LimitedTextFieldProps> = React.memo(
  ({ masked, ...props }) => {
    return masked ? (
      <MaskedTextField
        {...props}
        inputProps={{ maxLength: props.maxLength }}
        options={{
          mask: /[ЁёА-я0-9A-Za-z.,\- ]$/,
          maxLength: props.maxLength,
        }}
      />
    ) : (
      <MemoTextField {...props} inputProps={{ maxLength: props.maxLength }} />
    );
  }
);

LimitedTextField.displayName = "LimitedTextField";

export default LimitedTextField;
