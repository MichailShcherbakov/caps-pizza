import { Stack, Typography } from "@mui/material";
import LogoIcon from "~/assets/logo.svg";
import styles from "./index.module.scss";

export interface LogoProps {}

export const Logo: React.FC<LogoProps> = () => {
  return (
    <Stack direction="row" alignItems="center" className={styles["logo"]}>
      <Typography variant="h3" component="p" className={styles["logo__title"]}>
        Пицца от КЭПа
      </Typography>
    </Stack>
  );
};

export default Logo;
