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
  typography: {
    fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
    h1: {
      fontSize: "40px",
      fontWeight: 700,
      color: "#191919",
    },
    h2: {
      fontSize: "32px",
      fontWeight: 700,
      color: "#191919",
    },
    h3: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#191919",
    },
    h4: {
      fontSize: "18px",
      fontWeight: 700,
      color: "#191919",
    },
    body1: {
      fontSize: "14px",
      fontWeight: 400,
      color: "#191919",
    },
    body2: {
      fontSize: "16px",
      fontWeight: 400,
      color: "#191919",
    },
    button: {
      fontSize: "14px",
      fontWeight: 400,
      textTransform: "none",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1536,
    },
  },
});

export default theme;
