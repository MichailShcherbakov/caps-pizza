import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    width: "100%",
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  deliveryTime: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),

    [theme.breakpoints.down("md")]: {
      "& > :not(style)+:not(style)": {
        margin: 0,
        marginTop: theme.spacing(0.5),
      },
    },
  },
  link: {
    color: theme.palette.text.primary,

    ["&:hover"]: {
      color: theme.palette.primary.main,
    },
  },
  linkContainer: {
    flexShrink: 0,

    [theme.breakpoints.down("xxs")]: {
      flexDirection: "column",
      alignItems: "flex-end",

      "& > :not(style)+:not(style)": {
        margin: 0,
        marginTop: theme.spacing(0.5),
      },
    },
  },
}));
