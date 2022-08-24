import React from "react";
import TextField, { TextFieldProps } from ".";
import IMask from "imask";
import { useIMask } from "react-imask";
import styles from "./index.module.scss";

export type MaskedTextFieldProps = TextFieldProps & {
  options: IMask.AnyMaskedOptions;
  onAccept?: (
    value: string,
    maskRef: React.MutableRefObject<IMask.InputMask<IMask.AnyMaskedOptions>>,
    e?: InputEvent | undefined
  ) => void;
};

export const MaskedTextField: React.FC<MaskedTextFieldProps> = React.memo(
  ({ options, onChange, onAccept, ...props }) => {
    const { ref, value, maskRef } = useIMask(options, {
      onAccept: (value, _, e) => {
        if (onAccept) {
          onAccept(value, maskRef, e);
        }

        onChange &&
          onChange({
            target: { name: props.name, value: maskRef.current.value },
          } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
      },
    });

    return (
      <TextField
        {...props}
        value={value}
        InputProps={{ inputRef: ref }}
        className={styles["text-field"]}
      />
    );
  }
);

MaskedTextField.displayName = "MaskedTextField";

export default MaskedTextField;
