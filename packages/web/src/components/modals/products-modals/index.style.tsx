import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  imageLoading?: boolean;
}

export const useStyle = makeStyles<StyleProps>()((theme, { imageLoading }) => ({
  image: {
    position: "relative",
    width: "200px",
    height: "200px",
    flexShrink: 0,
    fill: theme.palette.neutral.light,

    ...(imageLoading && {
      "& > span img": {
        visibility: "hidden",
      },
    }),
  },
  modifierList: {
    padding: 0,
  },
  modifierListTitle: {
    position: "relative",
    padding: `0 ${theme.spacing(1)}`,
    paddingBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  },
  productFeatures: {
    gap: theme.spacing(2),

    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      margin: 0,
    },
  },
}));
