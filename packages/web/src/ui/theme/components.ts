import { experimental_sx as sx } from "@mui/material/styles";

export const components = {
  MuiPaper: {
    styleOverrides: {
      root: {
        boxShadow: "none",
      },
    },
  },
  MuiButtonGroup: {
    styleOverrides: {
      root: {
        boxShadow: "none",
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: sx({
        width: "100%",
        paddingX: 2,
        paddingY: 1,
        border: "none",
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: sx({
        padding: 0.5,
        border: "1px solid",
        borderColor: "neutral.light",
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      sizeSmall: {
        minHeight: "30px",
      },
      sizeMedium: {
        minHeight: "36px",
      },
      sizeLarge: {
        minHeight: "42px",
      },
    },
  },
};
