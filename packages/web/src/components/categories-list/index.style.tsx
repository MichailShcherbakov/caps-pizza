import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  width?: "full" | "auto";
}

export const useStyle = makeStyles<StyleProps>()((theme, { width }) => ({
  root: {
    width: "100%",
    justifyContent: "space-between",
    overflow: "auto",
    alignItems: "center",
    paddingTop: theme.spacing(0.35),
    paddingBottom: theme.spacing(0.35),
    userSelect: "none",

    ...(width === "full" && {
      justifyContent: "flex-start",
    }),

    ...(width === "auto" && {
      width: "auto",
      justifyContent: "flex-start",
    }),

    "&::-webkit-scrollbar": {
      width: 3,
      height: 3,
    },

    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#ff701060",
      borderRadius: 20,
    },

    [theme.breakpoints.down("md")]: {
      justifyContent: "flex-start",
    },
  },
}));
