import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  checked?: boolean;
}

export const useStyle = makeStyles<StyleProps>()((theme, { checked }) => ({
  root: {
    width: "100%",
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    cursor: "pointer",
    backgroundColor: "transparent",
    flexShrink: 0,

    ...(checked && {
      borderColor: theme.palette.primary.main,
    }),
  },
  image: {
    width: "80px",
    height: "80px",
  },
  title: {
    width: "min-content",
    textAlign: "center",
  },
}));
