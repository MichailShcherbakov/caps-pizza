import { ButtonProps, Typography } from "@mui/material";
import React from "react";
import Modal, { ModalProps } from ".";
import ModalHeader from "./components/header";
import ModalFooter, { ModalFooterProps } from "./components/footer";
import ModalContent from "./components/content";
import { ModalControl } from "../components";

export interface NotificationModalProps extends ModalProps {
  title: string;
  desc?: string;
  variant?: "info" | "warning" | "error" | "success";
  AcceptButtonProps?: ButtonProps;
  CancelButtonProps?: ButtonProps;
  ModalFooterProps?: ModalFooterProps;
  onAccept?: () => void;
}

export const HEAD_TITLES = {
  info: "Информация",
  warning: "Внимание",
  error: "Ошибка",
  success: "Успешно",
};

export const NotificationModal: React.FC<NotificationModalProps> = ({
  title,
  desc,
  variant = "info",
  AcceptButtonProps,
  CancelButtonProps,
  ModalFooterProps,
  onAccept,
  ...props
}) => {
  return (
    <Modal {...props} onClose={props.onClose}>
      <ModalControl>
        <ModalHeader title={HEAD_TITLES[variant]} onExit={props.onClose} />
        <ModalContent justifyContent="center" spacing={1}>
          <Typography variant="h4" textAlign="center">
            {title}
          </Typography>
          {desc && <Typography textAlign="center">{desc}</Typography>}
        </ModalContent>
        <ModalFooter
          variant="accept"
          {...ModalFooterProps}
          AcceptButtonProps={{
            ...AcceptButtonProps,
            color: variant,
          }}
          CancelButtonProps={CancelButtonProps}
          onAccept={onAccept}
          onCancel={props.onClose}
        />
      </ModalControl>
    </Modal>
  );
};

export default NotificationModal;
