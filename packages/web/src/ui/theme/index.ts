import { Theme, useMediaQuery as useMQ } from "@mui/material";
import { breakpoints } from "./breakpoints";
import { palette } from "./palette";
import { makeComponents } from "./components";
import { makeTypography } from "./typography";

export const useMediaQuery = useMQ<Theme>;

import { createTheme } from "@mui/material";

export const theme = createTheme({
  breakpoints,
  palette,
});

theme.typography = {
  ...theme.typography,
  ...makeTypography(theme),
};

theme.components = {
  ...theme.components,
  ...makeComponents(theme),
};

export default theme;
