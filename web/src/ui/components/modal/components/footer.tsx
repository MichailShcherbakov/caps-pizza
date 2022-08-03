import { Button, Stack, StackProps } from "@mui/material";
import styles from "../index.module.scss";

export interface ModalFooterProps extends StackProps {
  onCancel?: () => void;
  onSubmit?: () => void;
}

export default function ModalFooter({
  onCancel = () => {},
  onSubmit = () => {},
  ...props
}: ModalFooterProps) {
  return (
    <Stack
      {...props}
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      className={styles["modal__footer"]}
    >
      <Button variant="contained" color="neutral" onClick={onCancel}>
        Отмена
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        onClick={onSubmit}
      >
        Ок
      </Button>
    </Stack>
  );
}
