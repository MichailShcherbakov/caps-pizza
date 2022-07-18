import LogoIcon from "~/assets/logo.svg";
import { Stack, Typography } from "@mui/material";
import styles from "./index.module.scss";

export interface LogoProps {}

export const Logo: React.FC<LogoProps> = () => {
  return (
    <Stack direction="row" alignItems="center" className={styles["logo"]}>
      <LogoIcon className={styles["logo__icon"]} />
      <Typography variant="h3">Пицца от КЭПа</Typography>
    </Stack>
  );
};

export default Logo;
