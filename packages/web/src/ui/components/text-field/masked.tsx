import React from "react";
import TextField, { TextFieldProps } from ".";
import IMask from "imask";
import { useIMask } from "react-imask";
import { InputBaseComponentProps } from "@mui/material";

export type MaskedTextFieldProps = TextFieldProps & {
  options: IMask.AnyMaskedOptions;
  onAccept?: (
    value: string,
    maskRef: React.RefObject<IMask.InputMask<IMask.AnyMaskedOptions>>,
    e?: InputEvent | undefined
  ) => void;
  value?: string | number;
  inputProps?: InputBaseComponentProps;
};

export const MaskedTextField: React.FC<MaskedTextFieldProps> = React.memo(
  ({ options, onChange, onAccept, ...props }) => {
    const { ref, value, maskRef } = useIMask(options, {
      onAccept: (value, _, e) => {
        onAccept?.(value, maskRef, e);

        onChange?.({
          target: { name: props.name, value: maskRef.current?.value },
        } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
      },
    });

    React.useEffect(() => {
      if (!maskRef.current) return;

      maskRef.current.value = props.value?.toString() ?? "";
    }, [maskRef, props.value]);

    return (
      <TextField
        {...props}
        value={value}
        InputProps={{
          inputRef: ref,
          inputProps: props.inputProps,
        }}
      />
    );
  }
);

MaskedTextField.displayName = "MaskedTextField";

export default MaskedTextField;
