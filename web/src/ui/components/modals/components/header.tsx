import { IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../index.module.scss";
import React from "react";

export interface ModalHeaderProps {
  title: string;
  exit?: boolean;
  onExit?: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = React.memo(
  ({ title, exit, onExit = () => {} }) => {
    return (
      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        className={styles["modal__header"]}
      >
        <Typography
          variant="h4"
          component="p"
          className="ui-w-full ui-truncate"
        >
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
