import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    width: "100%",
    height: "100%",
    gap: theme.spacing(2),
    overflow: "auto",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
    },
  },
  inner: {
    width: "100%",
    height: "100%",
    gap: theme.spacing(2),
  },
}));
