import { Stack, Typography } from "@mui/material";
import NextLink from "next/link";

export interface LogoProps {}

export const Logo: React.FC<LogoProps> = () => {
  return (
    <Stack direction="row" alignItems="center">
      <NextLink href="/" passHref>
        <Typography variant="h3" component="a" color="secondary">
          Пицца от КЭПа
        </Typography>
      </NextLink>
    </Stack>
  );
};

export default Logo;
