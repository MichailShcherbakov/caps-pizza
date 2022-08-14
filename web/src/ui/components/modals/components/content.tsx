import { Stack, StackProps } from "@mui/material";
import React from "react";
import styles from "../index.module.scss";

export interface ModalContentProps extends StackProps {}

export const ModalContent: React.FC<ModalContentProps> = (
  props: ModalContentProps
) => {
  return (
    <Stack
      spacing={2}
      {...props}
      className={[styles["modal__inner"], props.className].join(" ")}
    />
  );
};

export default ModalContent;
