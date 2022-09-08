import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
  },
  container: {
    padding: `${theme.spacing(2)} 0`,
    flexGrow: 1,

    [theme.breakpoints.down("sm")]: {
      padding: `${theme.spacing(2)} ${theme.spacing(2)} `,
    },
  },
}));
