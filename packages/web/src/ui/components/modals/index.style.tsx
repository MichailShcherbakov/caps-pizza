import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {}

export const useStyle = makeStyles<StyleProps>()(theme => ({
  root: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    background: theme.palette.background.paper,

    [theme.breakpoints.down("sm")]: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  overlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.down("sm")]: {
      alignItems: "flex-end",
    },
  },
  modal: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "680px",
    maxHeight: "480px",
    gap: theme.spacing(2),

    [theme.breakpoints.up("sm")]: {
      minWidth: theme.breakpoints.values.sm,
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      maxHeight: "80vh",
    },
  },
  header: {
    width: "100%",
  },
  headerTitle: {
    width: "100%",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  inner: {
    width: "100%",
    minHeight: "fit-centent",
    overflow: "auto",
    padding: `${theme.spacing(2)} 0`,
    gap: theme.spacing(2),
  },
  footer: {
    width: "100%",
  },
  footerControls: {
    gap: theme.spacing(1),
  },
}));
