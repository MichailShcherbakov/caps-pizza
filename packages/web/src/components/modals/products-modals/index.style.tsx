import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  uploadImageBtn: {
    width: "200px",
    height: "200px",
  },
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
    gap: theme.spacing(2),

    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      margin: 0,
    },
  },
}));
