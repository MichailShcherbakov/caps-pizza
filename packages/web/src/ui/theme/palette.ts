import { PaletteOptions } from "@mui/material";
import { PaletteColor } from "@mui/material";
import { blue, gray, orange, red, white } from "./colors";

declare module "@mui/material" {
  interface Palette {
    neutral: PaletteColor;
    primaryLight: PaletteColor;
    secondaryLight: PaletteColor;
  }
  interface PaletteOptions {
    neutral: PaletteColor;
    primaryLight: PaletteColor;
    secondaryLight: PaletteColor;
  }
}

declare module "@mui/material/styles" {
  interface PaletteOptions {
    neutral: PaletteColor;
    primaryLight: PaletteColor;
    secondaryLight: PaletteColor;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
    primaryLight: true;
    secondaryLight: true;
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

export const palette: PaletteOptions = {
  divider: gray[100],
  neutral: {
    main: gray[500],
    contrastText: white,
    light: gray[100],
    dark: gray[500],
  },
  primary: {
    main: orange[400],
    contrastText: white,
    light: orange[100],
    dark: orange[400],
  },
  secondary: {
    main: blue[400],
    contrastText: white,
    light: blue[50],
    dark: blue[400],
  },
  primaryLight: {
    main: "#ffeee2",
    contrastText: "#ff7010",
    dark: "#ffeee2",
    light: "#ffeee2",
  },
  secondaryLight: {
    main: "#dae6ea",
    contrastText: "#073b4c",
    dark: "#dae6ea",
    light: "#dae6ea",
  },
  success: {
    main: "#2a9d8f",
    contrastText: white,
    light: "#2a9d8f",
    dark: "#2a9d8f",
  },
  error: {
    main: red[400],
    contrastText: white,
    light: red[400],
    dark: red[400],
  },
  text: {
    primary: gray[900],
    secondary: gray[400],
  },
};
