import { IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { useStyle } from "../index.style";

export interface ModalHeaderProps {
  title: string;
  exit?: boolean;
  onExit?: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = React.memo(
  ({ title, exit, onExit = () => {} }) => {
    const { classes } = useStyle({});

    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        className={classes.header}
      >
        <Typography variant="h4" component="p" className={classes.headerTitle}>
          {title}
        </Typography>
        {exit && (
          <IconButton onClick={onExit}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
    );
  }
);

ModalHeader.displayName = "ModalHeader";

export default ModalHeader;
