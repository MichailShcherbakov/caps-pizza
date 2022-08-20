import React from "react";
import Modal, { ModalProps } from ".";

export interface FormComponentProps<T> {
  onCancel?: () => void;
  onSubmit?: (data: T) => void;
}

export interface FormModalProps<T> extends ModalProps {
  Form: React.JSXElementConstructor<T>;
  FormProps: T;
}

export function FormModal<T extends FormComponentProps<T2>, T2>({
  Form,
  FormProps,
  ...props
}: FormModalProps<T>) {
  return (
    <Modal {...props}>
      <Form
        {...FormProps}
        onCancel={props.onClose}
        onSubmit={e => {
          FormProps.onSubmit && FormProps.onSubmit(e);
          props.onClose && props.onClose();
        }}
      />
    </Modal>
  );
}

export default FormModal;
