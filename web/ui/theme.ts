import { createTheme, PaletteColor } from "@mui/material";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    neutral: Partial<PaletteColor>;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#ff7010",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FFEEE2;",
      contrastText: "#ff7010",
    },
    neutral: {
      main: "#191919;",
      contrastText: "#ffffff",
    },
  },
  breakpoints: {
    values: {
      xxs: 390,
      xs: 460,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1536,
    } as any,
  },
});

export default theme;
