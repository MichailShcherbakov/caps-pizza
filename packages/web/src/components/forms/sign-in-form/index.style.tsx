import { white } from "~/ui/theme/colors";
import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {}

export const useStyle = makeStyles()(theme => ({
  root: {
    width: "480px",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(6)} ${theme.spacing(3)}`,
    backgroundColor: white,

    [theme.breakpoints.down("lg")]: {
      width: "440px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "360px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  illustration: {
    display: "none",
    width: "640px",
    height: "640px",

    [theme.breakpoints.down("md")]: {
      display: "flex",

      width: "320px",
      height: "320px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "280px",
      height: "280px",
    },
    [theme.breakpoints.down("xxs")]: {
      width: "240px",
      height: "240px",
    },
  },
}));
