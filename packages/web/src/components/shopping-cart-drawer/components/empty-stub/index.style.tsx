import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  image: {
    width: "280px",
    height: "280px",

    [theme.breakpoints.down("md")]: {
      width: "240px",
      height: "240px",
    },
  },
  text: {
    width: "100%",
    textAlign: "center",
  },
}));
