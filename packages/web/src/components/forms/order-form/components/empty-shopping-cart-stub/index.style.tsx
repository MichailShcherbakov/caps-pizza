import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    width: "100%",
    height: "100%",
    padding: `${theme.spacing(2)} 0`,
    flexGrow: 1,
  },
  image: {
    width: "320px",
    height: "320px",
  },
  text: {
    width: "100%",
    textAlign: "center",
  },
  link: {
    textAlign: "center",
  },
}));
