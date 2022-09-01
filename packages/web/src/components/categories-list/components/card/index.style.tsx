import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  active?: boolean;
  size?: "small" | "medium";
}

export const useStyle = makeStyles<StyleProps, "image">()(
  (theme, { size, active }, classes) => ({
    root: {
      borderRadius: theme.spacing(2),
      gap: theme.spacing(1),

      ...(size === "medium" && {
        flexDirection: "column",
        padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
        [`> .${classes.image}`]: {
          width: "2rem",
          height: "2rem",
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
  })
);
