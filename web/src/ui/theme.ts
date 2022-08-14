import { createTheme, PaletteColor, Theme, useMediaQuery as useMQ } from "@mui/material";
import "external-svg-loader";

declare module "@mui/material" {
  interface PaletteOptions {
    neutral: Partial<PaletteColor>;
  }
}

declare module "@mui/material/styles" {
  interface PaletteOptions {
    neutral: Partial<PaletteColor>;
  }

  interface BreakpointOverrides {
    xxs: true,
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldPropsColorOverrides {
    neutral: true;
  }
}

declare module "@mui/material/Checkbox" {
  interface CheckboxPropsColorOverrides {
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
      main: "#073b4c",
      contrastText: "#ffffff",
    },
    neutral: {
      main: "#95989b",
      contrastText: "#ffffff",
    },
    success: {
      main: "#2a9d8f",
      contrastText: "#ffffff",
    },
    error: {
      main: "#e63946",
      contrastText: "#ffffff",
    },
  },
  breakpoints: {
    values: {
      xxs: 390,
      xs: 450,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1536,
    } 
  },
});

export const useMediaQuery = useMQ<Theme>;

export default theme;
