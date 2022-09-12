import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  loading?: boolean;
}

export const useStyle = makeStyles<StyleProps>()((theme, { loading }) => ({
  root: {
    position: "relative",
    alignSelf: "center",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    fill: theme.palette.neutral.light,

    "& > span img": {
      borderRadius: theme.spacing(1),
    },

    ...(loading && {
      "& > span img": {
        visibility: "hidden",
      },
    }),
  },
}));
