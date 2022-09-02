import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  color?: "primary" | "secondary";
}

export const useStyle = makeStyles<StyleProps>()((theme, { color }) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  icon: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    animation: "1.4s linear 0s infinite normal none running loading-animation",

    ...(color === "primary" && {
      fill: theme.palette.primary.main,
    }),

    ...(color === "secondary" && {
      fill: theme.palette.secondary.main,
    }),

    ["@keyframes loading-animation"]: {
      ["0%"]: {
        transform: "rotate(0deg)",
      },
      ["100%"]: {
        transform: "rotate(360deg)",
      },
    },
  },
}));
