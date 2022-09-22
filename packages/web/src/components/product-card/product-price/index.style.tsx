import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  specifics: {
    display: "none",
    whiteSpace: "nowrap",

    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
  price: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));
