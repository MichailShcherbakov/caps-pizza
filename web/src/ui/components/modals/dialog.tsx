import { Stack, Typography } from "@mui/material";
import Modal, { ModalProps } from ".";
import ModalHeader from "./components/header";
import ModalFooter from "./components/footer";

export interface DialogModalProps extends ModalProps {
  title: string;
  subtitle: string;
  desc?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const DialogModal: React.FC<DialogModalProps> = ({
  title,
  subtitle,
  desc,
  onSubmit,
  onCancel,
  onClose,
  ...props
}) => {
  return (
    <Modal {...props} onClose={onClose}>
      <ModalHeader title={title} onExit={onClose} exit />
      <Stack alignItems="center">
        <Typography variant="h5">{subtitle}</Typography>
        <Typography>{desc}</Typography>
      </Stack>
      <ModalFooter onSubmit={onSubmit} onCancel={onCancel} />
    </Modal>
  );
};

export default DialogModal;
