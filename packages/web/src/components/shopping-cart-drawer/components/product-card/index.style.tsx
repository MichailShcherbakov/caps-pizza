import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    width: "100%",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
  },
  image: {
    position: "relative",
    flexShrink: 0,
    width: "120px",
    height: "120px",

    "& > span img": {
      objectFit: "cover",
      borderRadius: theme.spacing(2),
    },
  },
  price: {
    whiteSpace: "nowrap",
  },
}));
