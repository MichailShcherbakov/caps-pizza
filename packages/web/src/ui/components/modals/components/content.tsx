import { Stack, StackProps } from "@mui/material";
import React from "react";
import { useStyle } from "../index.style";

export interface ModalContentProps extends StackProps {}

export const ModalContent: React.FC<ModalContentProps> = ({
  className,
  ...props
}: ModalContentProps) => {
  const { classes, cx } = useStyle({});

  return <Stack {...props} className={cx(classes.inner, className)} />;
};

export default ModalContent;
