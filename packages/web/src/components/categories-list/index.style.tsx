import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  width?: "full" | "auto";
}

export const useStyle = makeStyles<StyleProps>()((theme, { width }) => ({
  root: {
    width: "100%",
    justifyContent: "space-between",
    overflow: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing(2),

    ...(width === "full" && {
      justifyContent: "flex-start",
    }),

    ...(width === "auto" && {
      width: "auto",
      justifyContent: "flex-start",
    }),

    ["&::-webkit-scrollbar"]: {
      display: "none",
    },

    [theme.breakpoints.down("md")]: {
      justifyContent: "flex-start",
    },
  },
}));
