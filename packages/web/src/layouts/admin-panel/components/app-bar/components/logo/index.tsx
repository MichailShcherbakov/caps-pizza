import { Stack, Typography } from "@mui/material";

export interface LogoProps {}

export const Logo: React.FC<LogoProps> = () => {
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="h3" component="p" color="secondary">
        Пицца от КЭПа
      </Typography>
    </Stack>
  );
};

export default Logo;
