import React from "react";
import Modal, { ModalProps } from ".";
import ModalContent from "./components/content";
import ModalFooter from "./components/footer";
import ModalHeader from "./components/header";

export interface FormModalProps extends ModalProps {
  title: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const FormModal: React.FC<FormModalProps> = React.memo(
  ({ title, onSubmit, onClose, onCancel, children, ...props }) => {
    return (
      <Modal {...props} component="form" onSubmit={onSubmit} onClose={onClose}>
        <ModalHeader title={title} onExit={onClose} />
        <ModalContent>{children}</ModalContent>
        <ModalFooter onCancel={onCancel} />
      </Modal>
    );
  }
);

FormModal.displayName = "FormModal";

export default FormModal;
