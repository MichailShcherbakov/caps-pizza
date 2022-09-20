import NextLink from "next/link";
import LogoIcon from "~/assets/logo.svg";
import { Fade, Stack, Typography } from "@mui/material";

export interface LogoProps {
  onlyIcon?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ onlyIcon }) => {
  return (
    <NextLink href="/" passHref>
      <Stack
        component="a"
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
            <Stack>
              <Typography variant="h3" component="span" color="text.primary">
                Пицца от КЭПа
              </Typography>
              <Typography
                variant="subtitle1"
                component="span"
                color="text.primary"
              >
                🍕 Вкусно до последней корочки!
              </Typography>
            </Stack>
          </Fade>
        ) : undefined}
      </Stack>
    </NextLink>
  );
};

export default Logo;
