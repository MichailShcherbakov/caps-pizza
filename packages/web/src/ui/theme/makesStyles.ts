import { useTheme } from "@mui/material";
import { createMakeAndWithStyles } from "tss-react";

export const { makeStyles, withStyles } = createMakeAndWithStyles({
  useTheme,
});

export default makeStyles;
