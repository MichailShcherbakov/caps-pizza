import { BreakpointsOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xxs: true;
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

export const breakpoints: BreakpointsOptions = {
  values: {
    xxs: 390,
    xs: 450,
    sm: 600,
    md: 900,
    lg: 1280,
    xl: 1536,
  },
};
