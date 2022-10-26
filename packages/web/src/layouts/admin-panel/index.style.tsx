import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    width: "100%",
    height: "100vh",
    overflow: "auto",
  },
  container: {
    width: "100%",
    height: "100%",
    padding: `${theme.spacing(2)} 0`,

    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  inner: {
    border: `1px solid`,
    borderColor: theme.palette.divider,
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(2)} 0`,
  },
}));
