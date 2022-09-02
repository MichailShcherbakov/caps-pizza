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
    gap: theme.spacing(1),

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

        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,

        [`> .${classes.image}`]: {
          width: "1.5rem",
          height: "1.5rem",
        },
      },
    }),

    ...(size === "small" && {
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,

      [`> .${classes.image}`]: {
        width: "1.5rem",
        height: "1.5rem",
      },

      ...(active && {
        backgroundColor: theme.palette.primary.light,
        "&:hover": {
          backgroundColor: theme.palette.primary.light,
        },
      }),
    }),
  },
  image: {
    position: "relative",
  },
}));
