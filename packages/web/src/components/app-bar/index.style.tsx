import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(() => ({
  root: {
    borderLeft: "0",
    borderRight: "0",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
  },
  container: {
    width: "100%",
    height: "72px",
  },
}));
