import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(4),
    padding: `${theme.spacing(1)} 0`,
  },
}));
