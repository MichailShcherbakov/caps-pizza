import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  loading?: boolean;
}

export const useStyle = makeStyles<StyleProps>()((theme, { loading }) => ({
  root: {
    position: "relative",
    alignSelf: "center",
    width: "120px",
    height: "120px",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    fill: theme.palette.neutral.light,

    "& > span img": {
      objectFit: "cover",
      borderRadius: theme.spacing(2),
    },

    ...(loading && {
      "& > span img": {
        visibility: "hidden",
      },
    }),
  },
}));
