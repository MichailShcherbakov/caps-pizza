import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    width: "100%",
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
  },
  image: {
    borderRadius: theme.spacing(2),
  },
}));
