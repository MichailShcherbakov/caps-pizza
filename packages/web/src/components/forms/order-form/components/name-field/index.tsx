import React from "react";
import { MaskedTextField, TextFieldProps } from "~/ui";

export type NameFieldProps = TextFieldProps;

export const NameField: React.FC<NameFieldProps> = React.memo(props => {
  return (
    <MaskedTextField
      {...props}
      fullWidth
      id="name"
      name="name"
      label="Имя"
      placeholder="Алексей"
      options={{ mask: /[ЁёА-я ]$/ }}
    />
  );
});

NameField.displayName = "NameField";

export default NameField;
