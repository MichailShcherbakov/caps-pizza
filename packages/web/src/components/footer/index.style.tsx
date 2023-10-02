import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {}

export const useStyle = makeStyles<StyleProps>()(theme => ({
  root: {
    width: "100%",
    paddingBottom: "64px",

    [theme.breakpoints.down("md")]: {
      paddingBottom: 0,
    },
  },
  icon: {
    width: "20px",
    height: "20px",
  },
  link: {
    color: theme.palette.text.primary,
    ["&:hover"]: {
      color: theme.palette.primary.main,
    },
  },
  section: {
    padding: `${theme.spacing(2)} 0`,
    paddingRight: theme.spacing(4),
  },
  copyright: {
    display: "none",

    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  hiddenCopyright: {
    display: "none",
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(2),

    [theme.breakpoints.down("md")]: {
      display: "flex",
    },
  },
}));
