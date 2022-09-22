import { Stack, Typography } from "@mui/material";
import NextLink from "next/link";

export interface LogoProps {}

export const Logo: React.FC<LogoProps> = () => {
  return (
    <Stack direction="row" alignItems="center">
      <NextLink href="/" passHref>
        <Stack component="a">
          <Typography variant="h3" color="secondary">
            Пицца от КЭПа
          </Typography>
          <Typography variant="subtitle1" component="span" color="secondary">
            Админ панель
          </Typography>
        </Stack>
      </NextLink>
    </Stack>
  );
};

export default Logo;
