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
    children,
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
        direction="row"
        alignItems="center"
        spacing={2}
        className={styles["modal__footer"]}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          className="ui-w-full"
        >
          {children}
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
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
      </Stack>
    );
  }
);

ModalFooter.displayName = "ModalFooter";

export default ModalFooter;
