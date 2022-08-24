import React from "react";
import { MaskedTextField, TextFieldProps } from "~/ui";

export type PhoneNumberFieldProps = TextFieldProps & {
  value: string;
  onChange?: (e: React.ChangeEvent) => void;
};

export const PhoneNumberField: React.FC<PhoneNumberFieldProps> = React.memo(
  ({ value, onChange, ...props }) => {
    const prefValue = React.useRef(value);
    return (
      <MaskedTextField
        {...props}
        fullWidth
        label="Номер телефона"
        placeholder="+7"
        options={{
          mask: "+7 (000) 000-00-00",
        }}
        value={value}
        onChange={onChange}
        onAccept={(value, maskRef) => {
          let val = value;

          if (
            (!prefValue.current || prefValue.current === "") &&
            val === "+7 (8"
          ) {
            val = "+7";
            maskRef.current.value = val;
          }

          prefValue.current = val;
        }}
      />
    );
  }
);

PhoneNumberField.displayName = "PhoneNumberField";

export default PhoneNumberField;
