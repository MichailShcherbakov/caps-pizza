import { Backdrop, BackdropProps } from "@mui/material";
import LoadingIcon from "~/assets/pizza-loading.svg";
import { StyleProps, useStyle } from "./index.style";

export interface LoadingProps
  extends Omit<BackdropProps, "color">,
    StyleProps {}

export const LoadingBackdrop: React.FC<LoadingProps> = ({
  color = "primary",
  ...props
}) => {
  const { classes } = useStyle({ color });

  return (
    <Backdrop {...props} className={classes.root}>
      <LoadingIcon className={classes.icon} />
    </Backdrop>
  );
};

export default LoadingBackdrop;
