import LogoIcon from "~/assets/logo.svg";
import { Fade, Stack, Typography } from "@mui/material";

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
      spacing={2}
      sx={{
        cursor: "pointer",
      }}
    >
      <LogoIcon
        sx={{
          width: "1.5rem",
          height: "1.5rem",
        }}
      />
      {!onlyIcon ? (
        <Fade in={!onlyIcon}>
          <Typography variant="h3">Пицца от КЭПа</Typography>
        </Fade>
      ) : undefined}
    </Stack>
  );
};

export default Logo;
