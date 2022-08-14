import React from "react";
import Modal, { ModalProps } from ".";

export interface FormModalProps<T = any> extends ModalProps {
  Form: React.ElementType<T>;
  FormProps: T;
}

export const FormModal: React.FC<FormModalProps> = ({
  Form,
  FormProps,
  ...props
}) => {
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
};

FormModal.displayName = "FormModal";

export default FormModal;
