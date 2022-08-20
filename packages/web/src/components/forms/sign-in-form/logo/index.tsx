import { Stack, StackProps, Typography } from "@mui/material";

export interface LogoProps extends StackProps {}

export const Logo: React.FC<LogoProps> = props => {
  return (
    <Stack {...props} direction="row" alignItems="center" spacing={2}>
      <Typography variant="h3" color="secondary">
        Пицца от КЭПа
      </Typography>
    </Stack>
  );
};

export default Logo;
