import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    ["& > .MuiButtonGroup-grouped"]: {
      minWidth: "fit-content",
      padding: `${theme.spacing(1)} ${theme.spacing(1.25)}`,
    },
    ["& > .MuiButtonGroup-grouped:not(:last-of-type)"]: {
      border: "none",
    },
  },
  label: {
    padding: `${theme.spacing(0)} ${theme.spacing(1.5)}`,
    backgroundColor: theme.palette.primary.light,
  },
}));
