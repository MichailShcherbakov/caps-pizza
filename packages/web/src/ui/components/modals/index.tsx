import {
  Fade,
  Modal as MUIModal,
  ModalProps as MUIModalProps,
  Stack,
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
        <Stack component={component} className={styles["modal"]}>
          {children}
        </Stack>
      </Fade>
    </MUIModal>
  );
};

export default Modal;
