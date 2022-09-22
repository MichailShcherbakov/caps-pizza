import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  cover?: boolean;
}

export const useStyle = makeStyles<StyleProps>()((theme, { cover }) => ({
  root: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflowX: "hidden",
    overflowY: "hidden",

    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      overflowY: "auto",
    },
  },
  image: {
    width: "360px",
    height: "360px",
    margin: theme.spacing(2),

    "> span img": {
      borderRadius: theme.spacing(2),

      ...(cover && {
        objectFit: "cover",
      }),
    },

    [theme.breakpoints.down("xs")]: {
      width: "300px",
      height: "300px",
    },
  },
  imageLayout: {},
  layout: {
    alignSelf: "stretch",
  },
  layoutContent: {
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto",

    [theme.breakpoints.down("md")]: {
      paddingBottom: theme.spacing(10),
    },
  },
  btn: {
    width: "100%",
    height: "44px",
    borderRadius: theme.spacing(3),
    whiteSpace: "nowrap",
  },
  btnLayout: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,

    [theme.breakpoints.down("md")]: {
      position: "fixed",
      left: 0,
      bottom: 0,
      padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
    },
  },
  exitBtn: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));
