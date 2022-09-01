import { Theme } from "@mui/material";
import { TypographyOptions } from "@mui/material/styles/createTypography";
import { gray } from "./colors";

export const makeTypography = (theme: Theme): TypographyOptions => ({
  fontFamily: "Inter",
  h1: {
    fontSize: 34,
    fontWeight: 700,
    color: gray[900],
    [theme.breakpoints.down("sm")]: {
      fontSize: 28,
    },
  },
  h2: {
    fontSize: 32,
    fontWeight: 700,
    color: gray[900],
    [theme.breakpoints.down("sm")]: {
      fontSize: 24,
    },
  },
  h3: {
    fontSize: 24,
    fontWeight: 700,
    color: gray[900],
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
    },
  },
  h4: {
    fontSize: 18,
    fontWeight: 700,
    color: gray[900],
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
  },
  h5: {
    fontSize: 16,
    fontWeight: 700,
    color: gray[900],
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  h6: {
    fontSize: 14,
    fontWeight: 700,
    color: gray[900],
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  body1: {
    fontSize: 14,
    fontWeight: 500,
    color: gray[900],
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  body2: {
    fontSize: 16,
    fontWeight: 500,
    color: gray[900],
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  button: {
    fontSize: 14,
    fontWeight: 500,
    textTransform: "none",
    [theme.breakpoints.down("sm")]: {
      fontSize: 13,
    },
  },
  subtitle1: {
    fontSize: 12,
    fontWeight: 500,
    color: gray[400],
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  subtitle2: {
    fontSize: 12,
    fontWeight: 500,
    color: gray[900],
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
});
