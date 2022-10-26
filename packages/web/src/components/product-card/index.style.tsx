import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    width: "100%",
    height: "100%",
    overflow: "auto",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",

      "& > :not(style)+:not(style)": {
        margin: 0,
        marginLeft: theme.spacing(2),
      },
    },
  },
  inner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",

    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
}));
