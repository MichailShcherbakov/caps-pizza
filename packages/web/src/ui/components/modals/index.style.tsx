import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {}

export const useStyle = makeStyles<StyleProps>()(theme => ({
  root: {
    padding: `${theme.spacing(4)} ${theme.spacing(3)} `,
    borderRadius: theme.spacing(2),
    background: theme.palette.background.paper,
    overflow: "hidden",

    minWidth: "680px",
    maxWidth: "924px",

    maxHeight: "560px",

    [theme.breakpoints.down("md")]: {
      width: "100%",
      minWidth: "auto",
      maxHeight: "80vh",

      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,

      padding: `${theme.spacing(3)} ${theme.spacing(2)} `,
    },
  },
  overlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.down("md")]: {
      alignItems: "flex-end",
    },
  },
  modal: {
    overflow: "hidden",
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
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    padding: `${theme.spacing(2)} 0`,
  },
  footer: {
    width: "100%",
  },
}));
