import React from "react";
import {
  TextField as MUITextField,
  TextFieldProps as MUITextFieldProps,
} from "@mui/material";

export * from "./masked";
export * from "./memo";
export * from "./number";
export * from "./with-select";

export type TextFieldProps = MUITextFieldProps;

export const TextField: React.FC<TextFieldProps> = props => {
  return <MUITextField {...props} />;
};

export default TextField;
