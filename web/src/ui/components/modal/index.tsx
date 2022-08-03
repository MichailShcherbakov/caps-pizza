import {
  Button,
  IconButton,
  Modal as MUIModal,
  ModalProps as MUIModalProps,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import styles from "./index.module.scss";

export interface ModalProps extends Omit<MUIModalProps, "children"> {
  children?: React.ReactElement | React.ReactElement[];
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function Modal({
  children,
  onSubmit = () => {},
  onCancel = () => {},
  onClose = () => {},
  ...props
}: ModalProps) {
  return (
    <MUIModal
      {...props}
      className={styles["modal__background"]}
      onClose={onClose}
    >
      <Paper className={styles["modal"]}>{children}</Paper>
    </MUIModal>
  );
}
