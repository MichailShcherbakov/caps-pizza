import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    width: "100%",
  },
  deliveryTime: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));
