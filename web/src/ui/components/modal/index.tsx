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

export const ModalForm: React.FC<ModalProps> = ({
  children,
  onSubmit = () => {},
  onCancel = () => {},
  ...props
}) => {
  return (
    <MUIModal
      {...props}
      className={styles["modal__background"]}
      closeAfterTransition
    >
      <Paper className={styles["modal"]}>{children}</Paper>
    </MUIModal>
  );
};
