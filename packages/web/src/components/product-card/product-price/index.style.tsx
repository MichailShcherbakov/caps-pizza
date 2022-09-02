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
  btn: {
    [theme.breakpoints.down("sm")]: {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
      borderColor: theme.palette.primary.light,

      "&:hover": {
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.light,
      },

      "&:active": {
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.light,
      },
    },
  },
  btnText: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  btnPrice: {
    display: "none",

    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
}));
