import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  collapse?: boolean;
}

export const useStyle = makeStyles<StyleProps>()((theme, { collapse }) => ({
  root: {
    position: "relative",
    marginTop: theme.spacing(2),

    ...(collapse && {
      width: "100%",
      height: "100px",
      overflow: "hidden",
    }),
  },
  curtain: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "linear-gradient(180deg, transparent, #fff)",
    zIndex: 1,
  },
  text: {
    width: "100%",
    height: "100%",
    whiteSpace: "pre-line",
  },
  btn: {
    width: "fit-content",
    margin: `${theme.spacing(2)} 0`,
  },
}));
