import { IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface CookiesNotificationProps {
  onClose?: () => void;
}

export const CookiesNotification: React.FC<CookiesNotificationProps> = ({
  onClose = () => {},
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2} py={0.5}>
      <IconButton size="small" aria-label="close-button" onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <Typography>
        Мы используем cookies для быстрой и удобной работы сайта. Продолжая
        пользоваться сайтом, вы принимаете
        <Typography
          component="a"
          href="/policy"
          color="primary"
          target="_blank"
        >
          условия обработки персональных данных
        </Typography>
      </Typography>
    </Stack>
  );
};

export default CookiesNotification;
