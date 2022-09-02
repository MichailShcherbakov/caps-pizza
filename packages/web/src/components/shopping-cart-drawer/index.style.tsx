import { DrawerProps } from "@mui/material";
import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps extends Pick<DrawerProps, "anchor"> {}

export const useStyle = makeStyles<StyleProps>()((theme, { anchor }) => ({
  root: {
    width: "420px",
    height: "100%",
    flexShrink: 0,
    padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
    gap: theme.spacing(2),
    overflow: "auto",

    ...(anchor === "bottom" && {
      width: "100%",
      height: "calc(100vh * 4 / 5)",

      borderTopLeftRadius: theme.spacing(2),
      borderTopRightRadius: theme.spacing(2),
    }),
  },
}));
