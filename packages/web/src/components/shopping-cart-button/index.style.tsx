import makeStyles from "~/ui/theme/makesStyles";

export type ShoppingCartButtonVariants = "outlined" | "filled & rounded";

export interface StyleProps {
  variant?: ShoppingCartButtonVariants;
}

export const useStyle = makeStyles<StyleProps>()((theme, { variant }) => ({
  root: {
    position: "relative",
    flexShrink: 0,
    padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
    zIndex: 1,
    whiteSpace: "nowrap",

    ...(variant === "filled & rounded" && {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      display: "none",
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      backgroundColor: theme.palette.primary.main,
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.25)",

      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },

      "&:active": {
        backgroundColor: theme.palette.primary.main,
      },
    }),

    [theme.breakpoints.down("md")]: {
      ...(variant === "outlined" && {
        display: "none",
      }),
      ...(variant === "filled & rounded" && {
        display: "flex",
      }),
    },
  },
  icon: {
    width: "20px",
    height: "20px",
    fill: theme.palette.primary.main,

    ...(variant === "filled & rounded" && {
      width: "24px",
      height: "24px",
      fill: theme.palette.primary.contrastText,
    }),
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "20px",
    height: "20px",
    flexGrow: 0,
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.contrastText,
    border: "1px solid",
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
}));
