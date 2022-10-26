import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    height: "100%",
  },
  specifics: {
    whiteSpace: "nowrap",
  },
  header: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",

      "& > :not(style)+:not(style)": {
        margin: 0,
        marginTop: theme.spacing(1),
      },
    },
  },
}));
