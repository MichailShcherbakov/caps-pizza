import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  active?: boolean;
  size?: "small" | "medium";
}

export const useStyle = makeStyles<StyleProps, "image">({
  uniqId: "QnWmDL",
})((theme, { size, active }, classes) => ({
  root: {
    alignItems: "center",
    borderRadius: theme.spacing(2),
    textAlign: "center",

    ...(size === "medium" && {
      flexDirection: "column",
      justifyContent: "center",
      width: "7rem",
      height: "6rem",
      padding: 0,

      [`> .${classes.image}`]: {
        width: "2rem",
        height: "2rem",
      },

      [theme.breakpoints.down("md")]: {
        flexDirection: "row",
        width: "auto",
        height: "auto",
        whiteSpace: "nowrap",

        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,

        [`> .${classes.image}`]: {
          width: "1.5rem",
          height: "1.5rem",
        },
      },
    }),

    ...(size === "small" && {
      whiteSpace: "nowrap",
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,

      [`> .${classes.image}`]: {
        width: "1.5rem",
        height: "1.5rem",
      },

      ...(active && {
        backgroundColor: "#ff701030",

        "&:hover": {
          backgroundColor: "#ff701030",
        },
      }),
    }),
  },
  image: {
    position: "relative",
    flexShrink: 0,
    flexGrow: 0,

    ...(size === "medium" && {
      marginBottom: theme.spacing(1),

      [theme.breakpoints.down("md")]: {
        marginBottom: 0,
        marginRight: theme.spacing(1),
      },
    }),

    ...(size === "small" && {
      marginRight: theme.spacing(1),
    }),
  },
}));
