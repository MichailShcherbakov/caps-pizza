import {
  Fade,
  Modal as MUIModal,
  ModalProps as MUIModalProps,
  Paper,
} from "@mui/material";

import styles from "./index.module.scss";

export interface ModalProps
  extends Omit<MUIModalProps, "children" | "onClose"> {
  children?:
    | React.ReactElement
    | (React.ReactElement | null | undefined)[]
    | null;
  component?: any;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  component,
  ...props
}) => {
  return (
    <MUIModal
      {...props}
      className={styles["modal__overlay"]}
      closeAfterTransition
    >
      <Fade in={props.open}>
        <Paper component={component} className={styles["modal"]}>
          {children}
        </Paper>
      </Fade>
    </MUIModal>
  );
};

export default Modal;
