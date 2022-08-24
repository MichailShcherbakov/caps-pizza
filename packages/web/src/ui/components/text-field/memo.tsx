import React from "react";
import TextField, { TextFieldProps } from ".";

export type MemoTextFieldProps = TextFieldProps;

export const MemoTextField: React.FC<MemoTextFieldProps> = React.memo(props => {
  return <TextField {...props} />;
});

MemoTextField.displayName = "MemoTextField";

export default MemoTextField;
