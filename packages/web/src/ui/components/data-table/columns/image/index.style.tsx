import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  loading?: boolean;
}

export const useStyle = makeStyles<StyleProps>()((theme, { loading }) => ({
  root: {
    position: "relative",
    flexShrink: 0,
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
