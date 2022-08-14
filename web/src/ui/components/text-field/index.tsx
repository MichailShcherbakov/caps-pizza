import React from "react";
import {
  TextField as MUITextField,
  TextFieldProps as MUITextFieldProps,
} from "@mui/material";
import IMask from "imask";
import { useIMask } from "react-imask";
import styles from "./index.module.scss";

export type TextFieldProps = MUITextFieldProps;

export const TextField: React.FC<TextFieldProps> = props => {
  return <MUITextField {...props} />;
};

export type MemoTextFieldProps = MUITextFieldProps;

export const MemoTextField: React.FC<MemoTextFieldProps> = React.memo(props => {
  return <MUITextField {...props} />;
});

MemoTextField.displayName = "MemoTextField";

export type MaskedTextFieldProps = MUITextFieldProps & {
  options: IMask.AnyMaskedOptions;
};

export const MaskedTextField: React.FC<MaskedTextFieldProps> = ({
  options,
  ...props
}) => {
  const { ref, value } = useIMask(options);

  return (
    <MUITextField
      {...props}
      value={value}
      InputProps={{ inputRef: ref }}
      className={styles["text-field"]}
    />
  );
};

export default TextField;
