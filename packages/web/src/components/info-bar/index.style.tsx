import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    width: "100%",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  deliveryTime: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));
