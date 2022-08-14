import { Stack, StackProps } from "@mui/material";
import styles from "../index.module.scss";

export interface ModalControlProps extends StackProps<any> {}

export const ModalControl: React.FC<ModalControlProps> = props => {
  return <Stack {...props} className={styles["modal"]} />;
};

export default ModalControl;
