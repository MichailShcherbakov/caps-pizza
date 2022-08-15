import { Backdrop, BackdropProps } from "@mui/material";
import LoadingIcon from "~/assets/pizza-loading.svg";
import styles from "./index.module.scss";

export interface LoadingProps extends BackdropProps {}

export const LoadingBackdrop: React.FC<LoadingProps> = ({
  color = "primary",
  ...props
}) => {
  return (
    <Backdrop {...props} sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <LoadingIcon
        className={[
          styles["ui-loading__icon"],
          styles[`ui-loading__icon--${color}`],
        ].join(" ")}
      />
    </Backdrop>
  );
};

export default LoadingBackdrop;
