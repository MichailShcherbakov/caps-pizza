import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    backgroundColor: theme.palette.primary.light,
  },
}));
