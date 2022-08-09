import { Stack, StackProps } from "@mui/material";
import styles from "../index.module.scss";

export interface ModalContentProps extends StackProps {}

export default function ModalContent(props: ModalContentProps) {
  return (
    <Stack
      spacing={2}
      {...props}
      className={[styles["modal__inner"], props.className].join(" ")}
    />
  );
}
