import { createTheme, PaletteColor } from "@mui/material";
import "external-svg-loader";

export namespace Theme {
  export type Color =
    // | "neutral"
    "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

declare module "@mui/material" {
  interface PaletteOptions {
    neutral: Partial<PaletteColor>;
  }
}

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

declare module "@mui/material/TextField" {
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
      main: "#073b4c",
      contrastText: "#ffffff",
    },
    neutral: {
      main: "#95989b",
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
    } as any,
  },
});

export default theme;
