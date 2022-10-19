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
    gap: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),

    [theme.breakpoints.down("md")]: {
      gap: theme.spacing(1),
    },
  },
  link: {
    color: theme.palette.text.primary,

    ["&:hover"]: {
      color: theme.palette.primary.main,
    },
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing(2),

    [theme.breakpoints.down("xxs")]: {
      flexDirection: "column",
      alignItems: "flex-end",
      gap: theme.spacing(1),
    },
  },
}));
