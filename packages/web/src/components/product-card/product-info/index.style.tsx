import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    height: "100%",
    gap: theme.spacing(2),
  },
  specifics: {
    whiteSpace: "nowrap",

    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));
