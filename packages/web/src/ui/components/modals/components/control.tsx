import { Stack, StackProps } from "@mui/material";
import { useStyle } from "../index.style";

export interface ModalControlProps extends StackProps<any> {}

export const ModalControl: React.FC<ModalControlProps> = props => {
  const { classes } = useStyle({});

  return <Stack {...props} className={classes.modal} />;
};

export default ModalControl;
