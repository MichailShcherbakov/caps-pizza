import LogoIcon from "~/assets/logo.svg";
import { Fade, Stack, Typography } from "@mui/material";
import styles from "./index.module.scss";

export interface LogoProps {
  onlyIcon?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ onlyIcon }) => {
  return (
    <Stack
      component="a"
      href="/"
      direction="row"
      alignItems="center"
      className={styles["logo"]}
    >
      <LogoIcon className={styles["logo__icon"]} />
      {!onlyIcon ? (
        <Fade in={!onlyIcon}>
          <Typography variant="h3" className={styles["logo__text"]}>
            Пицца от КЭПа
          </Typography>
        </Fade>
      ) : undefined}
    </Stack>
  );
};

export default Logo;
