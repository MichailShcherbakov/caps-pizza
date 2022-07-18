import { Container, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./index.module.scss";

export interface CookiesNotificationProps {
  onClose?: () => void;
}

export const CookiesNotification: React.FC<CookiesNotificationProps> = ({
  onClose = () => {},
}) => {
  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        className={styles["cookies-notification"]}
      >
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Typography className={styles["cookies-notification__text"]}>
          Мы используем cookies для быстрой и удобной работы сайта. Продолжая
          пользоваться сайтом, вы принимаете{" "}
          <Typography
            color="primary"
            className={styles["cookies-notification__text"]}
            component="span"
          >
            условия обработки персональных данных
          </Typography>
        </Typography>
      </Stack>
    </Container>
  );
};

export default CookiesNotification;
