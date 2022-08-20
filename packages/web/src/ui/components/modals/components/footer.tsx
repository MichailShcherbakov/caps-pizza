import { Button, ButtonProps, Stack, StackProps } from "@mui/material";
import React from "react";
import styles from "../index.module.scss";

export interface ModalFooterProps extends StackProps {
  variant?: "dialog" | "accept";
  onAccept?: () => void;
  onCancel?: () => void;
  AcceptButtonProps?: ButtonProps;
  CancelButtonProps?: ButtonProps;
}

export const ModalFooter: React.FC<ModalFooterProps> = React.memo(
  ({
    variant = "dialog",
    AcceptButtonProps,
    CancelButtonProps,
    onAccept = () => {},
    onCancel = () => {},
    ...props
  }) => {
    return (
      <Stack
        {...props}
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        className={styles["modal__footer"]}
      >
        {variant === "dialog" && (
          <Button
            variant="text"
            color="neutral"
            {...CancelButtonProps}
            onClick={onCancel}
          >
            {CancelButtonProps?.children ?? "Отмена"}
          </Button>
        )}
        <Button
          type="submit"
          variant="text"
          color="secondary"
          {...AcceptButtonProps}
          onClick={onAccept}
        >
          {AcceptButtonProps?.children ?? "Ок"}
        </Button>
      </Stack>
    );
  }
);

ModalFooter.displayName = "ModalFooter";

export default ModalFooter;
