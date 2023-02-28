import { Components, Theme } from "@mui/material/styles";

export const makeComponents = (
  theme: Theme
): Components<Pick<Theme, "components">> => ({
  MuiPaper: {
    styleOverrides: {
      root: {
        boxShadow: "none",
        border: "1px solid",
        borderColor: theme.palette.divider,
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
      root: theme.unstable_sx({
        width: "100%",
        paddingX: 2,
        paddingY: 1,
        border: "none",
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: theme.unstable_sx({
        padding: 0.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: theme.spacing(1),

        "& > .MuiToggleButton-root.MuiToggleButtonGroup-grouped:not(:last-of-type)":
          {
            borderRadius: theme.spacing(1),

            "&:hover:not(.Mui-selected)": {
              backgroundColor: "transparent",
            },
          },

        "& > .MuiToggleButton-root.MuiToggleButtonGroup-grouped:not(:first-of-type)":
          {
            borderRadius: theme.spacing(1),

            "&:hover:not(.Mui-selected)": {
              backgroundColor: "transparent",
            },
          },
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
