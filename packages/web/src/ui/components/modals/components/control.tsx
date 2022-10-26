import { Stack, StackProps } from "@mui/material";
import { useStyle } from "../index.style";

export interface ModalControlProps extends StackProps<any> {}

export const ModalControl: React.FC<ModalControlProps> = props => {
  const { classes } = useStyle({});

  return (
    <Stack
      {...props}
      direction="column"
      className={classes.modal}
      spacing={2}
    />
  );
};

export default ModalControl;
