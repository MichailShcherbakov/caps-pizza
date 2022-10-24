import NextLink from "next/link";
import NextImage from "next/image";
import { Fade, Stack, Typography } from "@mui/material";
import makeStyles from "~/ui/theme/makesStyles";

export interface LogoProps {
  onlyIcon?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ onlyIcon }) => {
  const { classes } = useStyle();
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
        <Stack className={classes.imageContainer}>
          <NextImage
            src="/logo-v2.png"
            layout="fill"
            alt="Пицца от КЭПа"
            priority
          />
        </Stack>
        {!onlyIcon ? (
          <Fade in>
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

const useStyle = makeStyles()(() => ({
  imageContainer: {
    position: "relative",
    width: 48,
    height: 48,
    flexShrink: 0,
    flexGrow: 0,
  },
}));

export default Logo;
