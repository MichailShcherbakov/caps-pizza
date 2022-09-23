import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    height: "100%",
    gap: theme.spacing(2),
  },
  specifics: {
    whiteSpace: "nowrap",
  },
  header: {
    gap: theme.spacing(1),

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
}));
