import {
  Fade,
  Modal as MUIModal,
  ModalProps as MUIModalProps,
  Stack,
} from "@mui/material";
import { useStyle } from "./index.style";

export interface ModalProps
  extends Omit<MUIModalProps, "children" | "onClose"> {
  children?:
    | React.ReactElement
    | (React.ReactElement | null | undefined)[]
    | null;
  component?: string;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  component,
  ...props
}) => {
  const { classes } = useStyle({});

  return (
    <MUIModal {...props} className={classes.overlay} closeAfterTransition>
      <Fade in={props.open}>
        <Stack
          component={component as React.ElementType}
          className={classes.root}
        >
          {children}
        </Stack>
      </Fade>
    </MUIModal>
  );
};

export default Modal;
