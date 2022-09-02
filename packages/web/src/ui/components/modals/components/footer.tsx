import { Button, ButtonProps, Stack, StackProps } from "@mui/material";
import React from "react";
import { useStyle } from "../index.style";

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
    const { classes } = useStyle({});

    return (
      <Stack
        {...props}
        direction="row"
        alignItems="center"
        className={classes.footer}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          sx={{ width: "100%" }}
        >
          {children}
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          className={classes.footerControls}
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
      </Stack>
    );
  }
);

ModalFooter.displayName = "ModalFooter";

export default ModalFooter;
