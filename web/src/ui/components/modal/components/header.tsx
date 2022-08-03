import { IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../index.module.scss";

export interface ModalHeaderProps {
  title: string;
  onExit?: () => void;
}

export default function ModalHeader({
  title,
  onExit = () => {},
}: ModalHeaderProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      className={styles["modal__header"]}
    >
      <Typography variant="h3" component="p">
        {title}
      </Typography>
      <IconButton onClick={onExit}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}
