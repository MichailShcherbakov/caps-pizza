import { Theme, useMediaQuery as useMQ } from "@mui/material";
import { breakpoints } from "./breakpoints";
import { palette } from "./palette";
import { components } from "./components";
import { makeTypography } from "./typography";

export const useMediaQuery = useMQ<Theme>;

import { createTheme } from "@mui/material";

export const theme = createTheme({
  breakpoints,
  palette,
  components,
});

theme.typography = {
  ...theme.typography,
  ...makeTypography(theme),
};

export default theme;
