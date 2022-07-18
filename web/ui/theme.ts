import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#ff7010",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#191919",
      contrastText: "#ffffff",
    },
  },
  breakpoints: {
    values: {
      xxs: 0,
      xs: 460,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1536,
    } as any,
  },
});

export default theme;
