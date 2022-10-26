import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
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
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      margin: 0,
    },
  },
}));
