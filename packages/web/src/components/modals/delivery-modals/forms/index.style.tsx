import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  deliveryCondition: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
}));
