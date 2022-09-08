import { Components, experimental_sx as sx, Theme } from "@mui/material/styles";

export const makeComponents = (
  theme: Theme
): Components<Omit<Theme, "components">> => ({
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
        borderColor: "divider",
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
        "&:active": {
          boxShadow: "none",
        },
      },
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
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderColor: theme.palette.divider,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      notchedOutline: {
        borderColor: theme.palette.divider,
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      input: {
        display: "flex",
        flexDirection: "row",
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        minWidth: "96px",
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        [theme.breakpoints.down("xs")]: {
          width: "320px",
        },
      },
    },
  },
  MuiGrid: {
    styleOverrides: {
      "grid-xs-12": {
        width: "100%",
      },
    },
  },
});
